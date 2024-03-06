import { Tag } from "@models/problem-tags.model";
import { HttpStatus } from "@nestjs/common";
import { Controller, Get, HttpCode } from "@nestjs/common/decorators";
import { TagsService } from "@services/tags.service";

@Controller('tags')
export class TagsController {
    constructor(private readonly tagsService: TagsService) { }

    @HttpCode(HttpStatus.OK)
    @Get('all')
    async getAllTags(): Promise<Tag[]> {
        return await this.tagsService.getAllTags();
    }

}