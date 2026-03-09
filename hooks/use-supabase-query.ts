'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { PostgrestError } from '@supabase/postgrest-js'
import { useAuth } from '@/hooks/use-auth'

// Simple query options without complex filters
interface QueryOptions<T> {
  table: string
  select?: string
  eq?: { column: string; value: any }[] 
  orderBy?: { column: string; ascending?: boolean }
  limit?: number
  skip?: number
  enabled?: boolean
}

// Result type with loading states
interface QueryResult<T> {
  data: T[] | null
  error: PostgrestError | null
  count: number | null
  isLoading: boolean
  isError: boolean
  isSuccess: boolean
  refetch: () => Promise<void>
}

/**
 * A simplified React hook for Supabase queries
 */
export function useSupabaseQuery<T = any>(
  options: QueryOptions<T>
): QueryResult<T> {
  const { user } = useAuth()
  const [data, setData] = useState<T[] | null>(null)
  const [error, setError] = useState<PostgrestError | null>(null)
  const [count, setCount] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const fetchData = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      // Start building query
      let query = supabase
        .from(options.table)
        .select(options.select || '*', { count: 'exact' })

      // Apply equality filters
      if (options.eq && options.eq.length > 0) {
        options.eq.forEach(filter => {
          query = query.eq(filter.column, filter.value)
        })
      }

      // Apply ordering
      if (options.orderBy) {
        query = query.order(
          options.orderBy.column, 
          { ascending: options.orderBy.ascending !== false }
        )
      }

      // Apply pagination
      if (options.limit) {
        query = query.limit(options.limit)
      }
      
      if (options.skip) {
        query = query.range(options.skip, options.skip + (options.limit || 10) - 1)
      }

      // Execute the query
      const { data: result, error: queryError, count: totalCount } = await query

      if (queryError) {
        throw queryError
      }

      setData(result as T[])
      setCount(totalCount)
      setIsLoading(false)
    } catch (err) {
      setError(err as PostgrestError)
      setIsLoading(false)
    }
  }, [
    options.table,
    options.select,
    options.eq,
    options.orderBy,
    options.limit,
    options.skip
  ])

  useEffect(() => {
    if (options.enabled !== false) {
      fetchData()
    }
  }, [fetchData, options.enabled])

  return {
    data,
    error,
    count,
    isLoading,
    isError: error !== null,
    isSuccess: !isLoading && !error,
    refetch: fetchData
  }
}

/**
 * A simple hook for Supabase mutations (insert, update, delete)
 */
export function useSupabaseMutation<T = any>(table: string) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<PostgrestError | null>(null)
  
  // Insert one or more records
  const insert = async (
    values: Partial<T> | Partial<T>[]
  ) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const { data, error } = await supabase
        .from(table)
        .insert(values)
        .select()
      
      setIsLoading(false)
      
      if (error) throw error
      return { data: data as T[], error: null }
    } catch (err) {
      setError(err as PostgrestError)
      setIsLoading(false)
      return { data: null, error: err as PostgrestError }
    }
  }
  
  // Update records
  const update = async (
    values: Partial<T>,
    column: string,
    match: any
  ) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const { data, error } = await supabase
        .from(table)
        .update(values)
        .eq(column, match)
        .select()
      
      setIsLoading(false)
      
      if (error) throw error
      return { data: data as T[], error: null }
    } catch (err) {
      setError(err as PostgrestError)
      setIsLoading(false)
      return { data: null, error: err as PostgrestError }
    }
  }
  
  // Delete records
  const remove = async (
    column: string,
    match: any
  ) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const { data, error } = await supabase
        .from(table)
        .delete()
        .eq(column, match)
        .select()
      
      setIsLoading(false)
      
      if (error) throw error
      return { data: data as T[], error: null }
    } catch (err) {
      setError(err as PostgrestError)
      setIsLoading(false)
      return { data: null, error: err as PostgrestError }
    }
  }
  
  return {
    insert,
    update,
    remove,
    isLoading,
    error
  }
} 