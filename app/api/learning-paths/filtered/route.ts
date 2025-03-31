import { NextResponse } from 'next/server';

// Only include the paths that are in the SQL query (Diamond, Emerald, Sapphire, Amethyst, Ruby)
const filteredPaths = [
  {
    id: "diamond-path",
    title: "Diamond Path",
    description: "Getting started with competitive programming for beginners. Learn the basics to launch your CP journey.",
    problemCount: 16,
    estimatedHours: 8,
    difficulty: "Beginner"
  },
  {
    id: "emerald-path",
    title: "Emerald Path",
    description: "Introduction to competitive programming. Learn basic algorithms, sorting, searching, and fundamental data structures.",
    problemCount: 16,
    estimatedHours: 10,
    difficulty: "Beginner"
  },
  {
    id: "sapphire-path",
    title: "Sapphire Path",
    description: "Intermediate problem-solving skills. Focus on greedy algorithms, basic graph theory, and string manipulation.",
    problemCount: 20,
    estimatedHours: 12,
    difficulty: "Intermediate"
  },
  {
    id: "amethyst-path",
    title: "Amethyst Path",
    description: "Advanced competitive programming. Master segment trees, advanced graph algorithms, and complex dynamic programming.",
    problemCount: 23,
    estimatedHours: 12,
    difficulty: "Advanced"
  },
  {
    id: "ruby-path",
    title: "Ruby Path",
    description: "Expert-level algorithms and techniques. Advanced data structures, network flow, and advanced dynamic programming patterns.",
    problemCount: 28,
    estimatedHours: 14,
    difficulty: "Advanced"
  }
];

export async function GET() {
  return NextResponse.json({ 
    paths: filteredPaths
  }, {
    headers: {
      'Cache-Control': 'no-store',
      'X-Cache': 'FILTERED'
    }
  });
} 