import { PaymentMessageToken } from 'src/enums/payment/payment-message-token'
import { PaymentMessageType } from 'src/enums/payment/payment-message-type'

export interface FPXGetBanksRequest {
    fpx_msgType: PaymentMessageType
    fpx_msgToken: PaymentMessageToken
    fpx_sellerExId: string //limit 10 character
    fpx_version: string //limit 3 character. default value: 7.0
    fpx_checkSum: string // no limit
}
