import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDate, IsNotEmpty, IsString } from "class-validator";

export class CreateContestDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    contestTitle: string;

    @ApiProperty({ type: Date})
    @IsNotEmpty()
    @Type(() => Date)
    @IsDate()
    startTime: Date;

    @ApiProperty({ type: Date})
    @IsNotEmpty()
    @Type(() => Date)
    @IsDate()
    endTime: Date;

    @ApiProperty()
    @IsNotEmpty()
    @IsString({ each: true })
    contestProblems: string[];
}