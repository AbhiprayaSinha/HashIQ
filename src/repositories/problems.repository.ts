import { CreateProblemDto } from '@dto/create-problem.dto';
import { ProblemsByTagIDsDto, ProblemsByTagsDto } from '@dto/problem-by-tags.dto';
import { Problem, ProblemDocument } from '@models/problems.model';
import { Injectable} from '@nestjs/common';
import { InternalServerErrorException } from '@nestjs/common/exceptions';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ProblemSummary } from 'src/types/problem-type';

@Injectable()
export class ProblemsRepository {
  constructor(
    @InjectModel('problem')
    private readonly problemModel: Model<ProblemDocument>,
  ) {}

  async getAllProblems(page: number): Promise<ProblemSummary[]> {
    const problems = await this.problemModel
      .find()
      .skip((page - 1) * 10)
      .limit(10)
      .exec();

    if (!problems)
      throw new InternalServerErrorException('Something went wrong');

    const problemSummaries: ProblemSummary[] = problems.map((problem) => {
      return {
        serialNumber: problem.serialNumber,
        title: problem.title,
        difficulty: problem.difficulty,
        acceptanceRate: problem.acceptedSubmissions / problem.totalSubmissions * 100,
        // TODO: Add logic to check if the problem is solved by the user
        isSolved: false,
        isAttempted: false,
      }
    });

    return problemSummaries;
  }

  async createNewProblem(problem: CreateProblemDto): Promise<Problem> {
    const newProblem = await this.problemModel.create(problem);
    return newProblem;
  }

  async getProblemsByTags(problemsByTagIDsDto: ProblemsByTagIDsDto, page: number): Promise<ProblemSummary[]> {
    
    const { tags, combineTagsByOR } = problemsByTagIDsDto;

    let tagSearchObject: any = {};
    tagSearchObject[combineTagsByOR ? '$in' : '$all'] = tags;

    const problems = await this.problemModel
      .find({ tags: tagSearchObject })
      .skip((page - 1) * 10)
      .limit(10)
      .exec();

    if (!problems)
      throw new InternalServerErrorException('Something went wrong');

    const problemSummaries: ProblemSummary[] = problems.map((problem) => {
      return {
        serialNumber: problem.serialNumber,
        title: problem.title,
        difficulty: problem.difficulty,
        acceptanceRate: problem.acceptedSubmissions / problem.totalSubmissions * 100,
        // TODO: Add logic to check if the problem is solved by the user
        isSolved: false,
        isAttempted: false,
      }
    });

    return problemSummaries;
  }

  async searchProblems(searchParameters: string[], page: number): Promise<ProblemSummary[]> {
    const problems = await this.problemModel
      .find({ $or: searchParameters.map((search) => ({ title: { $regex: search, $options: 'i' } })) })
      .skip((page - 1) * 10)
      .limit(10)
      .exec();

    if (!problems) 
      throw new InternalServerErrorException('Something went wrong');

    const problemSummaries: ProblemSummary[] = problems.map((problem) => {
      return {
        serialNumber: problem.serialNumber,
        title: problem.title,
        difficulty: problem.difficulty,
        acceptanceRate: problem.acceptedSubmissions / problem.totalSubmissions * 100,
        // TODO: Add logic to check if the problem is solved by the user
        isSolved: false,
        isAttempted: false,
      }
    });

    return problemSummaries;
  }

}
