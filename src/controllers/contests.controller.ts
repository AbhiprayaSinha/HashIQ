import { CreateContestDto } from "@dto/create-contest.dto";
import { Contest, ContestDocument } from "@models/contests.model";
import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Post, Put, Query } from "@nestjs/common";
import { ContestsService } from "@services/contests.service";

@Controller('contests')
export class ContestsController{
    constructor(
        private readonly contestService: ContestsService,
    ){}

    @HttpCode(HttpStatus.CREATED)
    @Post('new')
    async createContest(@Body() contest: CreateContestDto): Promise<Contest>{
        const createdContest = this.contestService.createContest(contest);
        return createdContest;
    }

    @HttpCode(HttpStatus.OK)
    @Get('all')
    async getAllContests(): Promise<Contest[]>{
        const contests = this.contestService.getAllContests();
        return contests;
    }

    @HttpCode(HttpStatus.OK)
    @Put('update')
    async updateContest(@Query('contestId') contestId: string, @Body() contest: CreateContestDto): Promise<Contest | null>{
        const updatedContest = this.contestService.updateContest(contestId, contest);
        return updatedContest;
    }

    @HttpCode(HttpStatus.OK)
    @Delete('delete')
    async deleteContest(@Query('contestId') contestId: string): Promise<Contest | null>{
        const deletedContest = this.contestService.deleteContest(contestId);
        return deletedContest;
    }

}