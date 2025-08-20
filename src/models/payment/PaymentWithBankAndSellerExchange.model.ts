import { Bank, FpxSellerExchange, Payment } from "@prisma/client";

export interface  PaymentWithBankAndSellerExchange extends Payment {
    bank: Bank;
    fpxSellerExchange: FpxSellerExchange;
}