import { Language } from '../types/compiler';

export const LANGUAGE_CONFIGS = {
  python: {
    id: 'python-3.14',
    name: 'Python',
    template: `# Your code here`,
  },
  c: {
    id: 'gcc-15',
    name: 'C',
    template: `#include <stdio.h>\nint main() { return 0; }`,
  },
  cpp: {
    id: 'g++-15',
    name: 'C++',
    template: `#include <iostream>\nusing namespace std;\nint main() { return 0; }`,
  },
  java: {
    id: 'openjdk-25',
    name: 'Java',
    template: `public class Main {\n    public static void main(String[] args) {}\n}`,
  },
  csharp: {
    id: 'dotnet-csharp-9',
    name: 'C#',
    template: `using System;\nclass Program { static void Main() {} }`,
  },
  fsharp: {
    id: 'dotnet-fsharp-9',
    name: 'F#',
    template: `printfn "Hello, World!"`,
  },
  php: {
    id: 'php-8.5',
    name: 'PHP',
    template: `<?php\n// Your code here`,
  },
  ruby: {
    id: 'ruby-4.0',
    name: 'Ruby',
    template: `# Your code here`,
  },
  haskell: {
    id: 'haskell-9.12',
    name: 'Haskell',
    template: `main = putStrLn "Hello, World!"`,
  },
  go: {
    id: 'go-1.26',
    name: 'Go',
    template: `package main\nimport "fmt"\nfunc main() {}`,
  },
  rust: {
    id: 'rust-1.93',
    name: 'Rust',
    template: `fn main() {}`,
  },
  typescript: {
    id: 'typescript-deno',
    name: 'TypeScript',
    template: `// Your code here`,
  },
};

export const STATUS_MESSAGES: { [key: number]: string } = {
  3: 'Accepted',
  4: 'Wrong Answer',
  5: 'Time Limit Exceeded',
  6: 'Compilation Error',
  7: 'Runtime Error',
  8: 'System Error',
  9: 'Memory Limit Exceeded',
  10: 'Invalid Function',
  11: 'Output Limit Exceeded',
};

export function prepareCode(code: string, language: Language): string {
  if (language === 'java' && !code.includes('public class Main')) {
    return `public class Main {
    public static void main(String[] args) {
${code}
    }
}`;
  }
  return code;
} 