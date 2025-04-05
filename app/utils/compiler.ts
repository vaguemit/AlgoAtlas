import { Language } from '../types/compiler';

export const LANGUAGE_CONFIGS = {
  cpp: {
    id: 54, // C++ (GCC 9.2.0)
    name: 'C++',
    template: `#include <iostream>
using namespace std;

int main() {
    // Your code here
    return 0;
}`,
  },
  python: {
    id: 71, // Python (3.8.1)
    name: 'Python',
    template: `# Your code here`,
  },
  java: {
    id: 62, // Java (OpenJDK 13.0.1)
    name: 'Java',
    template: `public class Main {
    public static void main(String[] args) {
        // Your code here
    }
}`,
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