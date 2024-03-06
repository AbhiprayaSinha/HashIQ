import { ContestsController } from "@controllers/contests.controller";
import { ContestSchema } from "@models/contests.model";
import { Module } from "@nestjs/common/decorators";
import { MongooseModule } from "@nestjs/mongoose";
import { ContestsRepository } from "@repositories/contests.repository";
import { ContestsService } from "@services/contests.service";

@Module({
    imports: [
        MongooseModule.forFeature([{ name: 'contest', schema: ContestSchema }]),
    ],
    controllers: [ContestsController],
    providers: [
        ContestsService,
        ContestsRepository
    ],
})
export class ContestsModule { }