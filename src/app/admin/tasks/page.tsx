"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"
import AuthProtected from "@/components/auth/auth-protected"
import { Spinner } from "@/components/ui/spinner"
import TaskCreateForm from "@/components/admin/task-create-form"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface Task {
  id: string
  title: string
  description: string
  task_type: string
  price: number
  is_free: boolean
  mb_limit: number | null
  requirements: any
  status: string
  created_at: string
  created_by: string | null
}

function AdminTasksContent() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    try {
      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) throw error
      setTasks(data || [])
    } catch (error) {
      console.error("Error fetching tasks:", error)
      toast.error("Failed to fetch tasks")
    } finally {
      setLoading(false)
    }
  }

  const handleTaskStatusChange = async (taskId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from("tasks")
        .update({ status: newStatus })
        .eq("id", taskId)

      if (error) throw error

      toast.success("Task status updated successfully")
      fetchTasks()
    } catch (error) {
      console.error("Error updating task status:", error)
      toast.error("Failed to update task status")
    }
  }

  const getTaskTypeBadge = (taskType: string) => {
    const typeMap: Record<string, string> = {
      instagram: "Instagram",
      youtube: "YouTube",
      video: "Video",
      content: "Content",
      survey: "Survey",
      app_test: "App Test",
      other: "Other"
    }
    return typeMap[taskType] || taskType
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="default">Active</Badge>
      case "paused":
        return <Badge variant="secondary">Paused</Badge>
      case "completed":
        return <Badge variant="outline">Completed</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner className="h-8 w-8" />
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Task Management</h1>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>Create New Task</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Create New Task</DialogTitle>
              <DialogDescription>
                Create a new task for users to complete
              </DialogDescription>
            </DialogHeader>
            <TaskCreateForm
              onTaskCreated={() => {
                setIsCreateDialogOpen(false)
                fetchTasks()
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Tasks</CardTitle>
          <CardDescription>Manage and monitor all created tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>MB Limit</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tasks.map((task) => (
                <TableRow key={task.id}>
                  <TableCell className="font-medium">{task.title}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{getTaskTypeBadge(task.task_type)}</Badge>
                  </TableCell>
                  <TableCell>
                    {task.is_free ? (
                      <Badge variant="secondary">Free</Badge>
                    ) : (
                      `₹${task.price}`
                    )}
                  </TableCell>
                  <TableCell>{task.mb_limit || "-"}</TableCell>
                  <TableCell>{getStatusBadge(task.status)}</TableCell>
                  <TableCell>
                    {new Date(task.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleTaskStatusChange(task.id, "active")}
                        disabled={task.status === "active"}
                      >
                        Activate
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleTaskStatusChange(task.id, "paused")}
                        disabled={task.status === "paused"}
                      >
                        Pause
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleTaskStatusChange(task.id, "completed")}
                        disabled={task.status === "completed"}
                      >
                        Complete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Requirements Preview Card */}
      <Card>
        <CardHeader>
          <CardTitle>Task Requirements Guide</CardTitle>
          <CardDescription>Example JSON requirements for different task types</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">Instagram Posts:</h4>
            <pre className="bg-muted p-3 rounded text-sm">
{`{
  "min_followers": 1000,
  "hashtags": ["#SalaryWork", "#EarnOnline"],
  "min_likes": 50,
  "min_comments": 5
}`}</pre>
          </div>

          <div>
            <h4 className="font-semibold mb-2">YouTube Videos:</h4>
            <pre className="bg-muted p-3 rounded text-sm">
{`{
  "min_views": 1000,
  "min_duration": 60,
  "required_tags": ["earning", "online"],
  "min_likes": 100
}`}</pre>
          </div>

          <div>
            <h4 className="font-semibold mb-2">App Testing:</h4>
            <pre className="bg-muted p-3 rounded text-sm">
{`{
  "device_requirements": ["android", "ios"],
  "testing_time": 30,
  "report_required": true,
  "screenshots_required": 3
}`}</pre>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function AdminTasks() {
  return (
    <AuthProtected requireAdmin={true}>
      <AdminTasksContent />
    </AuthProtected>
  )
}
