import { CreatePaymentDto } from './dto/create-payment.dto'
import { CreatePaymentRequest } from './models/CreatePaymentRequest'
import { createSign } from 'crypto'
import { format, formatInTimeZone } from 'date-fns-tz'
import { FPXCreatePaymentRequest } from 'src/models/payment/FPXCreatePaymentRequest.model'
import { FPXGetBanksRequest } from 'src/models/payment/FPXGetBanksRequest.model'
import { FPXGetBanksResponse } from 'src/models/payment/FPXGetBanksResponse.model'
import { FPXGetPaymentRequest } from 'src/models/payment/FPXGetPaymentRequest.model'
import { Injectable } from '@nestjs/common'
import { Payment, Prisma } from '@prisma/client'
import { PaymentMessageToken } from 'src/enums/payment/payment-message-token'
import { PaymentMessageType } from 'src/enums/payment/payment-message-type'
import { PaymentWithBankAndSellerExchange } from 'src/models/payment/PaymentWithBankAndSellerExchange.model'
import { PrismaService } from 'src/prisma/prisma.service'
import axios from 'axios'
import fs from 'fs'
import qs from 'qs'

@Injectable()
export class PaymentsService {
    constructor(private prisma: PrismaService) { }

    private apiUrl = `${process.env.FPX_API_URL}/FPXMain`
    private currency = 'MYR'
    private exchangeId = process.env.FPX_EXCHANGE_ID
    private sellerBankCode = process.env.FPX_SELLER_BANK_CODE
    private sellerId = process.env.FPX_SELLER_ID
    private version = '7.0'

    public async getPaymentReceiptDetails(exchangeOrderNo: string, orderNo: string): Promise<PaymentWithBankAndSellerExchange | null> {
        return this.prisma.payment.findFirst({
            where: { exchangeOrderNo, orderNo },
            include: {
                bank: true,
                fpxSellerExchange: true,
            }
        });
    }

    public async createPayment(request: CreatePaymentDto, orderNo: string, exchangeOrderNo: string, fpxTransactionTime: string): Promise<Payment> {
        let currentSellerExchange = await this.prisma.fpxSellerExchange.findFirst({
            where: {
                sellerId: this.sellerId,
                exchangeId: this.exchangeId
            }
        });

        if (!currentSellerExchange) {
            throw new Error('Seller exchange not found');
        }

        const { bankCode, ...data } = request; // remove unwanted property

        let paymentData: Prisma.PaymentCreateInput = {
            ...data,
            orderNo,
            exchangeOrderNo,
            fpxTransactionTime,
            sellerId: this.sellerId,
            exchangeId: this.exchangeId,
            fpxSellerExchange: currentSellerExchange ? { connect: { id: currentSellerExchange.id } } : undefined,
            bank: { connect: { code: bankCode } }
        };

        let payment = await this.prisma.payment.create({
            data: paymentData
        });

        return payment;
    }

    public async getFPXPaymentDetails(request: FPXGetPaymentRequest) {
        request.fpx_buyerBankId = this.sellerBankCode;
        request.fpx_sellerExId = this.exchangeId;
        request.fpx_sellerId = this.sellerId;
        request.fpx_txnCurrency = this.currency;
        request.fpx_version = this.version;
        request.fpx_checkSum = this.generateChecksum(this.getChecksumData(request));

        return axios.post(`${this.apiUrl}/sellerNVPTxnStatus.jsp`, qs.stringify(request), {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        })
            .then((response) => {
                let responseObject = {};
                let dataSplit = response.data.split("&")

                dataSplit.forEach((item) => {
                    const [key, value] = item.split("=")
                    responseObject[key] = decodeURIComponent(value) || null
                })

                console.log('responseObject', responseObject);
                return responseObject as any
            })
            .catch((error) => {
                console.log(error)

                throw new Error('Failed to retrieve payment details')
            });
    }

    public async getFPXCreatePaymentRequest(data: CreatePaymentRequest, orderNo: string, exchangeOrderNo: string, fpxTransactionTime: string): Promise<FPXCreatePaymentRequest> {
        let returnValue: FPXCreatePaymentRequest = {
            fpx_buyerAccNo: '',
            fpx_buyerBankBranch: '',
            fpx_buyerBankId: data.bankCode,
            fpx_buyerEmail: data.payerEmail,
            fpx_buyerIban: '',
            fpx_buyerId: '',
            fpx_buyerName: '',
            fpx_checkSum: '',
            fpx_makerName: '',
            fpx_msgToken: PaymentMessageToken[data.type],
            fpx_msgType: PaymentMessageType.AR,
            fpx_productDesc: data.description,
            fpx_sellerBankCode: this.sellerBankCode,
            fpx_sellerExId: this.exchangeId,
            fpx_sellerExOrderNo: exchangeOrderNo,
            fpx_sellerId: this.sellerId,
            fpx_sellerOrderNo: orderNo,
            fpx_sellerTxnTime: fpxTransactionTime,
            fpx_txnAmount: data.amount.toString(),
            fpx_txnCurrency: this.currency,
            fpx_version: this.version,
        }

        let checksumArray = [
            returnValue.fpx_buyerAccNo,
            returnValue.fpx_buyerBankBranch,
            returnValue.fpx_buyerBankId,
            returnValue.fpx_buyerEmail,
            returnValue.fpx_buyerIban,
            returnValue.fpx_buyerId,
            returnValue.fpx_buyerName,
            returnValue.fpx_makerName,
            returnValue.fpx_msgToken,
            returnValue.fpx_msgType,
            returnValue.fpx_productDesc,
            returnValue.fpx_sellerBankCode,
            returnValue.fpx_sellerExId,
            returnValue.fpx_sellerExOrderNo,
            returnValue.fpx_sellerId,
            returnValue.fpx_sellerOrderNo,
            returnValue.fpx_sellerTxnTime,
            returnValue.fpx_txnAmount,
            returnValue.fpx_txnCurrency,
            returnValue.fpx_version
        ];

        // if (PaymentMessageToken[data.type] === PaymentMessageToken.B2C.toString()) {
        //     returnValue.fpx_eaccountNum = ''
        //     returnValue.fpx_ebuyerID = ''
        // }

        returnValue.fpx_checkSum = this.generateChecksum(checksumArray.join('|'))

        Object.entries(returnValue).forEach(([key, value]) => {
            console.log(`${key}:${value}`)
        })

        return returnValue
    }

    public async getBankList(): Promise<FPXGetBanksResponse> {
        const request: FPXGetBanksRequest = {
            fpx_msgType: PaymentMessageType.BE,
            fpx_msgToken: PaymentMessageToken.B2C,
            fpx_sellerExId: this.exchangeId,
            fpx_version: this.version,
            fpx_checkSum: '',
        }

        request.fpx_checkSum = this.generateChecksum(this.getChecksumData(request));

        return axios.post(`${this.apiUrl}/RetrieveBankList`, qs.stringify(request), {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        })
            .then((response) => {
                let responseObject = {};
                let dataSplit = response.data.split("&")

                dataSplit.forEach((item) => {
                    const [key, value] = item.split("=")
                    responseObject[key] = decodeURIComponent(value) || null

                    if (key === 'fpx_bankList') {
                        responseObject[key] = responseObject[key].split(",")
                    }
                })

                return responseObject as FPXGetBanksResponse
            })
            .catch((error) => {
                console.log(error)

                throw new Error('Failed to retrieve bank list')
            })
    }

    private getChecksumData(request: FPXGetBanksRequest | FPXGetPaymentRequest): string {
        const checksumArray: string[] = []
        const sortedKeys = Object.keys(request)
            .sort()

        for (let key of sortedKeys) {
            if (key !== 'fpx_checkSum') {
                console.log('key', key)
                checksumArray.push(`${(request as Record<string, any>)[key]}`)
            }
        }
        return checksumArray.join('|');
    }

    private generateChecksum(checksumData: string): string {
        const algo = "RSA-SHA1"
        const privateKey = fs.readFileSync('src/key/fpx.key')
        const signer = createSign(algo);

        signer.update(checksumData, "utf8");
        signer.end();

        const signature = signer.sign(privateKey, "hex").toUpperCase();

        return signature
    }

    generateExchangeOrderNo(): string {
        const randomNumber = Math.floor(Math.random() * 10000);
        const formattedDate = format(new Date(), 'yyMMddHHmmss', { timeZone: 'Asia/Singapore' })
        return `${formattedDate}${randomNumber}`
    }

    generateOrderNo(): string {
        const randomNumber = Math.floor(Math.random() * 10000);
        const formattedDate = format(new Date(), 'yyyyMMddHHmmss', { timeZone: 'Asia/Singapore' })
        return `${formattedDate}${randomNumber}`
    }

    generateTransactionTime(): string {
        let txnTime = formatInTimeZone(new Date(), 'Asia/Singapore', 'yyyyMMddHHmmss')
        return txnTime
    }
}
