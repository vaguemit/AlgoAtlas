'use client';

import { useState } from 'react';
import { CompilerRequest } from '@/app/types/compiler';

const API_URL = '/api/execute-code';

export default function TestPage() {
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  async function testCompiler(language: string, code: string, input: string = '') {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          language,
          code,
          input,
        } as CompilerRequest),
      });

      const result = await response.json();
      return { language, code, input, result };
    } catch (error) {
      return { language, code, input, error };
    }
  }

  async function runTests() {
    setLoading(true);
    setResults([]);

    const tests = [
      // Python tests
      {
        language: 'python',
        code: 'print("Hello, World!")',
        input: '',
      },
      {
        language: 'python',
        code: 'name = input("Enter your name: ")\nprint(f"Hello, {name}!")',
        input: 'John',
      },
      // C++ tests
      {
        language: 'cpp',
        code: `#include <iostream>
using namespace std;

int main() {
    cout << "Hello, World!" << endl;
    return 0;
}`,
        input: '',
      },
      {
        language: 'cpp',
        code: `#include <iostream>
using namespace std;

int main() {
    string name;
    cout << "Enter your name: ";
    getline(cin, name);
    cout << "Hello, " << name << "!" << endl;
    return 0;
}`,
        input: 'John',
      },
      // Java tests
      {
        language: 'java',
        code: `System.out.println("Hello, World!");`,
        input: '',
      },
      {
        language: 'java',
        code: `Scanner scanner = new Scanner(System.in);
System.out.print("Enter your name: ");
String name = scanner.nextLine();
System.out.println("Hello, " + name + "!");`,
        input: 'John',
      },
      // Error test
      {
        language: 'python',
        code: 'print("Missing closing quote)',
        input: '',
      },
    ];

    const testResults = await Promise.all(
      tests.map(test => testCompiler(test.language, test.code, test.input))
    );

    setResults(testResults);
    setLoading(false);
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Compiler API Tests</h1>
      
      <button
        onClick={runTests}
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
      >
        {loading ? 'Running Tests...' : 'Run Tests'}
      </button>

      <div className="mt-8 space-y-4">
        {results.map((result, index) => (
          <div key={index} className="border p-4 rounded">
            <h2 className="font-bold mb-2">
              Test {index + 1}: {result.language}
            </h2>
            <pre className="bg-gray-100 p-2 rounded mb-2">
              {result.code}
            </pre>
            {result.input && (
              <div className="mb-2">
                <span className="font-semibold">Input:</span> {result.input}
              </div>
            )}
            {result.error ? (
              <div className="text-red-500">
                <span className="font-semibold">Error:</span> {result.error}
              </div>
            ) : (
              <div>
                <div>
                  <span className="font-semibold">Output:</span>
                  <pre className="bg-gray-100 p-2 rounded mt-1">
                    {result.result.output}
                  </pre>
                </div>
                {result.result.error && (
                  <div className="text-red-500">
                    <span className="font-semibold">Error:</span>
                    <pre className="bg-gray-100 p-2 rounded mt-1">
                      {result.result.error}
                    </pre>
                  </div>
                )}
                <div className="mt-2">
                  <span className="font-semibold">Status:</span> {result.result.status}
                </div>
                <div>
                  <span className="font-semibold">Execution Time:</span>{' '}
                  {result.result.executionTime}s
                </div>
                <div>
                  <span className="font-semibold">Memory Used:</span>{' '}
                  {result.result.memoryUsed}KB
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
} 