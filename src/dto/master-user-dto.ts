import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class MasterUserDto {
  // for username to be a required dto field it should have atleast one validation decorator
  username: string;
  
  @IsString()
  @ApiProperty()
  @IsNotEmpty()
  firstname: string;

  @IsString()
  @ApiProperty()
  lastname: string;

  @IsNotEmpty()
  @IsEmail()
  @ApiProperty()
  email: string;
}
