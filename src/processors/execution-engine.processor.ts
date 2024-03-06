import { 
    Processor, 
    Process, 
    OnGlobalQueueWaiting, 
    OnGlobalQueueActive, 
    OnGlobalQueueCompleted
} from "@nestjs/bull";
import { Logger } from "@nestjs/common";
import { Job } from 'bull';
import * as fs from 'fs/promises';
import * as path from 'path'
import { 
    getCommandToCompileCode, 
    getCommandToRunCode, 
    isInterpretedLanguage 
} from "src/helpers/utils.helper";
import { IStandardResponse } from "src/types/common-type";
import { IExecutionInfo, IExecutionResult } from "src/types/execution-engine-type";


@Processor('execution-engine')
export class ExecutionEngineProcessor {
    private readonly logger = new Logger(ExecutionEngineProcessor.name);
    private readonly util = require('util');
    private readonly exec = this.util.promisify(require('child_process').exec);

    /*
        @precondition: The docker image with the name virtual-machine should be present in the system
    */
    async createDockerContainer(containerName: string): Promise<IStandardResponse> {
        try {
            const { 
                stdout: containerId,
                stderr: containerCreationError
            } = await this.exec(`docker run -d --name ${containerName} virtual-machine tail -f /dev/null`);
    
            if (containerCreationError) {
                this.logger.warn(containerCreationError);
                return {
                    status: false,
                    error: containerCreationError
                }
            }
    
            this.logger.debug(`Created the virtual machine with id: ${containerId}`);
            return {
                status: true,
                message: containerId
            }
        } 
        catch (error) {
            return {
                status: false,
                error
            }
        }
    }

    async prepareExecutionEngine(code: string, fileExtension: string, containerName: string): Promise<IStandardResponse> {
        this.logger.debug('Preparing the execution engine');

        try {
            const containerId = (await this.createDockerContainer(containerName)).message?.split('\n')[0];
            
            if (!containerId) {
                return {
                    status: false,
                    error: 'Failed to create the virtual machine'
                }
            }

            const filePath = path.join(__dirname, '..', '__EngineFiles__', `${containerName}.${fileExtension}`);
            const isDirectoryPresent = await fs.stat(path.join(__dirname, '..', '__EngineFiles__')).catch(() => false);

            if(!isDirectoryPresent)
                await fs.mkdir(path.join(__dirname, '..', '__EngineFiles__'));

            await fs.writeFile(filePath, code);
            await this.exec(`docker cp ${filePath} ${containerId}:/home/${containerName}.${fileExtension}`);
            await fs.rm(filePath);

            this.logger.debug('Prepared the execution engine');

            return {
                status: true,
                message: containerId
            }
        } 
        catch (error) {
            return {
                status: false,
                error
            }
        }
    }

    async compileCode(containerName: string, fileExtension: string): Promise<IStandardResponse> {
        if(isInterpretedLanguage(fileExtension)) {
            return {
                status: true,
                message: 'No need to compile the code'
            }
        }

        this.logger.debug('Compiling the code');

        const containerFilePath = `/home/${containerName}.${fileExtension}`;
        const compileCommand = getCommandToCompileCode(fileExtension, containerFilePath);

        try {
            await this.exec(`docker exec ${containerName} ${compileCommand}`);
            return {
                status: true,
                message: 'Code compiled successfully'
            }
        }
        catch (error) {
            return {
                status: false,
                error
            }
        }
    }

    async executeCode(containerName: string, fileExtension: string, testcases: string[]): Promise<IStandardResponse> {
        if(!Array.isArray(testcases) || testcases.length === 0)
            testcases = ['0'];

        const [testcase] = testcases;
        
        this.logger.debug('Executing the code');
        
        const inputFileName = `${containerName}-input.txt`;
        const inputFilePathLocal = path.join(__dirname, '..', '__EngineFiles__', inputFileName);
        const inputFilePathContainer = `/home/${inputFileName}`;
        const executeCommand = getCommandToRunCode(fileExtension, inputFilePathContainer);
        
        try {
            await fs.writeFile(inputFilePathLocal, testcase);
            await this.exec(`docker cp ${inputFilePathLocal} ${containerName}:${inputFilePathContainer}`);
            await fs.rm(inputFilePathLocal);

            const { 
                stdout: output, 
                stderr: error 
            } = await this.exec(`docker exec ${containerName} sh -c ${executeCommand}`);
            
            this.logger.log(output)
            this.logger.debug('Executed the code')
            
            return {
                status: true,
                message: output
            }
        }
        catch (error) {
            return {
                status: false,
                error
            }
        }
    }

    async cleanupExecutionEngine(containerName: string): Promise<IStandardResponse> {
        this.logger.debug('Cleaning up the execution engine');

        try {
            await this.exec(`docker rm -f ${containerName}`);
            this.logger.debug('Cleaned up the execution engine');
            return {
                status: true,
                message: 'Cleaned up the execution engine'
            }
        } 
        catch (error) {
            return {
                status: false,
                error
            }
        }
    }

    // TODO: Configure concurrency as per the number of CPU cores
    @Process({
        concurrency: 1
    })
    async execute(job: Job<IExecutionInfo>): Promise<IExecutionResult> {
        const { code, language, testcases } = job.data;

        this.logger.debug(`Executing job with id: ${job.id}`);
        
        const containerName = `execution-${job.id}`;
        const containerId = (await this.prepareExecutionEngine(code, language, containerName)).message;

        if (!containerId) {
            this.logger.warn('Failed to prepare the execution engine');
            return {
                status: false,
                results: [],
                error: 'Service Unavailable at the moment',
            }
        }

        const compilationStatus = (await this.compileCode(containerName, language)).status;

        if (!compilationStatus) {
            this.logger.warn('Failed to compile the code');
            return {
                status: false,
                results: [],
                error: 'Service Unavailable at the moment',
            }
        }

        const executionResult = await this.executeCode(containerName, language, testcases);
        const cleanUpStatus = (await this.cleanupExecutionEngine(containerName)).status;

        if (!executionResult.status) {
            this.logger.warn('Failed to execute the code');
            return {
                status: false,
                results: [],
                error: 'Service Unavailable at the moment',
            }
        }
        else {
            return {
                status: true,
                results: [],
            }
        }
    }

    @OnGlobalQueueWaiting()
    onWaiting(jobId: number | string) {
        this.logger.debug(`Job with id: ${jobId} is waiting`);
    }

    @OnGlobalQueueActive()
    onActive(jobId: number | string) {
        this.logger.debug(`Job with id: ${jobId} is started`);
    }

    // @OnGlobalQueueProgress()
    // onProgress(job: Job<IExecutionInfo>, progress: number) {
    //     this.logger.log(`Job with id: ${job.id} is ${progress}% done`);
    // }

    @OnGlobalQueueCompleted()
    onCompleted(jobId: number | string, result: IExecutionResult) {
        this.logger.debug(`Job with id: ${jobId} is completed`, result);
    }

    // @OnGlobalQueueFailed()
    // onFailed(job: Job<IExecutionInfo>, error: Error) {
    //     this.logger.log(`Job with id: ${job.id} is failed`);
    // }

}