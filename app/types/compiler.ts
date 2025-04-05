export type Language = 'cpp' | 'python' | 'java';

export interface CompilerRequest {
  language: Language;
  code: string;
  input?: string;
  analyzeComplexity?: boolean;
}

export interface CompilerResponse {
  output: string;
  error: string;
  status: string;
  executionTime: number;
  memoryUsed: number;
  complexityAnalysis?: {
    timeComplexity: string;
    spaceComplexity: string;
    details: {
      pattern: string;
      complexity: string;
      description: string;
      count: number;
    }[];
  };
}

export interface CompilerError {
  error: string;
} 