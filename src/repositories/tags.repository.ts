import { Tag, TagDocument } from "@models/problem-tags.model";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

@Injectable()
export class TagsRepository {
    constructor(
        @InjectModel('tag')
        private readonly tagModel: Model<TagDocument>,
    ) {}

    async getAllTags(): Promise<Tag[]> {
        const tags = await this.tagModel.find().exec();
        return tags;
    }

    async getTagByName(tagName: string): Promise<Tag | null> {
        const tag = await this.tagModel.findOne({ name: tagName }).exec();
        return tag;
    }

    async createNewTag(tagName: string): Promise<Tag> {
        const newTag = await this.tagModel.create({ name: tagName });
        return newTag;
    }

}