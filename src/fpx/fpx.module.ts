import { Module } from '@nestjs/common';
import { FpxController } from './fpx.controller';
import { PaymentsService } from 'src/payments/payments.service';

@Module({
  controllers: [FpxController],
  providers: [],
  exports: [],
})
export class FpxModule {};