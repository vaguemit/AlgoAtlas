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
 * Mock analysis function - in production, this would call an AI model
 */
async function analyzeCodeWithAI(code: string, language: string): Promise<string> {
  // This is a simplified mock implementation
  // In production, you would call an actual AI model API (OpenAI, etc.)
  
  try {
    // Basic code analysis without actual AI
    const lines = code.split('\n');
    const analysis = [];
    let hasErrors = false;
    
    // Simple language-specific checks
    if (language === 'cpp') {
      // Check for missing semicolons (very basic)
      const missingLines = lines
        .map((line, index) => ({ line, index }))
        .filter(({ line }) => 
          !line.trim().startsWith('//') && 
          !line.trim().startsWith('#') && 
          !line.trim().endsWith('{') && 
          !line.trim().endsWith('}') && 
          !line.trim().endsWith(';') && 
          line.trim().length > 0
        );
      
      if (missingLines.length > 0) {
        hasErrors = true;
        analysis.push(`<h3 class="text-red-400">🔍 Potential syntax issues found:</h3>`);
        analysis.push(`<ul>${missingLines.map(({ line, index }) => 
          `<li class="mb-2"><span class="text-red-400">Line ${index + 1}:</span> Missing semicolon in statement: <pre class="bg-[#252526] p-2 mt-1 rounded text-xs">${line}</pre></li>`
        ).join('')}</ul>`);
      }
      
      // Check for variable declarations
      const variableLines = lines
        .map((line, index) => ({ line, index }))
        .filter(({ line }) => 
          (line.includes('int ') || line.includes('float ') || 
           line.includes('double ') || line.includes('char ') ||
           line.includes('bool ')) && 
          !line.trim().startsWith('//') && 
          !line.includes('(')
        );
      
      if (variableLines.length > 0) {
        analysis.push(`<h3 class="text-blue-400">📊 Variables found:</h3>`);
        analysis.push(`<ul>${variableLines.map(({ line, index }) => 
          `<li class="mb-1"><span class="text-blue-400">Line ${index + 1}:</span> ${line.trim()}</li>`
        ).join('')}</ul>`);
      }
    }
    
    // Generic code quality checks
    const longLines = lines
      .map((line, index) => ({ line, index }))
      .filter(({ line }) => line.length > 80);
    
    if (longLines.length > 0) {
      analysis.push(`<h3 class="text-orange-400">⚠️ Code style suggestions:</h3>`);
      analysis.push(`<p>Found ${longLines.length} lines longer than 80 characters. Consider breaking these into shorter lines for better readability.</p>`);
    }
    
    const commentCount = lines.filter(line => line.trim().startsWith('//') || line.includes('/*')).length;
    const codeToCommentRatio = commentCount / lines.length;
    
    if (codeToCommentRatio < 0.1 && lines.length > 10) {
      analysis.push(`<p class="mt-2">Your code has few comments (${commentCount} comment lines out of ${lines.length} total lines). Adding more comments can improve readability.</p>`);
    }
    
    // Add general feedback
    if (!hasErrors && analysis.length === 0) {
      analysis.push(`<h3 class="text-green-400">✅ No major issues found!</h3>`);
      analysis.push(`<p>Your code looks good syntactically. Here are some general tips to consider:</p>`);
      analysis.push(`<ul>
        <li>Make sure your variable names are descriptive</li>
        <li>Consider edge cases in your logic</li>
        <li>Check for potential performance bottlenecks</li>
        <li>Ensure proper error handling</li>
      </ul>`);
    }
    
    // In production, we would replace this with something like:
    // const response = await openai.chat.completions.create({
    //   model: "gpt-4o",
    //   messages: [
    //     {
    //       role: "system",
    //       content: "You are a code analyzer that provides helpful feedback on code quality, bugs, and improvements."
    //     },
    //     {
    //       role: "user",
    //       content: `Analyze this ${language} code and provide feedback:\n\n${code}`
    //     }
    //   ]
    // });
    // return response.choices[0].message.content;
    
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