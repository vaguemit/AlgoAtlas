import { Language } from '../types/compiler';

// Regular expressions to identify common algorithm patterns
const patterns = {
  // Loops and iterations
  nestedLoops: {
    regex: /for\s*\([^)]*\)[^{]*{[^}]*for\s*\([^)]*\)/g,
    complexity: 'O(n²)',
    description: 'Nested loops typically result in quadratic time complexity'
  },
  tripleNestedLoops: {
    regex: /for\s*\([^)]*\)[^{]*{[^}]*for\s*\([^)]*\)[^{]*{[^}]*for\s*\([^)]*\)/g,
    complexity: 'O(n³)',
    description: 'Triple nested loops typically result in cubic time complexity'
  },
  singleLoop: {
    regex: /\b(for|while)\s*\(/g,
    complexity: 'O(n)',
    description: 'Simple loops typically result in linear time complexity'
  },
  
  // Common algorithms
  binarySearch: {
    regex: /\b(binary_search|lower_bound|upper_bound)\b|\bmid\s*=\s*(\(\s*)?start\s*\+\s*\(\s*end\s*-\s*start\s*\)\s*\/\s*2/g,
    complexity: 'O(log n)',
    description: 'Binary search or divide and conquer algorithms typically have logarithmic time complexity'
  },
  quickSort: {
    regex: /\b(quicksort|quick_sort|partition)\b/g,
    complexity: 'O(n log n)',
    description: 'Quicksort has an average time complexity of O(n log n)'
  },
  mergeSort: {
    regex: /\b(mergesort|merge_sort|merge)\b/g,
    complexity: 'O(n log n)',
    description: 'Merge sort has a time complexity of O(n log n)'
  },
  
  // Data structures
  hashMap: {
    regex: /\b(map|unordered_map|HashMap|dict)\b/g,
    complexity: 'O(1) average lookup',
    description: 'Hash maps typically have constant time lookups'
  },
  recursion: {
    regex: /\bfunction\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*\([^)]*\)[^{]*{[^}]*\1\s*\(/g,
    complexity: 'Varies',
    description: 'Recursive algorithms have varying complexities depending on implementation'
  }
};

// Language-specific patterns
const languagePatterns: Record<Language, Record<string, RegExp>> = {
  cpp: {
    // STL algorithms
    stlSort: /\bsort\s*\(/g,
    stlFind: /\bfind\s*\(/g,
    vectors: /\bvector\s*<\s*[^>]*\s*>\s*[a-zA-Z_][a-zA-Z0-9_]*/g,
    priorityQueue: /\bpriority_queue\s*<\s*[^>]*\s*>\s*[a-zA-Z_][a-zA-Z0-9_]*/g,
  },
  python: {
    listComprehension: /\[[^\]]*for[^\]]*\]/g,
    sortMethod: /\.sort\s*\(/g,
    dictOperations: /\{[^}]*:[^}]*\}/g,
  },
  java: {
    arrayList: /\bArrayList\s*<\s*[^>]*\s*>\s*[a-zA-Z_][a-zA-Z0-9_]*/g,
    hashMap: /\bHashMap\s*<\s*[^>]*\s*>\s*[a-zA-Z_][a-zA-Z0-9_]*/g,
    streamOperations: /\.stream\(\).*\.collect\(/g,
  },
};

export interface ComplexityResult {
  timeComplexity: string;
  spaceComplexity: string;
  details: {
    pattern: string;
    complexity: string;
    description: string;
    count: number;
  }[];
}

/**
 * Analyze code to estimate time and space complexity
 */
export function analyzeComplexity(code: string, language: Language): ComplexityResult {
  const results: ComplexityResult = {
    timeComplexity: 'O(1)',  // Default
    spaceComplexity: 'O(1)', // Default
    details: []
  };
  
  let highestComplexityFound = 0;
  let hasNestedLoops = false;
  let hasTripleNestedLoops = false;
  let hasRecursion = false;
  
  // Check general patterns
  for (const [key, pattern] of Object.entries(patterns)) {
    const matches = (code.match(pattern.regex) || []).length;
    if (matches > 0) {
      results.details.push({
        pattern: key,
        complexity: pattern.complexity,
        description: pattern.description,
        count: matches
      });
      
      // Determine complexity hierarchy
      if (key === 'tripleNestedLoops' && matches > 0) {
        hasTripleNestedLoops = true;
        highestComplexityFound = Math.max(highestComplexityFound, 3);
      } else if (key === 'nestedLoops' && matches > 0) {
        hasNestedLoops = true;
        highestComplexityFound = Math.max(highestComplexityFound, 2);
      } else if (key === 'singleLoop' && matches > 0 && !hasNestedLoops && !hasTripleNestedLoops) {
        highestComplexityFound = Math.max(highestComplexityFound, 1);
      } else if (key === 'recursion' && matches > 0) {
        hasRecursion = true;
      }
    }
  }
  
  // Check language-specific patterns
  const langSpecificPatterns = languagePatterns[language];
  for (const [key, regex] of Object.entries(langSpecificPatterns)) {
    const matches = (code.match(regex) || []).length;
    if (matches > 0) {
      let complexity = 'O(1)';
      let description = '';
      
      // Assign complexity based on the pattern
      switch (key) {
        case 'stlSort':
        case 'sortMethod':
          complexity = 'O(n log n)';
          description = 'Sorting operations typically have O(n log n) time complexity';
          highestComplexityFound = Math.max(highestComplexityFound, 1.5); // Between O(n) and O(n²)
          break;
        case 'dictOperations':
        case 'hashMap':
          description = 'Hash-based operations typically have constant time complexity for lookups';
          break;
        case 'vectors':
        case 'arrayList':
          complexity = 'O(n) space';
          description = 'Dynamic arrays use linear space complexity';
          break;
        case 'listComprehension':
          complexity = 'O(n)';
          description = 'List comprehensions typically have linear time complexity';
          highestComplexityFound = Math.max(highestComplexityFound, 1);
          break;
        case 'priorityQueue':
          complexity = 'O(log n) per operation';
          description = 'Priority queue operations typically have logarithmic time complexity';
          break;
        case 'streamOperations':
          complexity = 'O(n)';
          description = 'Stream operations usually involve processing each element once';
          highestComplexityFound = Math.max(highestComplexityFound, 1);
          break;
      }
      
      results.details.push({
        pattern: key,
        complexity,
        description,
        count: matches
      });
    }
  }
  
  // Determine overall time complexity
  if (hasTripleNestedLoops) {
    results.timeComplexity = 'O(n³)';
  } else if (hasNestedLoops) {
    results.timeComplexity = 'O(n²)';
  } else if (highestComplexityFound === 1.5) {
    results.timeComplexity = 'O(n log n)';
  } else if (highestComplexityFound === 1) {
    results.timeComplexity = 'O(n)';
  } else if (hasRecursion) {
    results.timeComplexity = 'O(?) - Recursive';
  }
  
  // Estimate space complexity based on data structures and allocations
  const dynamicAllocations = (code.match(/new\s+[a-zA-Z_][a-zA-Z0-9_]*(\s*<[^>]*>)?|malloc\s*\(|calloc\s*\(/g) || []).length;
  const arrayDeclarations = (code.match(/\[\s*[a-zA-Z_][a-zA-Z0-9_]*\s*\]/g) || []).length;
  
  if (dynamicAllocations > 0 || arrayDeclarations > 0) {
    results.spaceComplexity = 'O(n)';
  }
  
  return results;
} 