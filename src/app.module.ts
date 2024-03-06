import { Logger, MiddlewareConsumer, Module } from '@nestjs/common';
import { UsersModule } from '@modules/users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { configService } from '@services/config.service';
import mongoose from 'mongoose';
import { AuthModule } from '@modules/auth/auth.module';
import { AppLoggerMiddleware } from './middlewares/logger.middleware';
import { ProblemsModule } from '@modules/problems/problems.module';
import { TagsModule } from '@modules/tags/tags.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { BullModule } from '@nestjs/bull';
import { ExecutionEngineModule } from '@modules/execution-engine/execution-engine.module';
import { AppController } from '@controllers/app.controller';
import { ContestsModule } from '@modules/contests/contests.module';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    ProblemsModule,
    TagsModule,
    ExecutionEngineModule,
    ContestsModule,
    MongooseModule.forRootAsync({
      imports: [],
      useFactory: async () => {
        try {
          const dbURL = configService.getEnv('MONGO_URI');
          const connectionFactory = (connection: mongoose.Connection) => {
            if (connection.readyState === 1) {
              Logger.log(`MongoDB Connected 🚀`, 'MongooseModule');
            }
            connection.on('disconnected', () => {
              Logger.warn(`MongoDB connection disconnected`, 'MongooseModule');
            });
            connection.on('error', (error) => {
              Logger.error(
                `MongoDB connection error: ${error}`,
                'MongooseModule',
              );
            });

            connection.on('reconnected', () => {
              Logger.log(`MongoDB reconnected 🚀`, 'MongooseModule');
            });

            connection.on('reconnectFailed', () => {
              Logger.error(`MongoDB ReconnectFailed`, 'MongooseModule');
            });

            connection.on('connecting', () => {
              Logger.log(`MongoDB Connecting...`, 'MongooseModule');
            });

            connection.on('connected', () => {
              Logger.log(`MongoDB Connected 🚀`, 'MongooseModule');
            });

            connection.on('reconnect', () => {
              Logger.log(`MongoDB Reconnecting...`, 'MongooseModule');
            });

            return connection;
          };
          return {
            uri: dbURL,
            useNewUrlParser: true,
            useUnifiedTopology: true,
            connectionFactory,
          };
        } catch (error) {
          Logger.error(`MongoDB connection error: ${error}`, 'MongooseModule');
        }
      },
      inject: [],
    }),
    // TODO: Madhav - Check the best way to store Throttler Module Config
    // With increase in size of the app, multiple configs => scalability issue
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 10,
    }),
    BullModule.forRoot({
      redis: {
        host: "localhost",
        port: 6379,
      },
    })
  ],
  controllers: [
    AppController
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(AppLoggerMiddleware).forRoutes('*');
  }

  constructor() {
    Logger.log(`App Module Initialized 🚀`, 'AppModule');
  }
}
