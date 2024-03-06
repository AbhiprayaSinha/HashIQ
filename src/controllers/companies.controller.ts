import { Company } from "@models/companies.model";
import { HttpStatus } from "@nestjs/common";
import { Controller, Get, HttpCode } from "@nestjs/common/decorators";
import { CompaniesService } from "@services/companies.service";

@Controller('companies')
export class CompaniesController {
    constructor(private readonly companiesService: CompaniesService) { }

    @HttpCode(HttpStatus.OK)
    @Get('all')
    async getAllCompanies(): Promise<Company[]> {
        return await this.companiesService.getAllCompanies();
    }
}