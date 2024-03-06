// Nest Dependencies
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { configService } from '@services/config.service';

// Local Dependencies
import { UsersRepository } from '@repositories/users.repository';
import { UserSchema } from '@models/users.models';
import { AuthController } from '@controllers/auth.controller';
import { AuthService } from '@services/auth.service';
import { JwtStrategy } from './jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UsersService } from '@services/users.service';
import { GoogleStrategy } from './google.strategy';
import { DevicesService } from '@services/devices.service';
import { DevicesRepository } from '@repositories/devices.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'user', schema: UserSchema }]),
    MongooseModule.forFeature([{ name: 'device', schema: UserSchema }]),
    PassportModule,
    JwtModule.register({
      signOptions: {
        expiresIn: configService.getEnv('JWT_EXPIRES_IN'),
      },
      secret: configService.getEnv('JWT_SECRET'),
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    UsersRepository,
    JwtStrategy,
    UsersService,
    GoogleStrategy,
    DevicesService,
    DevicesRepository
  ],
})
export class AuthModule {}
