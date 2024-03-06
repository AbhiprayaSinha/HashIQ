import { Company, CompanyDocument } from "@models/companies.model";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

@Injectable()
export class CompaniesRepository {
    constructor(
        @InjectModel('company')
        private readonly companyModel: Model<CompanyDocument>,
    ) {}

    async getAllCompanies(): Promise<Company[]> {
        const companies = await this.companyModel.find().exec();
        return companies;
    }

    async getCompanyByName(companyName: string): Promise<Company | null> {
        const company = await this.companyModel.findOne({ name: companyName }).exec();
        return company;
    }

    async createNewCompany(companyName: string): Promise<Company> {
        const newCompany = await this.companyModel.create({ name: companyName });
        return newCompany;
    }
}