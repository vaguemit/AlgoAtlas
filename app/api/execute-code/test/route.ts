import { NextResponse } from 'next/server';

// Piston API configuration
const PISTON_API_URL = 'https://emkc.org/api/v2/piston';

export async function GET() {
  try {
    // Test C++ code that prints "Hello, World!"
    const testCode = `#include <iostream>

int main() {
    std::cout << "Hello, World!" << std::endl;
    return 0;
}`;

    // Execute the test code
    const executionResponse = await fetch(`${PISTON_API_URL}/execute`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        language: 'c++',
        version: '10.2.0',
        files: [
          {
            name: 'main.cpp',
            content: testCode,
          }
        ],
        stdin: '',
        args: [],
        compile_timeout: 10000,
        run_timeout: 5000,
        compile_memory_limit: -1,
        run_memory_limit: -1,
      }),
    });

    if (!executionResponse.ok) {
      const errorText = await executionResponse.text().catch(() => 'Unknown error');
      throw new Error(`Piston API Error: ${executionResponse.status} - ${errorText}`);
    }

    const result = await executionResponse.json();

    return NextResponse.json({
      success: true,
      message: 'Piston API is working correctly',
      testDetails: {
        language: 'C++',
        expectedOutput: 'Hello, World!',
        output: result.run?.stdout || '',
        error: result.run?.stderr || result.compile?.stderr || '',
        executionTime: result.run?.time || 0,
      },
      apiResponse: result
    });
  } catch (error: any) {
    console.error('Piston API Test Error:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'An unknown error occurred'
    }, { status: 500 });
  }
} 