import { NextRequest, NextResponse } from 'next/server';
import { LANGUAGE_CONFIGS, STATUS_MESSAGES, prepareCode } from '@/app/utils/compiler';
import { CompilerRequest, CompilerResponse, CompilerError } from '@/app/types/compiler';
import { analyzeComplexity } from '@/app/utils/big-o-analyzer';

// OnlineCompiler.io API configuration
// Set COMPILER_API_KEY in your .env.local file
const API_URL = 'https://api.onlinecompiler.io/api/run-code-sync/';
const API_KEY = process.env.COMPILER_API_KEY || '';

// Map internal language IDs to OnlineCompiler.io compiler identifiers
// All 12 supported languages: https://onlinecompiler.io/docs
const COMPILER_MAP: Record<string, string> = {
  'python': 'python-3.14',
  'c': 'gcc-15',
  'cpp': 'g++-15',
  'java': 'openjdk-25',
  'csharp': 'dotnet-csharp-9',
  'fsharp': 'dotnet-fsharp-9',
  'php': 'php-8.5',
  'ruby': 'ruby-4.0',
  'haskell': 'haskell-9.12',
  'go': 'go-1.26',
  'rust': 'rust-1.93',
  'typescript': 'typescript-deno',
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as CompilerRequest;
    const { language, code, input = '', analyzeComplexity: shouldAnalyzeComplexity = true } = body;

    if (!language || !code) {
      return NextResponse.json<CompilerError>(
        { error: 'Language and code are required' },
        { status: 400 }
      );
    }

    const config = LANGUAGE_CONFIGS[language];
    if (!config) {
      return NextResponse.json<CompilerError>(
        { error: `Unsupported language: ${language}` },
        { status: 400 }
      );
    }

    const compiler = COMPILER_MAP[language];
    if (!compiler) {
      return NextResponse.json<CompilerError>(
        { error: `Unsupported language: ${language}` },
        { status: 400 }
      );
    }

    if (!API_KEY) {
      return NextResponse.json<CompilerError>(
        { error: 'Code execution service is not configured. Set COMPILER_API_KEY in environment variables.' },
        { status: 500 }
      );
    }

    // Prepare the code for submission
    const submissionCode = prepareCode(code, language);

    // Submit code to OnlineCompiler.io sync API
    const executionResponse = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': API_KEY,
      },
      body: JSON.stringify({
        compiler,
        code: submissionCode,
        input,
      }),
    });

    if (!executionResponse.ok) {
      const errorText = await executionResponse.text().catch(() => 'Unknown error');
      console.error('OnlineCompiler API Error:', {
        status: executionResponse.status,
        statusText: executionResponse.statusText,
        error: errorText,
      });

      if (executionResponse.status === 429) {
        throw new Error('Code execution service is busy. Please wait a moment and try again.');
      }

      throw new Error(`Code execution failed (HTTP ${executionResponse.status}): ${errorText || executionResponse.statusText}`);
    }

    const result = await executionResponse.json();

    // Map OnlineCompiler.io response to our format
    let status = 'Accepted';
    if (result.status === 'error' && result.error) {
      // Check if it's a compilation error or runtime error
      status = result.exit_code === 0 ? 'Compilation Error' : 'Runtime Error';
    }
    if (result.exit_code === 124 || result.signal === 9) {
      status = 'Time Limit Exceeded';
    }
    if (result.signal === 11) {
      status = 'Runtime Error';
    }

    const executionTime = parseFloat(result.time) || 0.001;
    const memoryUsed = parseInt(result.memory, 10) || 0;

    // Analyze code complexity if requested
    const complexityAnalysis = shouldAnalyzeComplexity
      ? analyzeComplexity(code, language)
      : undefined;

    // Build response
    const response: CompilerResponse = {
      output: result.output || '',
      error: result.error || '',
      status,
      executionTime,
      memoryUsed,
      complexityAnalysis
    };

    return NextResponse.json(response);
  } catch (error: any) {
    console.error('Compiler API Error:', error);
    return NextResponse.json<CompilerError>(
      { error: error.message || 'An unknown error occurred' },
      { status: 500 }
    );
  }
} 