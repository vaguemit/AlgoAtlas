import { NextRequest, NextResponse } from 'next/server';
import { LANGUAGE_CONFIGS, STATUS_MESSAGES, prepareCode } from '@/app/utils/compiler';
import { CompilerRequest, CompilerResponse, CompilerError } from '@/app/types/compiler';
import { analyzeComplexity } from '@/app/utils/big-o-analyzer';

// Piston API configuration - free and open source
const PISTON_API_URL = 'https://emkc.org/api/v2/piston';

// Language mappings from our internal IDs to Piston API versions
const PISTON_LANGUAGE_MAP: Record<string, { language: string, version: string }> = {
  'cpp': { language: 'c++', version: '10.2.0' },
  'python': { language: 'python', version: '3.10.0' },
  'java': { language: 'java', version: '17.0.5' },
  'javascript': { language: 'nodejs', version: '18.15.0' },
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

    // Map the language to Piston format
    const pistonLang = PISTON_LANGUAGE_MAP[language];
    if (!pistonLang) {
      return NextResponse.json<CompilerError>(
        { error: `No Piston mapping for language: ${language}` },
        { status: 400 }
      );
    }

    // Prepare the code for submission
    const submissionCode = prepareCode(code, language);

    // Start execution timestamp for performance metrics
    const startTime = performance.now();

    // Submit code to Piston API
    const executionResponse = await fetch(`${PISTON_API_URL}/execute`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        language: pistonLang.language,
        version: pistonLang.version,
        files: [
          {
            name: language === 'cpp' ? 'main.cpp' : 
                  language === 'python' ? 'main.py' :
                  language === 'java' ? 'Main.java' :
                  language === 'javascript' ? 'main.js' : 'main.txt',
            content: submissionCode,
          }
        ],
        stdin: input,
        args: [],
        compile_timeout: 10000,
        run_timeout: 5000,
        compile_memory_limit: -1,
        run_memory_limit: -1,
      }),
    });

    if (!executionResponse.ok) {
      const errorText = await executionResponse.text().catch(() => 'Unknown error');
      console.error('Piston API Error:', {
        status: executionResponse.status,
        statusText: executionResponse.statusText,
        error: errorText,
      });
      throw new Error(`Failed to execute code: ${executionResponse.statusText}`);
    }

    const result = await executionResponse.json();
    
    // End execution timestamp
    const endTime = performance.now();
    const executionTime = (endTime - startTime) / 1000; // Convert to seconds

    // Determine execution status
    let status = 'Accepted';
    if (result.compile && result.compile.stderr) {
      status = 'Compilation Error';
    } else if (result.run && result.run.stderr) {
      status = 'Runtime Error';
    } else if (result.run && result.run.signal) {
      status = 'Time Limit Exceeded';
    }

    // Analyze code complexity if requested
    const complexityAnalysis = shouldAnalyzeComplexity 
      ? analyzeComplexity(code, language)
      : undefined;

    // Build response
    const response: CompilerResponse = {
      output: result.run?.stdout || '',
      error: result.run?.stderr || result.compile?.stderr || '',
      status: status,
      executionTime: result.run?.time || executionTime,
      memoryUsed: -1, // Piston doesn't provide exact memory usage
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