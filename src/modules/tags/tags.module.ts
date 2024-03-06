import { TagsController } from "@controllers/tags.controller";
import { TagSchema } from "@models/problem-tags.model";
import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { TagsRepository } from "@repositories/tags.repository";
import { TagsService } from "@services/tags.service";

@Module({
    imports: [
        MongooseModule.forFeature([{ name: 'tag', schema: TagSchema }]),
    ],
    controllers: [TagsController],
    providers: [TagsService, TagsRepository],
    exports: [TagsService, TagsRepository]
})
export class TagsModule { }