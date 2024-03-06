import { ApiProperty } from "@nestjs/swagger";
import { ArrayMinSize, IsArray, IsBoolean, IsString } from "class-validator";
import mongoose from "mongoose";

export class ProblemsByTagsDto {
    @ApiProperty()
    @IsArray()
    @IsString({ each: true })
    @ArrayMinSize(1)
    tags: string[];

    @ApiProperty()
    @IsBoolean()
    combineTagsByOR: boolean;
}

export class ProblemsByTagIDsDto {
    @IsArray()
    tags: mongoose.Types.ObjectId[];

    @IsBoolean()
    combineTagsByOR: boolean;
}