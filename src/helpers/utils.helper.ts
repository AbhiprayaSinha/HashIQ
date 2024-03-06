export const getCommandToRunCode = (language: string, inputFileName: string): string => {
    switch (language) {
        case 'cpp' : return `"./a.out < ${inputFileName}"`;
        default: return 'Invalid Language';
    }
}

export const getCommandToCompileCode = (language: string, fileName: string): string => {
    switch (language) {
        case 'cpp' : return `g++ ${fileName}`;
        default: return 'Invalid Language';
    }
};

export const getLanguageNameFromExtension = (extension: string): string => {
    switch (extension) {
        case 'cpp' : return 'CPP';
        default: return 'Invalid Language';
    }
}

export const isInterpretedLanguage = (languageExtension: string): boolean => {
    return ['js'].includes(languageExtension);
};

export const createRandomStringOfLength = (length: number): string => {
    return Math.random().toString(36).substring(length);
};