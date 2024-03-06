import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { CompaniesController } from "@controllers/companies.controller";
import { CompaniesRepository } from "@repositories/companies.repository";
import { CompaniesService } from "@services/companies.service";
import { CompanySchema } from "@models/companies.model";

@Module({
    imports: [
        MongooseModule.forFeature([{ name: 'company', schema: CompanySchema }]),
    ],
    controllers: [CompaniesController],
    providers: [CompaniesService, CompaniesRepository],
    exports: [CompaniesService, CompaniesRepository]
})
export class CompaniesModule { }