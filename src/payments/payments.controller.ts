import { Controller, Get } from '@nestjs/common';
import { PaymentsService } from 'src/payments/payments.service';

@Controller('payments')
export class PaymentsController {
    constructor(private readonly paymentsService: PaymentsService) {}

    @Get()
    findAll() {
        // Implement your logic here
        return [];
    }

    @Get('banks')
    async getBankList() {
        const banks = await this.paymentsService.getBankList();

        return banks;
    }
}