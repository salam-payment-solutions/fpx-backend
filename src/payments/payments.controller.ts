import { Controller, Get, Post } from '@nestjs/common';
import { $Enums } from '@prisma/client';
import { BankListResponse } from 'src/models/payment/bankListResponse.model';
import { PaymentsService } from 'src/payments/payments.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Controller('payments')
export class PaymentsController {
    constructor(private readonly paymentsService: PaymentsService, private prisma: PrismaService) { }

    @Get()
    findAll() {
        // Implement your logic here
        return [];
    }

    @Get('banks')
    async getBankList() {
        const banks = await this.prisma.bank.findMany(
            {
                where: {
                    status: $Enums.DefaultStatus.ACTIVE
                }
            }
        );

        return {
            message: "Successfully retrieved bank list",
            statusCode: 200,
            data: banks
        }
    }

    @Post('bank-status')
    async updateBankStatusBasedOnFPX() {
        const fpxBankResponse = await this.paymentsService.getBankList();

        const FPXbanks = fpxBankResponse.fpx_bankList.map(bank => {
            return bank.split("~");
        });

        let DBBanks = await this.prisma.bank.findMany();

        for (let bank of DBBanks) {
            const matchingFPXBank = FPXbanks.find(fpxBank => fpxBank[0] === bank.code);

            if (matchingFPXBank) {
                // Update the bank status based on the FPX response
                await this.prisma.bank.update({
                    where: { id: bank.id },
                    data: { status: matchingFPXBank[1] === "A" ? $Enums.DefaultStatus.ACTIVE : $Enums.DefaultStatus.INACTIVE },
                });
            }
        }
    }
}