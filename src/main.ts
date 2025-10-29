
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import cors from "@fastify/cors";
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  console.log('node environment:', process.env.NODE_ENV);

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter()
  );
  // Detect environment
  const isDev = process.env.NODE_ENV !== "production";

  // CORS config
  await app.register(cors, {
    origin: isDev
      ? "*" // Allow all in dev
      : [process.env.FRONTEND_URL], // Restrict in prod
    credentials: true // Only if you use cookies/auth headers
  });

  app.useGlobalPipes(
    new ValidationPipe({
      // whitelist: true, // Strip properties that are not in the DTO
      // forbidNonWhitelisted: true, // Throw error if unknown properties are sent
      transform: true, // Automatically transform payloads to DTO instances
    }),
  );

  const port = process.env.PORT || 3000;
  const ip = '0.0.0.0';
  await app.listen(port, ip);

  console.log(`Application is running on: http://${ip}:${port}`);
}
bootstrap();
