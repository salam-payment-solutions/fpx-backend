import { IsOptional, IsString } from 'class-validator';

export class GetPaymentDTO {
  @IsString()
  @IsOptional()
  transactionId?: string;

  @IsString()
  @IsOptional()
  exchangeOrderNo?: string;

  @IsString()
  @IsOptional()
  orderNo?: string;

  @IsString()
  @IsOptional()
  referenceNo?: string;

  @IsString({ each: true })
  @IsOptional()
  type?: string;

  @IsString()
  @IsOptional()
  payerEmail?: string;

  @IsString()
  @IsOptional()
  payerPhone?: string;

  @IsString()
  @IsOptional()
  payerName?: string;

  @IsString()
  @IsOptional()
  sellerId?: string;

  @IsString()
  @IsOptional()
  exchangeId?: string;

  @IsString({ each: true })
  @IsOptional()
  status?: string;
}
