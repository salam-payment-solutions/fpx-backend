import { PaymentMessageToken } from 'src/enums/payment/payment-message-token'
import { PaymentMessageType } from 'src/enums/payment/payment-message-type'

export interface FPXCreatePaymentRequest {
    fpx_buyerBankId: string //limit 10 character
    fpx_buyerEmail?: string // limit 50 character with valid email
    fpx_checkSum: string // no limit
    fpx_msgToken: PaymentMessageToken
    fpx_msgType: PaymentMessageType
    fpx_productDesc: string //limit 30 character with special character
    fpx_sellerBankCode: string //limit 2 character
    fpx_sellerExId: string //limit 10 character
    fpx_sellerExOrderNo: string //limit 40 character and no (`), (&)
    fpx_sellerId: string //limit 10 character
    fpx_sellerOrderNo: string //limit 40 character and no (`), (&)
    fpx_sellerTxnTime: string //limit 14 character
    fpx_txnAmount: number // limit 16 number, 2 decimal place
    fpx_txnCurrency: string //limit 3 character. default MYR
    fpx_version: string //limit 3 character. default value: 7.0
}
