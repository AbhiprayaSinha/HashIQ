import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { UsersRepository } from '@repositories/users.repository';
import { Device } from '@models/devices.model';
import { CreateDeviceDto } from '@dto/create-device.dto';
import { DevicesRepository } from '@repositories/devices.repository';

@Injectable()
export class DevicesService {
  constructor(
    private readonly devicesRepository: DevicesRepository,
    private readonly usersRepository: UsersRepository,
  ) {}

  async createDevice(device: CreateDeviceDto): Promise<Device> {
    // Steps for populate through user model
    // 1. create kardo device ko
    // 2. uski object id ko user model mein devices array mein push kardo
    // 3. agar array ka size 3 se zyada ho gaya toh first element ko remove kardo
    // 4. user doc save kardo
    // 5. device doc return kardo
    
    const deviceDoc = await this.devicesRepository.createDevice(device);

    if(!deviceDoc)
        throw new InternalServerErrorException('Something went wrong');

    // error handling for this ?
    this.usersRepository.addUserDevice(device.userId, deviceDoc._id);

    return deviceDoc;
  }
}
