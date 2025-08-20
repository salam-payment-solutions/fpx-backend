import { PaymentMessageToken } from "@prisma/client";
import { Exclude, Expose } from "class-transformer";
import { IsDecimal, IsEmail, IsEnum, IsNumber, IsString, MaxLength, maxLength } from "class-validator";

export class CreatePaymentDto {
    
    @IsString()
    @MaxLength(30)
    referenceNo: string;
    
    @IsString()
    @MaxLength(30)
    description: string;
    
    @IsEnum(PaymentMessageToken)
    type: PaymentMessageToken;
    
    @IsEmail()
    payerEmail: string;

    @IsString()
    @MaxLength(255)
    payerName: string;
    
    @IsString()
    @MaxLength(15)
    payerPhone: string;

    @IsDecimal({ decimal_digits: '1,2' })
    amount: number;

    @IsString()
    bankCode: string;
}