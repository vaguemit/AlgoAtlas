// Helper functions for learning paths

// Get color gradient based on path title
export function getColorGradient(pathTitle: string): string {
  if (!pathTitle) return 'from-gray-600 to-gray-400';
  
  if (pathTitle.includes('Diamond')) return 'from-slate-300 to-white';
  if (pathTitle.includes('Emerald')) return 'from-green-600 to-green-400';
  if (pathTitle.includes('Sapphire')) return 'from-blue-600 to-blue-400';
  if (pathTitle.includes('Amethyst')) return 'from-purple-600 to-purple-400';
  if (pathTitle.includes('Ruby')) return 'from-red-600 to-red-400';
  return 'from-gray-600 to-gray-400';
}

// Get difficulty label based on path title
export function getDifficulty(pathTitle: string): string {
  if (!pathTitle) return 'Beginner';
  
  if (pathTitle.includes('Diamond')) return 'Newbie';
  if (pathTitle.includes('Emerald')) return 'Beginner';
  if (pathTitle.includes('Sapphire')) return 'Intermediate';
  if (pathTitle.includes('Amethyst')) return 'Master';
  if (pathTitle.includes('Ruby')) return 'Advanced';
  return 'Beginner';
}

// Format large numbers with comma separators
export function formatNumber(num: number): string {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
} 