import { NextRequest, NextResponse } from 'next/server';

// Types for the analyzer
interface AnalyzerRequest {
  language: string;
  code: string;
}

interface AnalyzerResponse {
  analysis: string;
}

interface AnalyzerError {
  error: string;
}

/**
 * Improved code analysis function with header and function checks
 */
async function analyzeCodeWithAI(code: string, language: string): Promise<string> {
  try {
    // Revised implementation that focuses only on critical issues for competitive programming
    
    const lines = code.split('\n');
    const analysis = [];
    let hasErrors = false;
    
    // Check for header includes if C++
    if (language === 'cpp') {
      // Check only for critical missing headers based on code content
      const headerLines = lines
        .map((line, index) => ({ line, index }))
        .filter(({ line }) => line.includes('#include'));
      
      // Direct feedback on critical missing headers only
      const codeHasVectors = code.includes('vector<') || code.includes('vector >');
      const codeHasSort = code.includes('sort(') || code.includes('std::sort');
      const hasIOStream = headerLines.some(({ line }) => line.includes('<iostream>'));
      const hasStdIO = headerLines.some(({ line }) => line.includes('<stdio.h>'));
      const hasVector = headerLines.some(({ line }) => line.includes('<vector>'));
      const hasAlgorithm = headerLines.some(({ line }) => line.includes('<algorithm>'));
      
      if (codeHasVectors && !hasVector) {
        hasErrors = true;
        analysis.push(`<p class="text-red-400 mt-2">🚫 Syntax error: Missing <code>&lt;vector&gt;</code> header but using vector</p>`);
      }
      
      if (codeHasSort && !hasAlgorithm) {
        hasErrors = true;
        analysis.push(`<p class="text-red-400 mt-2">🚫 Syntax error: Missing <code>&lt;algorithm&gt;</code> header but using sort</p>`);
      }
      
      // Missing semicolons check (improved to avoid false positives)
      const potentialSemicolonMissing = lines
        .map((line, index) => ({ line, index }))
        .filter(({ line }) => {
          const trimmed = line.trim();
          return !trimmed.startsWith('//') && 
                 !trimmed.startsWith('#') && 
                 !trimmed.endsWith('{') && 
                 !trimmed.endsWith('}') && 
                 !trimmed.endsWith(';') &&
                 !trimmed.startsWith('for') &&
                 !trimmed.startsWith('if') &&
                 !trimmed.startsWith('while') &&
                 !trimmed.endsWith(':') &&
                 trimmed.length > 0;
        });
      
      if (potentialSemicolonMissing.length > 0) {
        hasErrors = true;
        analysis.push(`<p class="text-red-400 mt-3">🚫 Syntax error: Missing semicolons on lines: ${potentialSemicolonMissing.map(x => x.index + 1).join(', ')}</p>`);
      }
      
      // Check for unbalanced braces 
      const openBraces = (code.match(/\{/g) || []).length;
      const closeBraces = (code.match(/\}/g) || []).length;
      
      if (openBraces !== closeBraces) {
        hasErrors = true;
        analysis.push(`<p class="text-red-400 mt-3">🚫 Syntax error: Unbalanced braces ({ and }). Found ${openBraces} opening and ${closeBraces} closing braces.</p>`);
      }
    } else if (language === 'python') {
      // Only check for critical Python syntax issues
      
      // Indentation issues (critical for Python)
      interface IndentationIssue {
        line: string;
        index: number;
        issue: string;
      }
      
      const indentationIssues: IndentationIssue[] = [];
      let previousIndentation = 0;
      
      lines.forEach((line, index) => {
        const trimmedLine = line.trimRight();
        if (trimmedLine.length === 0) return;
        
        const indentation = line.length - line.trimLeft().length;
        
        // Check for inconsistent indentation (not a multiple of 4 or 2)
        if (indentation > 0 && indentation % 2 !== 0) {
          indentationIssues.push({ line, index, issue: 'Inconsistent indentation' });
        }
        
        previousIndentation = indentation;
      });
      
      if (indentationIssues.length > 0) {
        hasErrors = true;
        analysis.push(`<p class="text-red-400 mt-3">🚫 Syntax error: Python indentation issues on lines: ${indentationIssues.map(x => x.index + 1).join(', ')}</p>`);
      }
      
      // Check for unbalanced parentheses
      const openParens = (code.match(/\(/g) || []).length;
      const closeParens = (code.match(/\)/g) || []).length;
      
      if (openParens !== closeParens) {
        hasErrors = true;
        analysis.push(`<p class="text-red-400 mt-3">🚫 Syntax error: Unbalanced parentheses. Found ${openParens} opening and ${closeParens} closing parentheses.</p>`);
      }
    }
    
    // Add general feedback
    if (!hasErrors && analysis.length === 0) {
      analysis.push(`<p class="text-green-400">✅ No syntax errors detected</p>`);
    }
    
    // Use Groq API for detailed analysis if available
    if (process.env.GROQ_API_KEY && code.trim().length > 0) {
      try {
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: 'llama3-8b-8192',
            messages: [
              {
                role: 'system',
                content: 'You are a competitive programming code analyzer. Focus ONLY on syntax errors and bugs that would prevent the code from running correctly in a competitive programming context. DO NOT comment on code readability, style, or performance optimizations unless they would cause the solution to fail. Be extremely concise and direct about errors.'
              },
              {
                role: 'user',
                content: `Analyze this ${language} code for syntax errors and bugs only. This is for competitive programming, so ignore style and readability:\n\n${code}`
              }
            ],
            temperature: 0.1,
            max_tokens: 1000
          })
        });
        
        const data = await response.json();
        if (data.choices && data.choices[0].message.content) {
          // Only show AI analysis if there are errors or the basic analysis didn't find anything
          if (hasErrors || analysis.length <= 1) {
            return `${analysis.join('\n')}\n\n<div class="bg-[#252526] p-3 rounded mt-3">${data.choices[0].message.content.replace(/\n/g, '<br>')}</div>`;
          }
        }
      } catch (groqError) {
        console.error('Groq API error:', groqError);
        // Continue with basic analysis if Groq fails
      }
    }
    
    return analysis.join('\n');
  } catch (error) {
    console.error('Error analyzing code:', error);
    return '<p class="text-red-400">An error occurred during analysis. Please try again.</p>';
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as AnalyzerRequest;
    const { language, code } = body;

    if (!language || !code) {
      return NextResponse.json<AnalyzerError>(
        { error: 'Language and code are required' },
        { status: 400 }
      );
    }

    // Call the AI analysis function
    const analysis = await analyzeCodeWithAI(code, language);

    const response: AnalyzerResponse = {
      analysis
    };

    return NextResponse.json(response);
  } catch (error: any) {
    console.error('Code Analysis API Error:', error);
    return NextResponse.json<AnalyzerError>(
      { error: error.message || 'An unknown error occurred' },
      { status: 500 }
    );
  }
} 