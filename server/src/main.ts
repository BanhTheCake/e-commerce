import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { ValidationError, useContainer } from 'class-validator';
import cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AllExceptionsFilter } from './catch-all.exception';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get<ConfigService>(ConfigService);

  app.setGlobalPrefix('/api/v1');
  app.enableCors({
    credentials: true,
    origin: configService.getOrThrow<string>('CLIENT_URL'),
  });
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );
  app.useGlobalFilters(new AllExceptionsFilter());
  app.use(cookieParser());

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  // setup swagger

  const config = new DocumentBuilder()
    .setTitle('E-commerce API docs')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: (req) => {
      req.credentials = 'include';
      return req;
    },
  });

  await app.listen(3000);
}
bootstrap();
