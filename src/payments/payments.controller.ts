import { $Enums, Bank, Payment, PaymentStatus } from '@prisma/client';
import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { DefaultResponse } from 'src/models/shared/default-response.model';
import { FPXCreatePaymentRequest } from 'src/models/payment/FPXCreatePaymentRequest.model';
import { FPXGetPaymentRequest } from 'src/models/payment/FPXGetPaymentRequest.model';
import { PaginatedResponse } from 'src/models/shared/paginated-response.model';
import { PaymentMessageType } from 'src/enums/payment/payment-message-type';
import { PaymentsService } from 'src/payments/payments.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { GetPaymentDTO } from './dto/get-payment.dto';

@Controller('payments')
export class PaymentsController {
  constructor(
    private readonly paymentsService: PaymentsService,
    private prisma: PrismaService,
  ) {}

  @Get()
  async findAll(
    @Query() query: GetPaymentDTO,
    @Query('skip') skip?: number,
    @Query('take') take?: number,
  ): Promise<PaginatedResponse<Payment>> {
    const where: any = {};
    if (query.transactionId)
      where.transactionId = { contains: query.transactionId };
    if (query.exchangeOrderNo)
      where.exchangeOrderNo = { contains: query.exchangeOrderNo };
    if (query.orderNo) where.orderNo = { contains: query.orderNo };
    if (query.referenceNo)
      where.referenceNo = { contains: query.referenceNo };
    if (query.type) where.type = { in: query.type.split(',') };
    if (query.payerEmail) where.payerEmail = { contains: query.payerEmail };
    if (query.payerPhone) where.payerPhone = { contains: query.payerPhone };
    if (query.payerName) where.payerName = { contains: query.payerName };
    if (query.sellerId) where.sellerId = { contains: query.sellerId };
    if (query.exchangeId) where.exchangeId = { contains: query.exchangeId };
    if (query.status) where.status = { in: query.status.split(',') };

    const payments = await this.prisma.payment.findMany({
      where,
      skip,
      take,
    });

    const totalCount = await this.prisma.payment.count({ where });

    const response: PaginatedResponse<Payment> = {
      statusCode: 200,
      message: 'Successfully retrieved payments',
      data: payments,
      totalCount: totalCount,
      currentPage: skip ? Math.ceil(skip / (take || 10)) + 1 : 1,
      pageSize: take || 10,
    };

    return response;
  }

  @Get('receipt-details')
  async getPaymentDetails(
    @Query('exchangeOrderNo') exchangeOrderNo: string,
    @Query('orderNo') orderNo: string,
    @Query('transactionId') transactionId: string,
  ): Promise<DefaultResponse<Payment | null>> {
    const payment = await this.paymentsService.getPaymentReceiptDetails(
      exchangeOrderNo,
      orderNo,
    );

    if (payment == null) {
      return {
        message: 'Payment not found',
        statusCode: 404,
        data: null,
      };
    }

    return {
      message: 'Successfully retrieved payment details',
      statusCode: 200,
      data: payment,
    };

    if (payment.isFlagged) {
      return {
        message: 'Successfully retrieved payment details',
        statusCode: 200,
        data: payment,
      };
    }

    const request: FPXGetPaymentRequest = {
      fpx_buyerAccNo: '',
      fpx_buyerBankBranch: '',
      fpx_buyerBankId: '',
      fpx_buyerIban: '',
      fpx_buyerId: '',
      fpx_buyerName: '',
      fpx_checkSum: '',
      fpx_makerName: '',
      fpx_msgToken: payment.type,
      fpx_msgType: PaymentMessageType.AE,
      fpx_productDesc: payment.description,
      fpx_sellerBankCode: payment.bank?.code || '',
      fpx_sellerExId: '',
      fpx_sellerExOrderNo: exchangeOrderNo,
      fpx_sellerId: '',
      fpx_sellerOrderNo: orderNo,
      fpx_sellerTxnTime: payment.fpxTransactionTime,
      fpx_txnAmount: payment.amount.toFixed(2),
      fpx_txnCurrency: '',
      fpx_version: '',
    };

    const response = await this.paymentsService.getFPXPaymentDetails(request);

    console.log('response', response);
  }

  @Post('create')
  async createPayment(
    @Body() createPaymentDto: CreatePaymentDto,
  ): Promise<DefaultResponse<FPXCreatePaymentRequest>> {
    let orderNo = this.paymentsService.generateOrderNo();
    let exchangeOrderNo = this.paymentsService.generateExchangeOrderNo();
    let fpxTransactionTime = this.paymentsService.generateTransactionTime();

    await this.paymentsService.createPayment(
      createPaymentDto,
      orderNo,
      exchangeOrderNo,
      fpxTransactionTime,
    );

    const paymentRequest =
      await this.paymentsService.getFPXCreatePaymentRequest(
        createPaymentDto,
        orderNo,
        exchangeOrderNo,
        fpxTransactionTime,
      );

    return {
      message: 'Successfully create payment request',
      statusCode: 201,
      data: paymentRequest,
    };
  }

  @Get('banks')
  async getBankList(): Promise<DefaultResponse<Bank[]>> {
    // get all bank that is active sort by bank display name
    const banks = await this.prisma.bank.findMany({
      where: {
        status: $Enums.DefaultStatus.ACTIVE,
      },
      orderBy: {
        displayName: 'asc',
      },
    });

    let response: DefaultResponse<Bank[]> = {
      message: 'Successfully retrieved bank list',
      statusCode: 200,
      data: banks,
    };

    return response;
  }

  @Post('bank-status')
  async updateBankStatusBasedOnFPX() {
    const fpxBankResponse = await this.paymentsService.getBankList();

    const FPXbanks = fpxBankResponse.fpx_bankList.map((bank) => {
      return bank.split('~');
    });

    let DBBanks = await this.prisma.bank.findMany();

    for (let bank of DBBanks) {
      const matchingFPXBank = FPXbanks.find(
        (fpxBank) => fpxBank[0] === bank.code,
      );

      if (matchingFPXBank) {
        // Update the bank status based on the FPX response
        await this.prisma.bank.update({
          where: { id: bank.id },
          data: {
            status:
              matchingFPXBank[1] === 'A'
                ? $Enums.DefaultStatus.ACTIVE
                : $Enums.DefaultStatus.INACTIVE,
          },
        });
      }
    }
  }
}
