import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { PaymentsModule } from './payments/payments.module';
import { FpxModule } from './fpx/fpx.module';
import databaseConfig from './config/database.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Makes config available everywhere
      load: [databaseConfig],
      envFilePath: [`.env.${process.env.NODE_ENV}`, '.env'],

    }),
    PrismaModule,
    UsersModule,
    PaymentsModule,
    FpxModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
