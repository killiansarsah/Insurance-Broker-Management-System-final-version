import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Logger as PinoLogger } from 'nestjs-pino';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { json, urlencoded } from 'express';
import { join } from 'path';
import { mkdirSync, existsSync } from 'fs';
import { AppModule } from './app.module.js';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter.js';
import { createGlobalValidationPipe } from './common/pipes/validation.pipe.js';
import { DecimalSerializationInterceptor } from './common/interceptors/decimal-serialization.interceptor.js';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bodyParser: true,
    bufferLogs: true,
  });

  // Ensure uploads directory exists
  const uploadsDir = join(process.cwd(), 'uploads');
  if (!existsSync(uploadsDir)) {
    mkdirSync(uploadsDir, { recursive: true });
  }

  // Serve uploaded files at /uploads/
  app.useStaticAssets(uploadsDir, { prefix: '/uploads/' });

  // Use Pino for structured logging
  app.useLogger(app.get(PinoLogger));

  // Request body size limit: 10MB
  app.use(json({ limit: '10mb' }));
  app.use(urlencoded({ extended: true, limit: '10mb' }));

  const configService = app.get(ConfigService);
  const logger = new Logger('Bootstrap');

  // Security: Helmet with HSTS
  app.use(helmet({
    hsts: { maxAge: 31536000, includeSubDomains: true },
  }));

  // Cookie parsing (for refresh token cookies)
  app.use(cookieParser());

  // CORS
  const corsOrigins = configService.get<string[]>('cors.origins', [
    'http://localhost:3000',
  ]);
  app.enableCors({
    origin: corsOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Global prefix
  app.setGlobalPrefix('api/v1');

  // Global validation pipe
  app.useGlobalPipes(createGlobalValidationPipe());

  // Global exception filter
  app.useGlobalFilters(new GlobalExceptionFilter());

  // Global interceptor: convert Prisma Decimal objects to plain numbers
  app.useGlobalInterceptors(new DecimalSerializationInterceptor());

  // Swagger — disabled in production
  const swaggerEnabled = configService.get<boolean>('swagger.enabled', false);
  const isProduction = configService.get<string>('nodeEnv') === 'production';
  if (swaggerEnabled && !isProduction) {
    const throttleTtl = configService.get<number>('throttle.ttl', 60000) / 1000;
    const throttleLimit = configService.get<number>('throttle.limit', 100);
    const swaggerConfig = new DocumentBuilder()
      .setTitle('IBMS API')
      .setDescription(
        `Insurance Broker Management System API\n\n` +
        `**Rate Limiting:** ${throttleLimit} requests per ${throttleTtl}s window per IP.\n` +
        `Exceeding the limit returns HTTP 429 Too Many Requests.`,
      )
      .setVersion('1.0')
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          name: 'JWT',
          description: 'Enter JWT access token',
          in: 'header',
        },
        'JWT-auth',
      )
      .build();

    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('api/docs', app, document);
    logger.log('Swagger docs available at /api/docs');
  }

  const port = configService.get<number>('port', 3001);
  await app.listen(port);
  logger.log(`IBMS Backend running on port ${port}`);
  logger.log(
    `Environment: ${configService.get<string>('nodeEnv', 'development')}`,
  );
}

void bootstrap();
