import {
  BadRequestException,
  Injectable,
  Logger,
  ConflictException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateUserDto } from '@dto/create-user.dto';
import { JwtService } from '@nestjs/jwt';
import { IStatus } from 'src/types/http-type';
import { UsersService } from './users.service';
import { LoginDto } from '@dto/login-dto';
import * as bcrypt from 'bcrypt';
import { GoogleLoginDto } from '@dto/google-login-dto';
import { v4 as uuid } from 'uuid';
import { UAParser } from 'ua-parser-js'; 
import { CreateDeviceDto } from '@dto/create-device.dto';
import { DevicesService } from '@services/devices.service'
import { Payload } from 'src/types/jwt-type';
import { User } from '@models/users.models';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly devicesService: DevicesService,
  ) {}

  generateUsername(firstname: string): string {
    firstname = firstname.replace(/\s/g, '_').toLowerCase();
    const username = firstname + uuid();
    return username;
  }

  async signUp(createUserDto: CreateUserDto): Promise<IStatus> {
    let user = await this.usersService.findUserByUsernameOrEmail(
      createUserDto.email,
    );

    if (user) {
      throw new ConflictException('Email already exists');
    }

    const saltedRounds = 10;
    const salt = await bcrypt.genSalt(saltedRounds);

    createUserDto.username = this.generateUsername(createUserDto.firstname);
    createUserDto.password = await bcrypt.hash(createUserDto.password, salt);

    user = await this.usersService.createUser(createUserDto);

    if (!user) {
      throw new InternalServerErrorException('Something went wrong');
    }

    return { message: 'Account has been created.' };
  }

  async addDeviceAndSignJWT(user: User, userAgent: string, ip: string): Promise<string> {
    const parser = new UAParser(userAgent);
    const deviceId = uuid();
    const device: CreateDeviceDto = {
      // deviceId,
      userId: user._id.toString(),
      ...parser.getResult(),
      ipAddress: ip,
      location: "Unknown",
    }

    const deviceDoc = await this.devicesService.createDevice(device);

    if(!deviceDoc)
      throw new InternalServerErrorException('Something went wrong')

    const accessToken = this.jwtService.sign({
      id: user._id.toString(),
      isAdmin: user.isAdmin,
      deviceId: deviceDoc._id.toString(),
    } as Payload);

    return accessToken;
  }

  async signIn(loginDto: LoginDto, userAgent: string, ip: string): Promise<string> {
    const user = await this.usersService.findUserByUsernameOrEmail(
      loginDto.usernameOrEmail,
    );

    if (!user) {
      throw new NotFoundException('Username or email is incorrect');
    }

    if (!user.password) {
      throw new NotFoundException(
        'Please set a password or login with your Social Media account.',
      );
    }

    const isPasswordCorrect = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!isPasswordCorrect) {
      throw new NotFoundException('Password is incorrect');
    }

    return this.addDeviceAndSignJWT(user, userAgent, ip);

  }

  async signInWithGoogle(googleLoginDto: GoogleLoginDto, userAgent: string, ip: string): Promise<string> {
    let user = await this.usersService.findUserByUsernameOrEmail(
      googleLoginDto.email,
    );

    if (!user) {
      googleLoginDto.username = this.generateUsername(googleLoginDto.firstname);
      user = await this.usersService.createUser(googleLoginDto);
    }

    if (!user) {
      throw new InternalServerErrorException('Something went wrong');
    }

    return this.addDeviceAndSignJWT(user, userAgent, ip);

  }

  async signOut({ id, deviceId }: Payload): Promise<IStatus> {
    return await this.usersService.removeDevice(id, deviceId);
  }

}
