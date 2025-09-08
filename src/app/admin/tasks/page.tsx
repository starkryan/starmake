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
import { FaPlus, FaPlay, FaPause, FaCheck, FaTasks, FaInstagram, FaYoutube, FaVideo, FaFileAlt, FaPoll, FaMobile, FaQuestion } from "react-icons/fa"

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

function formatDate(input?: string) {
  if (!input) return "-"
  try {
    return new Date(input).toLocaleDateString()
  } catch {
    return input as string
  }
}

function getTaskTypeConfig(taskType: string) {
  const configMap: Record<string, { label: string; icon: React.ReactNode }> = {
    instagram: { label: "Instagram", icon: <FaInstagram className="w-3 h-3" /> },
    youtube: { label: "YouTube", icon: <FaYoutube className="w-3 h-3" /> },
    video: { label: "Video", icon: <FaVideo className="w-3 h-3" /> },
    content: { label: "Content", icon: <FaFileAlt className="w-3 h-3" /> },
    survey: { label: "Survey", icon: <FaPoll className="w-3 h-3" /> },
    app_test: { label: "App Test", icon: <FaMobile className="w-3 h-3" /> },
    other: { label: "Other", icon: <FaQuestion className="w-3 h-3" /> }
  }
  return configMap[taskType] || { label: taskType, icon: <FaQuestion className="w-3 h-3" /> }
}

export default function AdminTasks() {
  return (
    <AuthProtected requireAdmin={true}>
      <AdminTasksContent />
    </AuthProtected>
  )
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
      setTasks((data as Task[]) || [])
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="default">Active</Badge>
      case "paused":
        return <Badge variant="secondary">Paused</Badge>
      case "completed":
        return <Badge variant="outline">Completed</Badge>
      default:
        return <Badge variant="outline" className="capitalize">{status}</Badge>
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
    <div className="max-w-6xl mx-auto p-4 sm:p-6 pb-24 space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <FaTasks className="w-6 h-6" />
          <h1 className="text-2xl md:text-3xl font-bold">Task Management</h1>
        </div>

        {/* Dialog trigger: full width on mobile for easier tapping */}
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto flex items-center justify-center gap-2">
              <FaPlus />
              <span className="hidden sm:inline">Create New Task</span>
              <span className="sm:hidden">New Task</span>
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Create New Task</DialogTitle>
              <DialogDescription>Create a new task for users to complete</DialogDescription>
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
          {/* Desktop table */}
          <div className="hidden md:block overflow-x-auto">
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
                      <Badge variant="outline" className="flex items-center gap-1">
                        {getTaskTypeConfig(task.task_type).icon}
                        {getTaskTypeConfig(task.task_type).label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {task.is_free ? <Badge variant="secondary">Free</Badge> : `₹${task.price}`}
                    </TableCell>
                    <TableCell>{task.mb_limit ?? "-"}</TableCell>
                    <TableCell>{getStatusBadge(task.status)}</TableCell>
                    <TableCell>{formatDate(task.created_at)}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleTaskStatusChange(task.id, "active")}
                          disabled={task.status === "active"}
                          className="flex items-center gap-1"
                        >
                          <FaPlay className="w-3 h-3" />
                          <span className="hidden md:inline">Activate</span>
                        </Button>

                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleTaskStatusChange(task.id, "paused")}
                          disabled={task.status === "paused"}
                          className="flex items-center gap-1"
                        >
                          <FaPause className="w-3 h-3" />
                          <span className="hidden md:inline">Pause</span>
                        </Button>

                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleTaskStatusChange(task.id, "completed")}
                          disabled={task.status === "completed"}
                          className="flex items-center gap-1"
                        >
                          <FaCheck className="w-3 h-3" />
                          <span className="hidden md:inline">Complete</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden space-y-3">
            {tasks.map((task) => (
              <div key={task.id} className="border rounded-lg p-3 bg-card/40">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div className="font-medium">{task.title}</div>
                        <div className="text-xs text-muted-foreground truncate max-w-[220px]">{task.description}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">{task.is_free ? "Free" : `₹${task.price}`}</div>
                        <div className="text-xs text-muted-foreground">{formatDate(task.created_at)}</div>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center gap-2">
                      <Badge variant="outline" className="flex items-center gap-1">
                        {getTaskTypeConfig(task.task_type).icon}
                        <span className="text-xs">{getTaskTypeConfig(task.task_type).label}</span>
                      </Badge>

                      <div className="ml-2">{getStatusBadge(task.status)}</div>
                    </div>

                    <div className="mt-3 flex gap-2 flex-wrap">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleTaskStatusChange(task.id, "active")}
                        disabled={task.status === "active"}
                        className="flex-1"
                      >
                        <FaPlay className="w-3 h-3 mr-2" />
                        <span>Activate</span>
                      </Button>

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleTaskStatusChange(task.id, "paused")}
                        disabled={task.status === "paused"}
                        className="flex-1"
                      >
                        <FaPause className="w-3 h-3 mr-2" />
                        <span>Pause</span>
                      </Button>

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleTaskStatusChange(task.id, "completed")}
                        disabled={task.status === "completed"}
                        className="flex-1"
                      >
                        <FaCheck className="w-3 h-3 mr-2" />
                        <span>Complete</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
