import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/module/auth.module';
import * as process from 'process';
import { ConfigModule } from '@nestjs/config';
import { AuthMiddleware } from './core/auth/auth.middelware';
import { WinstonModule } from 'nest-winston';
import options from './util/logger/winston';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`.env.${process.env?.NODE_ENV ?? 'dev'}`],
      cache: true,
      isGlobal: true,
    }),
    AuthModule,
    WinstonModule.forRoot(options),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude(
        { path: 'auth', method: RequestMethod.ALL },
        { path: 'auth/(.*)', method: RequestMethod.ALL }, // 추가된 경로
      )
      .forRoutes('*');
  }
}
