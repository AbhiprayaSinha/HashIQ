import { ApiProperty } from "@nestjs/swagger";
import { ArrayMinSize, IsArray, IsString } from "class-validator";

export class SearchProblemsDto {
    @ApiProperty()
    @IsArray()
    @IsString({ each: true })
    @ArrayMinSize(1)
    searchParameters: string[];
}