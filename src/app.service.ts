import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(private configService: ConfigService) { }

  getHello(): string {
    return 'Hello World!' + `(${process.env.NODE_ENV})`;
  }

  getDatabaseUrl(): string {
    return this.configService.get<string>('DATABASE_URL');
  }

}
