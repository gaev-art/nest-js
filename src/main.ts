import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Config } from './firebase/firebase.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService) as ConfigService<Config, true>;
  const port = configService.get<string>('PORT', '5000');

  await app.listen(port);
}

bootstrap().then();
