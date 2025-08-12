
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import cors from "@fastify/cors";
import { AppModule } from './app.module';

async function bootstrap() {
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
  await app.listen(process.env.PORT);

  console.log('node environment:', process.env.NODE_ENV);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
