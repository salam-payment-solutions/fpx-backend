import axios from 'axios'
import fs from 'fs'
import { PaymentMessageToken } from 'src/enums/payment/payment-message-token'
import { PaymentMessageType } from 'src/enums/payment/payment-message-type'
import { FPXGetBanksRequest } from 'src/models/payment/FPXGetBanksRequest.model'
import jwt from 'jsonwebtoken'
import { createHmac, createSign } from 'crypto'
import qs from 'qs'

export class PaymentsService {
    private apiUrl = `${process.env.FPX_API_URL}/FPXMain`
    private sellerId = process.env.FPX_SELLER_ID
    private exchangeId = process.env.FPX_EXCHANGE_ID
    private version = '7.0'
    private 

    async processPayment(paymentData: any) {
        // Logic to process payment
    }

    public async getBankList() {
        const request: FPXGetBanksRequest = {
            fpx_msgType: PaymentMessageType.BE,
            fpx_msgToken: PaymentMessageToken.B2C,
            fpx_sellerExId: this.exchangeId,
            fpx_version: this.version,
            fpx_checkSum: '',
        }

        request.fpx_checkSum = this.generateChecksum(request)

        console.log('request:', request)
        console.log('url:', `${this.apiUrl}/RetrieveBankList`)

        return fetch(`${this.apiUrl}/RetrieveBankList`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: qs.stringify(request)
        })
        .then ( response => response.text())
        .then((responseString) => {
            let responseObject = {};
            let dataSplit = responseString.split("&")

            dataSplit.forEach((item) => {
                const [key, value] = item.split("=")
                responseObject[key] = decodeURIComponent(value) || null

                if (key === 'fpx_bankList') {
                    responseObject[key] = responseObject[key].split(",")
                }
            })
            console.log(responseObject)
            return responseObject
        })
            .catch((error) => {
                console.log(error)

                throw new Error('Failed to retrieve bank list')
            })

        const data = JSON.stringify(request)

        const config = {
            method: 'post',
            url: `${this.apiUrl}/RetrieveBankList`,
            headers: {
                'Content-Type': 'application/json',
            },
            data: data,
        }

        return await axios
            .request(config)
            .then((response) => {
                console.log(JSON.stringify(response.data))
                return []
            })
            .catch((error) => {
                console.log(error)

                throw new Error('Failed to retrieve bank list')
            })
    }

    private generateChecksum(request: FPXGetBanksRequest): string {
        const algo = "RSA-SHA1"
        const sortedKeys = Object.keys(request)
            .filter((key) => key !== 'fpx_checkSum')
            .sort()
        const sortedValues = sortedKeys
            .map((key) =>
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (request as Record<string, any>)[key]?.toString(),
            )
            .join('|')

        const privateKey = fs.readFileSync('src/key/fpx.key')

        // const hex = createHmac('sha256', privateKey)
        //     .update(sortedValues)
        //     .digest('hex').toUpperCase();

        // const sign = createSign('SHA256');
        // sign.update(sortedValues);
        // sign.end();
        // const hex = sign.sign(privateKey.toString()).toString('hex').toUpperCase();


        // const sign = createSign('SHA256');
        // sign.update(sortedValues);
        // sign.end();
        // const signature = sign.sign(privateKey);
        // const hex = signature.toString('hex').toUpperCase();

        const signer = createSign(algo);
        signer.update(sortedValues, "utf8");
        signer.end();

        // 4️⃣ Sign using your private key and output Base64
        const signature = signer.sign(privateKey, "hex").toUpperCase();


        console.log(sortedValues);

        console.log('signature', signature);

        // console.log('hex:', signature.toString('hex'));

        return signature
    }
}
