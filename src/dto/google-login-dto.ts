import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { MasterUserDto } from './master-user-dto';

export class GoogleLoginDto extends MasterUserDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  profilePic: string;
}
