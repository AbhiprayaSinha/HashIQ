import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches } from 'class-validator';
import { MasterUserDto } from './master-user-dto';

export class CreateUserDto extends MasterUserDto {
  @Matches(
    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[!@#$%^&*()\-_=+{};:,<.>/?]).{8,20}$/,
    {
      message: 'Password too weak',
    },
  )
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  password: string;
}
