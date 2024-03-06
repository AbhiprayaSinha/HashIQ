import { CreateDeviceDto } from '@dto/create-device.dto';
import { Device, DeviceDocument } from '@models/devices.model';
import { Injectable} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class DevicesRepository {
  constructor(
    @InjectModel('device')
    private readonly deviceModel: Model<DeviceDocument>,
  ) {}

  async createDevice(device: CreateDeviceDto): Promise<Device> {
    return await this.deviceModel.create(device);
  }
}
