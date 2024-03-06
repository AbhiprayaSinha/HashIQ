export interface IExecutionInfo {
    code: string;
    language: string;
    testcases: string[];
}

export interface ITestcaseResult {
    status: boolean;
    output?: string;
    error?: string;
}

export interface IExecutionResult {
    status: boolean;
    results: ITestcaseResult[];
    error?: string;
}