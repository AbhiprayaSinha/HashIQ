import { CreateProblemDto, MasterProblemDto } from '@dto/create-problem.dto';
import { ProblemsByTagsDto } from '@dto/problem-by-tags.dto';
import { SearchProblemsDto } from '@dto/search-problems.dto';
import { Problem } from '@models/problems.model';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
} from '@nestjs/common';
import { ProblemsService } from '@services/problems.service';
import { ProblemSummary } from 'src/types/problem-type';

@Controller('problems')
export class ProblemsController {
  constructor(private readonly problemsService: ProblemsService) {}

  @HttpCode(HttpStatus.OK)
  @Get('all')
  async getAllProblems(@Query('page') page: number = 1): Promise<ProblemSummary[]> {
    return await this.problemsService.getAllProblems(page);
  }

  @HttpCode(HttpStatus.OK)
  @Post('new')
  async createNewProblem(@Body() problem: MasterProblemDto): Promise<Problem> {
    return await this.problemsService.createNewProblem(problem);
  }

  @HttpCode(HttpStatus.OK)
  @Post('tags')
  async getProblemsByTags(
    @Body() problemsByTagsDto: ProblemsByTagsDto,
    @Query('page') page: number = 1,
  ): Promise<ProblemSummary[]> {
    return await this.problemsService.getProblemsByTags(problemsByTagsDto, page);
  }

  @Post('search')
  async searchProblems(
    @Body() searchProblemsDto: SearchProblemsDto,
    @Query('page') page = 1,
  ): Promise<ProblemSummary[]> {
    const { searchParameters } = searchProblemsDto;
    const problems = await this.problemsService.searchProblems(
      searchParameters,
      page,
    );
    return problems;
  }
}
