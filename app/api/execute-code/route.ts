import { NextRequest, NextResponse } from 'next/server';
import { LANGUAGE_CONFIGS, STATUS_MESSAGES, prepareCode } from '@/app/utils/compiler';
import { CompilerRequest, CompilerResponse, CompilerError } from '@/app/types/compiler';
import { analyzeComplexity } from '@/app/utils/big-o-analyzer';

// Judge0 API configuration
const JUDGE0_API_URL = 'https://judge0-ce.p.rapidapi.com';
const JUDGE0_API_KEY = process.env.JUDGE0_API_KEY;

if (!JUDGE0_API_KEY) {
  console.error('JUDGE0_API_KEY is not set in environment variables');
}

const JUDGE0_HEADERS = {
  'Content-Type': 'application/json',
  'X-RapidAPI-Key': JUDGE0_API_KEY || '',
  'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
} as const;

export async function POST(req: NextRequest) {
  try {
    if (!JUDGE0_API_KEY) {
      return NextResponse.json<CompilerError>(
        { error: 'API key not configured. Please set JUDGE0_API_KEY in your environment variables.' },
        { status: 500 }
      );
    }

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

    // Prepare the code for submission
    const submissionCode = prepareCode(code, language);

    // Submit code to Judge0
    const submissionResponse = await fetch(`${JUDGE0_API_URL}/submissions`, {
      method: 'POST',
      headers: JUDGE0_HEADERS,
      body: JSON.stringify({
        language_id: config.id,
        source_code: submissionCode,
        stdin: input,
        expected_output: null,
        cpu_time_limit: 2,
        memory_limit: 512000,
      }),
    });

    if (!submissionResponse.ok) {
      const errorData = await submissionResponse.json().catch(() => ({}));
      console.error('Judge0 API Error:', {
        status: submissionResponse.status,
        statusText: submissionResponse.statusText,
        error: errorData,
      });
      throw new Error(`Failed to submit code to Judge0: ${submissionResponse.statusText}`);
    }

    const submission = await submissionResponse.json();

    // Poll for results
    let result;
    let attempts = 0;
    const maxAttempts = 10;

    while (attempts < maxAttempts) {
      const resultResponse = await fetch(`${JUDGE0_API_URL}/submissions/${submission.token}`, {
        headers: JUDGE0_HEADERS,
      });

      if (!resultResponse.ok) {
        const errorData = await resultResponse.json().catch(() => ({}));
        console.error('Judge0 API Error:', {
          status: resultResponse.status,
          statusText: resultResponse.statusText,
          error: errorData,
        });
        throw new Error(`Failed to get execution results: ${resultResponse.statusText}`);
      }

      result = await resultResponse.json();

      if (result.status.id !== 1 && result.status.id !== 2) {
        break;
      }

      await new Promise(resolve => setTimeout(resolve, 1000));
      attempts++;
    }

    if (!result) {
      throw new Error('Execution timed out');
    }

    // Analyze code complexity if requested
    const complexityAnalysis = shouldAnalyzeComplexity 
      ? analyzeComplexity(code, language)
      : undefined;

    const response: CompilerResponse = {
      output: result.stdout || '',
      error: result.stderr || result.compile_output || '',
      status: STATUS_MESSAGES[result.status.id] || 'Unknown Status',
      executionTime: result.time ? parseFloat(result.time) : 0,
      memoryUsed: result.memory ? parseInt(result.memory, 10) : 0,
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