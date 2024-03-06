import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsIn, IsNotEmpty, IsNumber, IsString } from "class-validator";
import mongoose from "mongoose";

export class MasterProblemDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    title: string;

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    serialNumber: number;

    @ApiProperty()
    @IsArray()
    @IsString({ each: true })
    tags: string[];

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    description: string;

    @ApiProperty()
    @IsArray()
    @IsString({ each: true })
    topic: string[];

    @ApiProperty()
    @IsArray()
    @IsString({ each: true })
    companies: string[];

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    @IsIn([1, 2, 3])
    difficulty: number;

    @ApiProperty()
    @IsArray()
    sampleInput: [];

    @ApiProperty()
    @IsArray()
    sampleOutput: [];

    @ApiProperty()
    @IsArray()
    hiddenInput: [];

    @ApiProperty()
    @IsArray()
    hiddenOutput: [];

    @ApiProperty()
    @IsString()
    editorial: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    constraints: string;

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    @IsIn([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
    timeLimit: number;

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    @IsIn([128, 256])
    memoryLimit: number;
}

export class CreateProblemDto {
    @IsArray()
    tags: mongoose.Types.ObjectId[]

    @IsArray()
    topic: mongoose.Types.ObjectId[];

    @IsArray()
    companies: mongoose.Types.ObjectId[];

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsString()
    @IsNotEmpty()
    title: string;

    @IsNumber()
    @IsNotEmpty()
    serialNumber: number;

    @IsNumber()
    @IsNotEmpty()
    @IsIn([1, 2, 3])
    difficulty: number;

    @IsArray()
    sampleInput: [];

    @IsArray()
    sampleOutput: [];

    @IsArray()
    hiddenInput: [];

    @IsArray()
    hiddenOutput: [];

    @IsString()
    editorial: string;

    @IsString()
    @IsNotEmpty()
    constraints: string;

    @IsNumber()
    @IsNotEmpty()
    @IsIn([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
    timeLimit: number;

    @IsNumber()
    @IsNotEmpty()
    @IsIn([128, 256])
    memoryLimit: number;
}