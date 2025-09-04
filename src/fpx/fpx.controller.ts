import { Controller, Get, Query } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Controller('fpx')
export class FpxController {
    constructor() { }

    @Get('stg/service')
    getServiceStatus(@Query() query: any): string {
        // store all query in fpx.log file
        const logPath = path.join(__dirname, '../../fpx.log');
        const logEntry = `[${new Date().toISOString()}] ${JSON.stringify(query)}\n`;
        fs.appendFileSync('src/fpx/fpx.log', logEntry);

        console.log('FPX Service Status Query:', query);
        return 'Service sis running';
    }
}