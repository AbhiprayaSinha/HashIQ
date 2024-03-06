import { Company } from "@models/companies.model";
import { Injectable } from "@nestjs/common";
import { CompaniesRepository } from "@repositories/companies.repository";

@Injectable()
export class CompaniesService {
    constructor(private readonly companiesRepository: CompaniesRepository) { }

    async getAllCompanies(): Promise<Company[]> {
        const companies = await this.companiesRepository.getAllCompanies();
        return companies;
    }

    async getOrCreateCompanyByName(companyName: string): Promise<Company> {
        const company = await this.companiesRepository.getCompanyByName(companyName);
        if (company) {
            return company;
        } else {
            const newCompany = await this.companiesRepository.createNewCompany(companyName);
            return newCompany;
        }
    }

}