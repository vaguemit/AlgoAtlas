export type Language = 'cpp' | 'python' | 'java';

export interface CompilerRequest {
  language: Language;
  code: string;
  input?: string;
}

export interface CompilerResponse {
  output: string;
  error: string;
  status: string;
  executionTime: number;
  memoryUsed: number;
}

export interface CompilerError {
  error: string;
} 