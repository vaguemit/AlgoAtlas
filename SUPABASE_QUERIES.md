# Supabase Query System for AlgoAtlas

This document outlines how to use the Supabase query system implemented in AlgoAtlas for database operations.

## Table of Contents

1. [Overview](#overview)
2. [Setting Up](#setting-up)
3. [useSupabaseQuery Hook](#usesupabasequery-hook)
4. [useSupabaseMutation Hook](#usesupabasemutation-hook)
5. [Example Usage](#example-usage)
6. [API Endpoints](#api-endpoints)
7. [Troubleshooting](#troubleshooting)

## Overview

The Supabase query system provides a set of hooks and utilities for interacting with the Supabase database in a React application. It simplifies common database operations and provides a consistent interface for queries and mutations.

## Setting Up

Make sure you have the proper environment variables set up in your `.env.local` file:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## useSupabaseQuery Hook

The `useSupabaseQuery` hook is used for reading data from the database.

### Parameters

```typescript
interface QueryOptions<T> {
  table: string;              // The name of the table to query
  select?: string;            // The columns to select (default: '*')
  eq?: { column: string; value: any }[];  // Equality filters
  orderBy?: { column: string; ascending?: boolean }; // Sorting options
  limit?: number;             // Maximum number of rows to return
  skip?: number;              // Number of rows to skip
  enabled?: boolean;          // Whether the query should run (default: true)
}
```

### Return Value

```typescript
interface QueryResult<T> {
  data: T[] | null;           // The query results
  error: PostgrestError | null; // Any error that occurred
  count: number | null;       // The total count of rows (if requested)
  isLoading: boolean;         // Whether the query is currently loading
  isError: boolean;           // Whether an error occurred
  isSuccess: boolean;         // Whether the query completed successfully
  refetch: () => Promise<void>; // Function to manually refetch the data
}
```

### Example

```typescript
import { useSupabaseQuery } from '@/hooks/use-supabase-query';

// In your component
const { data, isLoading, error } = useSupabaseQuery<YourType>({
  table: 'your_table',
  eq: [{ column: 'user_id', value: userId }],
  orderBy: { column: 'created_at', ascending: false },
  limit: 10
});
```

## useSupabaseMutation Hook

The `useSupabaseMutation` hook is used for writing data to the database (insert, update, delete).

### Parameters

```typescript
function useSupabaseMutation<T = any>(table: string);
```

### Return Value

```typescript
interface MutationResult<T> {
  insert: (values: Partial<T> | Partial<T>[]) => Promise<{ data: T[] | null; error: PostgrestError | null }>;
  update: (values: Partial<T>, column: string, match: any) => Promise<{ data: T[] | null; error: PostgrestError | null }>;
  remove: (column: string, match: any) => Promise<{ data: T[] | null; error: PostgrestError | null }>;
  isLoading: boolean;
  error: PostgrestError | null;
}
```

### Example

```typescript
import { useSupabaseMutation } from '@/hooks/use-supabase-query';

// In your component
const { insert, update, remove, isLoading } = useSupabaseMutation<YourType>('your_table');

// Insert a new row
const handleInsert = async () => {
  const { data, error } = await insert({ 
    name: 'New Item',
    created_at: new Date().toISOString()
  });
};

// Update an existing row
const handleUpdate = async (id: string) => {
  const { data, error } = await update({ 
    name: 'Updated Item' 
  }, 'id', id);
};

// Delete a row
const handleDelete = async (id: string) => {
  const { data, error } = await remove('id', id);
};
```

## Example Usage

### Learning Progress Table

```tsx
import { useSupabaseQuery } from '@/hooks/use-supabase-query';

export function LearningProgressTable({ pathId }: { pathId?: string }) {
  const { data, isLoading, error, refetch } = useSupabaseQuery<{
    id: string;
    path_id: string;
    topic_id: string;
    status: string;
    last_updated: string;
  }>({
    table: 'learning_progress',
    eq: pathId ? [{ column: 'path_id', value: pathId }] : undefined,
    orderBy: { column: 'last_updated', ascending: false }
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!data || data.length === 0) return <div>No data found</div>;

  return (
    // Render your data here
  );
}
```

### Learning Progress Update Form

```tsx
import { useSupabaseMutation } from '@/hooks/use-supabase-query';
import { useAuth } from '@/hooks/use-auth';

export function LearningProgressUpdate() {
  const { user } = useAuth();
  const { insert, update, isLoading } = useSupabaseMutation('learning_progress');

  const handleSubmit = async (values) => {
    if (!user) return;

    const data = {
      user_id: user.id,
      path_id: values.pathId,
      topic_id: values.topicId,
      status: values.status,
      last_updated: new Date().toISOString()
    };

    // First check if entry exists
    const response = await fetch('/api/learning-progress/check', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        pathId: values.pathId,
        topicId: values.topicId
      })
    });
    
    const { id: existingId } = await response.json();
    
    if (existingId) {
      await update(data, 'id', existingId);
    } else {
      await insert(data);
    }
  };

  return (
    // Render your form here
  );
}
```

## API Endpoints

### Check Learning Progress Endpoint

Endpoint: `/api/learning-progress/check`  
Method: `POST`  
Body:
```json
{
  "pathId": "string",
  "topicId": "string",
  "subtopicId": "string|null"
}
```
Response:
```json
{
  "id": "string|null"
}
```

This endpoint checks if a learning progress entry already exists for the current user with the given path, topic, and optional subtopic. It returns the ID of the existing entry or null if it doesn't exist.

## Troubleshooting

### Common Issues

1. **Authentication Issues**: Make sure the user is authenticated before making queries that require authentication. Use the `useAuth` hook to check if a user is logged in.

2. **Type Errors**: Ensure that your TypeScript types match the database schema. The generic type parameter `<T>` in `useSupabaseQuery<T>` and `useSupabaseMutation<T>` should match the structure of your database table.

3. **Missing Data**: If your query returns empty results, check that your filters are correct and that the table contains the expected data.

4. **Permissions Issues**: Ensure that your Supabase Row Level Security (RLS) policies are properly configured to allow the necessary operations.

### When to Use Server-Side vs. Client-Side Queries

- **Server-Side**: Use server-side queries (in API routes) for operations that require sensitive information or complex business logic.
- **Client-Side**: Use client-side queries (with `useSupabaseQuery` and `useSupabaseMutation`) for simple CRUD operations and real-time data updates.

Remember that exposing queries directly to the client requires proper RLS policies to protect your data. 