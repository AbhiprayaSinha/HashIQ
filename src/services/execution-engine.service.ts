import { InjectQueue } from '@nestjs/bull';
import { Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { Queue } from 'bull';
import { IExecutionInfo } from 'src/types/execution-engine-type';

@Injectable()
export class ExecutionEngineService {
	private readonly logger = new Logger(ExecutionEngineService.name);

	constructor(@InjectQueue('execution-engine') private readonly executionEngineQueue: Queue) {}

	async execute(executionInfo: IExecutionInfo): Promise<number|string> {
		const executionJob = await this.executionEngineQueue.add(executionInfo);

		if(!executionJob)
			throw new InternalServerErrorException(`Failed to create execution job`);

		this.logger.debug(`Execution job created with id: ${executionJob.id}`);
		return executionJob.id;
	}

	// Polling approach
	async check(executionId: string): Promise<string|IExecutionInfo> {
		const executionJob = await this.executionEngineQueue.getJob(executionId);

		if(!executionJob)
			throw new NotFoundException(`Execution job with id: ${executionId} not found`);

		const executionResult = await executionJob.finished();

		// TODO: 202 Accepted Graceful handling
		if(!executionResult)
			return `Execution job with id: ${executionId} is still in progress`;

		this.logger.debug(`Execution job finished with id: ${executionId}`);
		return executionJob.returnvalue;
	}
}
