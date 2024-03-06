import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ProblemSummary } from 'src/types/problem-type';
import { ProblemsRepository } from '@repositories/problems.repository';
import { ProblemsByTagIDsDto, ProblemsByTagsDto } from '@dto/problem-by-tags.dto';
import { Problem } from '@models/problems.model';
import { MasterProblemDto } from '@dto/create-problem.dto';
import { TagsService } from './tags.service';
import { CompaniesService } from './companies.service';

@Injectable()
export class ProblemsService {
  constructor(
    private readonly problemsRepository: ProblemsRepository,
    private readonly tagsService: TagsService,
    private readonly companiesService: CompaniesService,
  ) { }

  async getAllProblems(page: number): Promise<ProblemSummary[]> {
    const problems = await this.problemsRepository.getAllProblems(page);
    return problems;
  }

  async createNewProblem(problem: MasterProblemDto): Promise<Problem> {
    if (problem.sampleInput.length !== problem.sampleOutput.length || problem.hiddenInput.length !== problem.hiddenOutput.length) {
      throw new InternalServerErrorException('Sample Input and Output or Hidden Input and Output do not match');
    }

    problem.tags.map((tag) => {
      tag = tag.split(' ').map((word) => {
        return word.charAt(0).toUpperCase() + word.slice(1);
      }).join(' ');

      tag.trim();

      return tag;
    })

    const tagIds = await Promise.all(problem.tags.map(async (tag) => {
      const tagDoc = await this.tagsService.getOrCreateTagByName(tag);
      return tagDoc._id;
    }));

    problem.topic.map((topic) => {
      topic = topic.split(' ').map((word) => {
        return word.charAt(0).toUpperCase() + word.slice(1);
      }).join(' ');

      topic.trim();

      return topic;
    });

    const topicIds = await Promise.all(problem.topic.map(async (topic) => {
      const topicDoc = await this.tagsService.getOrCreateTagByName(topic);
      return topicDoc._id;
    }));

    problem.companies.map((company) => {
      company = company.split(' ').map((word) => {
        return word.charAt(0).toUpperCase() + word.slice(1);
      }).join(' ');

      company.trim();

      return company;
    });

    const companyIds = await Promise.all(problem.companies.map(async (company) => {
      const companyDoc = await this.companiesService.getOrCreateCompanyByName(company);
      return companyDoc._id;
    }));

    const newProblem = await this.problemsRepository.createNewProblem({
      ...problem,
      tags: tagIds,
      topic: topicIds,
      companies: companyIds,
    });

    return newProblem;
  }

  async getProblemsByTags(problemsByTagsDto: ProblemsByTagsDto, page: number): Promise<ProblemSummary[]> {
    const tagIds = await Promise.all(problemsByTagsDto.tags.map(async (tag) => {
      const tagDoc = await this.tagsService.getTagByName(tag);

      if (!tagDoc) {
        throw new InternalServerErrorException('Tag does not exist');
      }

      return tagDoc._id;
    }));

    const problemsByTagIDsDto: ProblemsByTagIDsDto = {
      ...problemsByTagsDto,
      tags: tagIds,
    }

    const problems = await this.problemsRepository.getProblemsByTags(problemsByTagIDsDto, page);
    return problems;
  }

  async searchProblems(searchParameters: string[], page: number): Promise<ProblemSummary[]> {
    const problems = await this.problemsRepository.searchProblems(searchParameters, page);
    return problems;
  }

}
