export interface LearningPath {
  id: string
  title: string
  description: string
  difficulty: string
  tags: string[]
  created_at: string
  updated_at: string
  created_by?: string
  problemCount?: number
  estimatedHours?: number
  moduleCount?: number
}

export interface LearningModule {
  id: string
  path_id: string
  title: string
  description: string
  order_index: number
  estimated_time_minutes: number
  created_at: string
  updated_at: string
  items?: LearningItem[]
}

export interface LearningItem {
  id: string
  module_id: string
  title: string
  type: 'article' | 'video' | 'quiz' | 'exercise'
  content: string
  order_index: number
  external_url: string
  created_at: string
  updated_at: string
}

// Map to icon components for each path
export const pathIcons: { [key: string]: string } = {
  'Diamond Path': 'Diamond',
  'Emerald Path': 'Award',
  'Sapphire Path': 'Zap',
  'Amethyst Path': 'Star',
  'Ruby Path': 'Gem'
}

// Map to color gradients for each path
export type PathColorSet = {
  main: string;
  light: string;
  dark: string;
}

export const pathColors: { [key: string]: PathColorSet } = {
  'Diamond Path': {
    main: 'slate-300',
    light: 'slate-200',
    dark: 'slate-400'
  },
  'Emerald Path': {
    main: 'green-500',
    light: 'green-400',
    dark: 'green-600'
  },
  'Sapphire Path': {
    main: 'blue-500',
    light: 'blue-400',
    dark: 'blue-600'
  },
  'Amethyst Path': {
    main: 'purple-500',
    light: 'purple-400',
    dark: 'purple-600'
  },
  'Ruby Path': {
    main: 'red-500',
    light: 'red-400',
    dark: 'red-600'
  },
  default: {
    main: 'gray-500',
    light: 'gray-400',
    dark: 'gray-600'
  }
} 