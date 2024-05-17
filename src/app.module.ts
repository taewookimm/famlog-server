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
import { APP_FILTER } from '@nestjs/core';
import { ResultExceptionFilter } from './core/responseForm/filters/response-exception.filters';

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
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: ResultExceptionFilter,
    },
  ],
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
