import { PaymentMessageToken } from 'src/enums/payment/payment-message-token'
import { PaymentMessageType } from 'src/enums/payment/payment-message-type'

export interface FPXGetBanksResponse {
    fpx_msgType: PaymentMessageType
    fpx_msgToken: PaymentMessageToken
    fpx_sellerExId: string //limit 10 character
    fpx_bankList: string[]
    fpx_checkSum: string // no limit
}
