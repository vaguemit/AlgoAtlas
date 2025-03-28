'use client'

import React, { useState } from 'react'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  ArrowUpDown, 
  CheckCircle2, 
  BookOpen, 
  Code, 
  CircleDot, 
  FastForward,
  X
} from 'lucide-react'
import { useSupabaseQuery } from '@/hooks/use-supabase-query'
import { ProgressStatus } from '@/hooks/use-learning-progress'
import { Skeleton } from '@/components/ui/skeleton'

interface LearningProgressTableProps {
  pathId?: string
}

const statusIcons: Record<ProgressStatus, React.ReactNode> = {
  'not-started': <CircleDot className="h-4 w-4" />,
  'reading': <BookOpen className="h-4 w-4" />,
  'practicing': <Code className="h-4 w-4" />,
  'complete': <CheckCircle2 className="h-4 w-4" />,
  'skipped': <FastForward className="h-4 w-4" />,
  'ignored': <X className="h-4 w-4" />
}

const statusColors: Record<ProgressStatus, string> = {
  'not-started': 'bg-gray-500/10 text-gray-500',
  'reading': 'bg-yellow-500/10 text-yellow-500',
  'practicing': 'bg-orange-500/10 text-orange-500',
  'complete': 'bg-green-500/10 text-green-500',
  'skipped': 'bg-blue-500/10 text-blue-500',
  'ignored': 'bg-purple-500/10 text-purple-500'
}

export function LearningProgressTable({ pathId }: LearningProgressTableProps) {
  const [sortBy, setSortBy] = useState<'updated' | 'topic'>('updated')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  
  // Set up the Supabase query using our simplified hook
  const { data, isLoading, error, refetch } = useSupabaseQuery<{
    id: string
    path_id: string
    topic_id: string | null
    subtopic_id: string | null
    status: ProgressStatus
    last_updated: string
  }>({
    table: 'learning_progress',
    eq: pathId ? [{ column: 'path_id', value: pathId }] : undefined,
    orderBy: {
      column: sortBy === 'updated' ? 'last_updated' : 'topic_id',
      ascending: sortOrder === 'asc'
    }
  })

  const toggleSort = (column: 'updated' | 'topic') => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(column)
      setSortOrder('desc')
    }
  }

  if (error) {
    return (
      <Card className="border-purple-500/20 bg-black/70 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Learning Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-red-500">
            Error loading progress data: {error.message}
          </div>
          <Button onClick={() => refetch()} className="mt-2">
            Retry
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-purple-500/20 bg-black/70 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Learning Progress</span>
          {pathId && (
            <Badge variant="outline" className="ml-2">
              {pathId.charAt(0).toUpperCase() + pathId.slice(1)} Path
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead 
                className="w-[200px] cursor-pointer"
                onClick={() => toggleSort('topic')}
              >
                <div className="flex items-center">
                  Topic
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead>Subtopic</TableHead>
              <TableHead>Status</TableHead>
              <TableHead 
                className="text-right cursor-pointer"
                onClick={() => toggleSort('updated')}
              >
                <div className="flex items-center justify-end">
                  Last Updated
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              // Loading skeleton
              Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={`skeleton-${index}`}>
                  <TableCell><Skeleton className="h-5 w-[150px]" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-[200px]" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-[100px]" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-[120px]" /></TableCell>
                </TableRow>
              ))
            ) : data && data.length > 0 ? (
              // Actual data rows
              data.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.topic_id}</TableCell>
                  <TableCell>{item.subtopic_id || '—'}</TableCell>
                  <TableCell>
                    <Badge className={statusColors[item.status]}>
                      <span className="flex items-center gap-1">
                        {statusIcons[item.status]}
                        {item.status.replace('-', ' ')}
                      </span>
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {new Date(item.last_updated).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              // No data state
              <TableRow>
                <TableCell colSpan={4} className="text-center py-6 text-gray-400">
                  No progress data found
                  {pathId && ` for ${pathId} path`}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
} 