import { CreateContestDto } from "@dto/create-contest.dto";
import { Contest, ContestDocument } from "@models/contests.model";
import { Injectable } from "@nestjs/common";
import { ContestsRepository } from "@repositories/contests.repository";

@Injectable()
export class ContestsService{
    constructor(
        private readonly contestsRepository: ContestsRepository,
    ){}

    async createContest(contest: CreateContestDto): Promise<Contest>{
        const createdContest = this.contestsRepository.createContest(contest);
        return createdContest;
    }

    async getAllContests(): Promise<Contest[]>{
        const contests = this.contestsRepository.getAllContests();
        return contests;
    }

    async updateContest(contestId: string, contest: CreateContestDto): Promise<Contest | null>{
        const updatedContest = this.contestsRepository.updateContest(contestId, contest);
        return updatedContest;
    }

    async deleteContest(contestId: string): Promise<Contest | null>{
        const deletedContest = this.contestsRepository.deleteContest(contestId);
        return deletedContest;
    }
}