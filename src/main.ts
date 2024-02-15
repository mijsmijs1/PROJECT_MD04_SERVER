import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe, VersioningType } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, { cors: true });

  //Set version Api
  app.setGlobalPrefix('api')
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: ["1"]

  })
  //Global Validate
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true
  }))

  // Public folder puclic
  app.useStaticAssets('public')

  await app.listen(process.env.SV_PORT);
}

bootstrap();
