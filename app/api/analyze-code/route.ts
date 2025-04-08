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
    // In production, we would use Groq API here
    // This is a simplified implementation that provides more detailed analysis
    
    const lines = code.split('\n');
    const analysis = [];
    let hasErrors = false;
    let hasWarnings = false;
    
    // Check for header includes if C++
    if (language === 'cpp') {
      // Check for headers
      const headerLines = lines
        .map((line, index) => ({ line, index }))
        .filter(({ line }) => line.includes('#include'));
      
      // Direct feedback on actual issues without headers section
      const codeHasVectors = code.includes('vector<') || code.includes('vector >');
      const codeHasSort = code.includes('sort(') || code.includes('std::sort');
      const hasIOStream = headerLines.some(({ line }) => line.includes('<iostream>'));
      const hasStdIO = headerLines.some(({ line }) => line.includes('<stdio.h>'));
      const hasVector = headerLines.some(({ line }) => line.includes('<vector>'));
      const hasAlgorithm = headerLines.some(({ line }) => line.includes('<algorithm>'));
      
      if (codeHasVectors && !hasVector) {
        hasWarnings = true;
        analysis.push(`<p class="text-orange-400 mt-2">⚠️ Missing <code>&lt;vector&gt;</code> header for vector usage.</p>`);
      }
      
      if (codeHasSort && !hasAlgorithm) {
        hasWarnings = true;
        analysis.push(`<p class="text-orange-400 mt-2">⚠️ Missing <code>&lt;algorithm&gt;</code> header for sort functions.</p>`);
      }
      
      if ((!hasIOStream && !hasStdIO) && (code.includes('cout') || code.includes('cin') || code.includes('printf') || code.includes('scanf'))) {
        hasWarnings = true;
        analysis.push(`<p class="text-orange-400 mt-2">⚠️ Missing I/O headers for input/output operations.</p>`);
      }
      
      if (headerLines.length === 0 && code.trim().length > 0) {
        hasWarnings = true;
        analysis.push(`<p class="text-orange-400">⚠️ No header files detected in your C++ code.</p>`);
      }
      
      // Function detection and analysis - just return actual issues
      const functionPattern = /\b(\w+)\s+(\w+)\s*\(([^)]*)\)\s*\{/g;
      let match;
      const functions = [];
      
      // Reset regex
      const functionPatternForLoop = /\b(\w+)\s+(\w+)\s*\(([^)]*)\)\s*\{/g;
      while ((match = functionPatternForLoop.exec(code)) !== null) {
        const returnType = match[1];
        const name = match[2];
        const params = match[3];
        functions.push({ returnType, name, params });
      }
      
      if (functions.length === 0 && !code.includes('int main') && code.trim().length > 0) {
        hasWarnings = true;
        analysis.push(`<p class="text-orange-400 mt-3">⚠️ No function definitions detected in your code.</p>`);
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
        analysis.push(`<p class="text-red-400 mt-3">🚫 Potential missing semicolons on lines: ${potentialSemicolonMissing.map(x => x.index + 1).join(', ')}</p>`);
      }
    } else if (language === 'python') {
      // Python-specific checks
      const importLines = lines
        .map((line, index) => ({ line, index }))
        .filter(({ line }) => line.trim().startsWith('import') || line.trim().startsWith('from'));
      
      if (importLines.length > 0) {
        analysis.push(`<h3 class="text-blue-400">📚 Imports:</h3>`);
        analysis.push(`<ul>${importLines.map(({ line, index }) => 
          `<li class="mb-1"><span class="text-blue-400">Line ${index + 1}:</span> ${line.trim()}</li>`
        ).join('')}</ul>`);
      }
      
      // Function detection in Python
      const functionLines = lines
        .map((line, index) => ({ line, index }))
        .filter(({ line }) => line.trim().startsWith('def '));
      
      if (functionLines.length > 0) {
        analysis.push(`<ul>${functionLines.map(({ line, index }) => 
          `<li class="mb-1"><span class="text-blue-400">Line ${index + 1}:</span> ${line.trim()}</li>`
        ).join('')}</ul>`);
      }
      
      // Check for indentation issues
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
        analysis.push(`<h3 class="text-red-400 mt-3">🔍 Indentation Issues:</h3>`);
        analysis.push(`<ul>${indentationIssues.map(({ line, index, issue }) => 
          `<li class="mb-2"><span class="text-red-400">Line ${index + 1}:</span> ${issue}: <pre class="bg-[#252526] p-2 mt-1 rounded text-xs">${line}</pre></li>`
        ).join('')}</ul>`);
      }
    }
    
    // Generic code quality checks
    const longLines = lines
      .map((line, index) => ({ line, index }))
      .filter(({ line }) => line.length > 80);
    
    if (longLines.length > 0) {
      analysis.push(`<h3 class="text-orange-400 mt-3">⚠️ Code Style Suggestions:</h3>`);
      analysis.push(`<p>Found ${longLines.length} lines longer than 80 characters. Consider breaking these into shorter lines for better readability.</p>`);
    }
    
    const commentCount = lines.filter(line => line.trim().startsWith('//') || line.includes('/*') || line.trim().startsWith('#')).length;
    const codeToCommentRatio = commentCount / lines.length;
    
    if (codeToCommentRatio < 0.1 && lines.length > 10) {
      analysis.push(`<p class="mt-2">Your code has few comments (${commentCount} comment lines out of ${lines.length} total lines). Adding more comments can improve readability.</p>`);
    }
    
    // Add general feedback
    if (!hasErrors && !hasWarnings && analysis.length === 0) {
      analysis.push(`<p class="text-green-400">✅ Your code looks good with no obvious issues.</p>`);
    }
    
    // Use Groq API if available
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
                content: 'You are a code analyzer that checks code for bugs, issues, and provides specific, detailed feedback. Focus on actual problems and don\'t add unnecessary comments when the code is good. Be concise but thorough about actual problems.'
              },
              {
                role: 'user',
                content: `Analyze this ${language} code and provide detailed feedback about what's wrong. Be specific about actual problems and don't mention minor style issues unless they're significant:\n\n${code}`
              }
            ],
            temperature: 0.2,
            max_tokens: 1000
          })
        });
        
        const data = await response.json();
        if (data.choices && data.choices[0].message.content) {
          // Return the AI-generated analysis along with our basic checks
          return `${analysis.join('\n')}\n\n<h3 class="text-blue-400 mt-4">🧠 Detailed Analysis:</h3>\n<div class="bg-[#252526] p-3 rounded">${data.choices[0].message.content.replace(/\n/g, '<br>')}</div>`;
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