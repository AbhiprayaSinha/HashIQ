import { Injectable, Logger } from '@nestjs/common';
import { User } from '@models/users.models';
import { UsersRepository } from '@repositories/users.repository';
import { MasterUserDto } from '@dto/master-user-dto';
import { IStatus } from 'src/types/http-type';
import { 
  InternalServerErrorException, 
  NotFoundException 
} from '@nestjs/common/exceptions';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(private readonly usersRepository: UsersRepository) {}

  async getUserById(id: string): Promise<User | null> {
    return await this.usersRepository.getUserById(id);
  }

  async findUsernameOrEmail(
    username: string,
    email: string,
  ): Promise<User | null> {
    return await this.usersRepository.findUsernameOrEmail(username, email);
  }

  async createUser(masterUserDto: MasterUserDto): Promise<User | null> {
    return await this.usersRepository.createUser(masterUserDto);
  }

  async findUserByUsernameOrEmail(
    usernameOrEmail: string,
  ): Promise<User | null> {
    return await this.usersRepository.findUserByUsernameOrEmail(
      usernameOrEmail,
    );
  }

  async checkIfDeviceExists(userId: string, deviceId: string): Promise<boolean> {
    return await this.usersRepository.checkIfDeviceExists(userId, deviceId);
  }

  async removeDevice(userId: string, deviceId: string): Promise<IStatus> {
    await this.usersRepository.removeUserDevice(userId, deviceId);
    return { message: 'Logout Successful' };
  }
}
