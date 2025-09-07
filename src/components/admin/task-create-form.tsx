"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"
import { useState } from "react"

const taskSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  taskType: z.enum(["instagram", "youtube", "video", "content", "survey", "app_test", "other"]),
  price: z.string().min(1, "Price is required").regex(/^\d+(\.\d{1,2})?$/, "Price must be a valid number"),
  isFree: z.boolean(),
  mbLimit: z.string().optional(),
  requirements: z.string().optional(),
})

type TaskFormValues = z.infer<typeof taskSchema>

interface TaskCreateFormProps {
  onTaskCreated?: () => void
}

export default function TaskCreateForm({ onTaskCreated }: TaskCreateFormProps) {
  const [submitting, setSubmitting] = useState(false)

  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: "",
      description: "",
      taskType: "instagram",
      price: "0",
      isFree: false,
      mbLimit: "",
      requirements: "",
    },
  })

  const onSubmit = async (values: TaskFormValues) => {
    setSubmitting(true)
    try {
      const requirements = values.requirements ? JSON.parse(values.requirements) : {}
      
      const { data, error } = await supabase
        .from("tasks")
        .insert([
          {
            title: values.title,
            description: values.description,
            task_type: values.taskType,
            price: parseFloat(values.price),
            is_free: values.isFree,
            mb_limit: values.mbLimit ? parseInt(values.mbLimit) : null,
            requirements: requirements,
            status: "active",
          },
        ])
        .select()

      if (error) throw error

      form.reset()
      toast.success("Task created successfully!")
      onTaskCreated?.()
    } catch (error) {
      console.error("Error creating task:", error)
      toast.error("Failed to create task")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Task Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter task title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Describe the task requirements" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="taskType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Task Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select task type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="instagram">Instagram Post</SelectItem>
                  <SelectItem value="youtube">YouTube Video</SelectItem>
                  <SelectItem value="video">Video Creation</SelectItem>
                  <SelectItem value="content">Content Creation</SelectItem>
                  <SelectItem value="survey">Survey</SelectItem>
                  <SelectItem value="app_test">App Testing</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="isFree"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Free Task</FormLabel>
                <FormDescription>
                  Check if this task is free to complete
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        {!form.watch("isFree") && (
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price (₹)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" placeholder="Enter price" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="mbLimit"
          render={({ field }) => (
            <FormItem>
              <FormLabel>MB Limit (Optional)</FormLabel>
              <FormControl>
                <Input type="number" placeholder="Enter MB limit" {...field} />
              </FormControl>
              <FormDescription>
                Set a data limit for this task if applicable
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="requirements"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Requirements (JSON)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder='{"min_followers": 1000, "hashtags": ["#SalaryWork"]}'
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Enter specific requirements as JSON. For Instagram: min_followers, hashtags. For YouTube: min_views, duration.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={submitting}>
          {submitting ? "Creating Task..." : "Create Task"}
        </Button>
      </form>
    </Form>
  )
}
