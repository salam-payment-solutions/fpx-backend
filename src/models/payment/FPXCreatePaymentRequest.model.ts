import { PaymentMessageType } from "src/enums/payment/payment-message-type"

export interface FPXCreatePaymentRequest {
    fpx_buyerAccNo: '',
    fpx_buyerBankBranch: '',
    fpx_buyerBankId: string //limit 10 character
    fpx_buyerEmail?: string // limit 50 character with valid email
    fpx_buyerIban: '',
    fpx_buyerId: '',
    fpx_buyerName: '',
    fpx_checkSum: string // no limit
    fpx_eaccountNum?: string | '' // set as null for B2C and remove it for B2B
    fpx_ebuyerID?: string | '' // set as null for B2C and remove it for B2B
    fpx_makerName: '',
    fpx_msgToken: string
    fpx_msgType: PaymentMessageType
    fpx_productDesc: string //limit 30 character with special character
    fpx_sellerBankCode: string //limit 2 character
    fpx_sellerExId: string //limit 10 character
    fpx_sellerExOrderNo: string //limit 40 character and no (`), (&)
    fpx_sellerId: string //limit 10 character
    fpx_sellerOrderNo: string //limit 40 character and no (`), (&)
    fpx_sellerTxnTime: string //limit 14 character
    fpx_txnAmount: string // limit 16 number, 2 decimal place
    fpx_txnCurrency: string //limit 3 character. default MYR
    fpx_version: string //limit 3 character. default value: 7.0
}
