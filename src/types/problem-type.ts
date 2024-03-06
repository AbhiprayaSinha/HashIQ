export interface ProblemSummary {
    serialNumber: number;
    title: string;
    difficulty: number;
    acceptanceRate: number;
    isSolved: boolean;
    isAttempted: boolean;
}

export interface Problem extends ProblemSummary {
    description: string;
    constraints: string;
    sampleInput: string[];
    sampleOutput: string[];
    editorial: string;
    tags: string[];
    topics: string[];
    companies: string[];
}

export interface Tag {
    
}