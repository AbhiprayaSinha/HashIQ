import { ProblemsController } from "@controllers/problems.controller";
import { ProblemSchema } from "@models/problems.model";
import { CompaniesModule } from "@modules/companies/companies.module";
import { TagsModule } from "@modules/tags/tags.module";
import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ProblemsRepository } from "@repositories/problems.repository";
import { ProblemsService } from "@services/problems.service";

@Module({
    imports: [
        MongooseModule.forFeature([{ name: 'problem', schema: ProblemSchema }]),
        TagsModule,
        CompaniesModule
    ],
    controllers: [ProblemsController],
    providers: [ProblemsService, ProblemsRepository],
})
export class ProblemsModule { }