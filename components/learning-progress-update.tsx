'use client'

import React, { useState } from 'react'
import { useSupabaseMutation } from '@/hooks/use-supabase-query'
import { ProgressStatus } from '@/hooks/use-learning-progress'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { Check, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { useAuth } from '@/hooks/use-auth'

const formSchema = z.object({
  pathId: z.string().min(1, 'Path ID is required'),
  topicId: z.string().min(1, 'Topic ID is required'),
  subtopicId: z.string().optional(),
  status: z.enum(['not-started', 'reading', 'practicing', 'complete', 'skipped', 'ignored'])
})

type FormValues = z.infer<typeof formSchema>

interface LearningProgressUpdateProps {
  onSuccess?: () => void
  defaultValues?: Partial<FormValues>
}

export function LearningProgressUpdate({ 
  onSuccess, 
  defaultValues 
}: LearningProgressUpdateProps) {
  const { user } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { insert, update, isLoading, error } = useSupabaseMutation<{
    id?: string
    user_id: string
    path_id: string
    topic_id: string | null
    subtopic_id: string | null
    status: ProgressStatus
    last_updated: string
  }>('learning_progress')
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      pathId: defaultValues?.pathId || '',
      topicId: defaultValues?.topicId || '',
      subtopicId: defaultValues?.subtopicId || '',
      status: defaultValues?.status || 'not-started'
    }
  })
  
  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true)
    
    if (!user) {
      toast.error('You must be logged in to update progress', {
        description: 'Please sign in to save your progress'
      })
      setIsSubmitting(false)
      return
    }
    
    try {
      // Check if entry exists first using Supabase API directly
      const response = await fetch('/api/learning-progress/check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          pathId: values.pathId,
          topicId: values.topicId,
          subtopicId: values.subtopicId || null
        })
      });
      
      const { id: existingId } = await response.json();
      
      // Format the values for Supabase
      const data = {
        user_id: user.id,
        path_id: values.pathId,
        topic_id: values.topicId,
        subtopic_id: values.subtopicId || null,
        status: values.status as ProgressStatus,
        last_updated: new Date().toISOString()
      }
      
      let result;
      
      if (existingId) {
        // Update existing entry
        result = await update(data, 'id', existingId)
      } else {
        // Insert new entry
        result = await insert(data)
      }
      
      if (result.error) throw result.error
      
      toast.success('Progress updated successfully', {
        description: `Updated ${values.topicId} to status: ${values.status}`
      })
      
      // Reset the form
      if (!defaultValues) {
        form.reset({
          pathId: values.pathId,
          topicId: '',
          subtopicId: '',
          status: 'not-started'
        })
      }
      
      // Call the onSuccess callback if provided
      if (onSuccess) {
        onSuccess()
      }
    } catch (err: any) {
      toast.error('Failed to update progress', {
        description: err.message || 'An unknown error occurred'
      })
      console.error('Error updating progress:', err)
    } finally {
      setIsSubmitting(false)
    }
  }
  
  return (
    <Card className="border-purple-500/20 bg-black/70 backdrop-blur-sm">
      <CardHeader>
        <CardTitle>Update Learning Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="pathId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Learning Path</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                    disabled={!!defaultValues?.pathId || isSubmitting}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a learning path" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="diamond">Diamond Path</SelectItem>
                      <SelectItem value="emerald">Emerald Path</SelectItem>
                      <SelectItem value="sapphire">Sapphire Path</SelectItem>
                      <SelectItem value="ruby">Ruby Path</SelectItem>
                      <SelectItem value="amethyst">Amethyst Path</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    The learning path this progress entry belongs to
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="topicId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Topic ID</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g., Dynamic Programming" 
                      {...field} 
                      disabled={!!defaultValues?.topicId || isSubmitting}
                    />
                  </FormControl>
                  <FormDescription>
                    The name of the topic being tracked
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="subtopicId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subtopic ID (Optional)</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g., Knapsack DP" 
                      {...field} 
                      disabled={!!defaultValues?.subtopicId || isSubmitting}
                    />
                  </FormControl>
                  <FormDescription>
                    The specific subtopic, if applicable
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Progress Status</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                    disabled={isSubmitting}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select progress status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="not-started">Not Started</SelectItem>
                      <SelectItem value="reading">Reading</SelectItem>
                      <SelectItem value="practicing">Practicing</SelectItem>
                      <SelectItem value="complete">Complete</SelectItem>
                      <SelectItem value="skipped">Skipped</SelectItem>
                      <SelectItem value="ignored">Ignored</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    The current status of this learning item
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button 
              type="submit" 
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Update Progress
                </>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
} 