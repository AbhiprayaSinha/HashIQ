import { CreateContestDto } from "@dto/create-contest.dto";
import { Contest, ContestDocument } from "@models/contests.model";
import { InternalServerErrorException } from "@nestjs/common";
import { Injectable } from "@nestjs/common/decorators";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

@Injectable()
export class ContestsRepository{
    constructor(
        @InjectModel('contest') 
        private readonly contestModel: Model<ContestDocument>,
    ){}

    async createContest(contest: CreateContestDto): Promise<Contest>{
        const createdContest = this.contestModel.create(contest);
        return createdContest;
    }

    async getAllContests(): Promise<Contest[]>{
        const contests = this.contestModel.find();
        return contests;
    }

    async updateContest(contestId: string, contest: CreateContestDto): Promise<Contest | null>{
        const updatedContest = this.contestModel.findByIdAndUpdate(contestId, contest);
        
        if (!updatedContest) throw new InternalServerErrorException('Contest not found');
        
        return updatedContest;
    }

    async deleteContest(contestId: string): Promise<Contest | null>{
        const deletedContest = this.contestModel.findByIdAndDelete(contestId);

        if (!deletedContest) throw new InternalServerErrorException('Contest not found');

        return deletedContest;
    }

}