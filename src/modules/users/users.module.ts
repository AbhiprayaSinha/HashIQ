import { Module } from '@nestjs/common';
import { UsersController } from '@controllers/users.controller';
import { UsersService } from '@services/users.service';
import { UserSchema } from '@models/users.models';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersRepository } from '@repositories/users.repository';
import { DeviceSchema } from '@models/devices.model';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'user', schema: UserSchema }]),
    MongooseModule.forFeature([{ name: 'device', schema: DeviceSchema }]),
  ],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository],
})
export class UsersModule {}
