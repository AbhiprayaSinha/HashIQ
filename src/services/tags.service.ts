import { Tag } from "@models/problem-tags.model";
import { InternalServerErrorException } from "@nestjs/common";
import { Injectable } from "@nestjs/common/decorators";
import { TagsRepository } from "@repositories/tags.repository";

@Injectable()
export class TagsService {
    constructor(private readonly tagsRepository: TagsRepository) { }

    async getAllTags(): Promise<Tag[]> {
        const tags = await this.tagsRepository.getAllTags();
        return tags;
    }

    async getTagByName(tagName: string): Promise<Tag | null> {
        const tag = await this.tagsRepository.getTagByName(tagName);
        return tag;
    }

    async getOrCreateTagByName(tagName: string): Promise<Tag> {
        const tag = await this.tagsRepository.getTagByName(tagName);
        if (tag) {
            return tag;
        } else {
            const newTag = await this.tagsRepository.createNewTag(tagName);
            return newTag;
        }
    }

}