import { MasterUserDto } from '@dto/master-user-dto';
import { User, UserDocument } from '@models/users.models';
import {
  Injectable, 
  InternalServerErrorException, 
  UnauthorizedException 
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectModel('user')
    private readonly userModel: Model<UserDocument>,
  ) {}

  async createUser(masterUserDto: MasterUserDto): Promise<User> {
    return await this.userModel.create(masterUserDto);
  }

  async getUserById(id: string): Promise<User | null> {
    return await this.userModel.findById(id);
  }

  async findUsernameOrEmail(
    username: string,
    email: string,
  ): Promise<User | null> {
    return await this.userModel.findOne({ $or: [{ username }, { email }] });
  }

  async findUserByUsernameOrEmail(
    usernameOrEmail: string,
  ): Promise<User | null> {
    return await this.userModel.findOne({
      $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
    });
  }

  async addUserDevice(userId: string, deviceId: Types.ObjectId): Promise<void> {
    const userDoc = await this.userModel.findByIdAndUpdate(userId, {
      $push: { devices: { $each: [deviceId], $slice: -3 } }
    }, {new: true});

    if(!userDoc)
        throw new InternalServerErrorException('Something went wrong');
  }

  async checkIfDeviceExists(userId: string, deviceId: string): Promise<boolean> {
    const user = await this.userModel.findById(userId);

    if(!user)
        throw new UnauthorizedException('User not found');

    const device = user.devices.find(device => device.toString() === deviceId);

    return !!device;
  }

  async removeUserDevice(userId: string, deviceId: string): Promise<void> {
    const userDoc = await this.userModel.findByIdAndUpdate(userId, {
      $pull: { devices: deviceId }
    }, {new: true});
    
    if (!userDoc)
      throw new InternalServerErrorException('Something went wrong');
  }

}
