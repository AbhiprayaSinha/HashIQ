import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";
import { IBrowser, ICPU, IDevice, IEngine, IOS } from 'ua-parser-js';

export class CreateDeviceDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    userId: string;

    // @IsString()
    // @IsNotEmpty()
    // @ApiProperty()
    // deviceId: string;

    @IsNotEmpty()
    @ApiProperty()
    browser: IBrowser

    @IsNotEmpty()
    @ApiProperty()
    engine: IEngine

    @IsNotEmpty()
    @ApiProperty()
    os: IOS

    @ApiProperty()
    device: IDevice

    @ApiProperty()
    cpu: ICPU

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    ipAddress: string;

    @ApiProperty({default: "Unknown"})
    location: string;
}