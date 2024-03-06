import { HttpStatus } from "@nestjs/common";
import { Controller, Get, HttpCode, Post, Query, UseGuards } from "@nestjs/common/decorators";
import { ExecutionEngineService } from "@services/execution-engine.service";
import { ExecutionEngineGuard } from "src/guards/execution-engine.guard";

const MOCK_EXECUTION_INFO = {
    code: `#include<iostream>

    int main() {
        std::cout << "Hello World" << std::endl;
    }`,
    language: 'cpp',
    testcases: []
};

@Controller('execute-baby')
@UseGuards(ExecutionEngineGuard)
export class ExecutionEngineController {
    constructor(private readonly executionEngineService: ExecutionEngineService) {}

    @HttpCode(HttpStatus.OK)
    @Post('execute')
    async execute() : Promise<any> {
        return await this.executionEngineService.execute(MOCK_EXECUTION_INFO);
    }

    @HttpCode(HttpStatus.OK)
    @Get('check')
    async check(@Query('id') id: string) : Promise<any> {
        return await this.executionEngineService.check(id);
    }
}