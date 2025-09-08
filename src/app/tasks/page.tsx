"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"
import AuthProtected from "@/components/auth/auth-protected"
import { Spinner } from "@/components/ui/spinner"
import { FaInstagram, FaYoutube, FaVideo, FaFileAlt, FaPoll, FaMobile, FaQuestion, FaRupeeSign, FaCheckCircle, FaClock } from "react-icons/fa"

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
}

function TasksContent() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    try {
      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .eq("status", "active")
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

  const getTaskTypeConfig = (taskType: string) => {
    const configMap: Record<string, { label: string; icon: React.ReactNode }> = {
      instagram: { label: "Instagram", icon: <FaInstagram className="w-4 h-4" /> },
      youtube: { label: "YouTube", icon: <FaYoutube className="w-4 h-4" /> },
      video: { label: "Video", icon: <FaVideo className="w-4 h-4" /> },
      content: { label: "Content", icon: <FaFileAlt className="w-4 h-4" /> },
      survey: { label: "Survey", icon: <FaPoll className="w-4 h-4" /> },
      app_test: { label: "App Test", icon: <FaMobile className="w-4 h-4" /> },
      other: { label: "Other", icon: <FaQuestion className="w-4 h-4" /> }
    }
    return configMap[taskType] || { label: taskType, icon: <FaQuestion className="w-4 h-4" /> }
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
        <h1 className="text-3xl font-bold">Available Tasks</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tasks.map((task) => (
          <Card key={task.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg">{task.title}</CardTitle>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="flex items-center gap-1">
                  {getTaskTypeConfig(task.task_type).icon}
                  {getTaskTypeConfig(task.task_type).label}
                </Badge>
                {task.is_free ? (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <FaCheckCircle className="w-3 h-3" />
                    Free
                  </Badge>
                ) : (
                  <Badge variant="default" className="flex items-center gap-1">
                    <FaRupeeSign className="w-3 h-3" />
                    {task.price}
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-4">
                {task.description}
              </CardDescription>
              {task.mb_limit && (
                <p className="text-sm text-muted-foreground mb-2">
                  MB Limit: {task.mb_limit}MB
                </p>
              )}
              <Button asChild className="w-full">
                <Link href={`/tasks/${task.id}`}>Start Task</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {tasks.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium">No tasks available</h3>
          <p className="text-muted-foreground">
            Check back later for new tasks to complete.
          </p>
        </div>
      )}
      {/* Spacer for bottom navigation on mobile */}
      <div className="h-16 md:hidden -mt-8"></div>
    </div>
  )
}

export default function TasksPage() {
  return (
    <AuthProtected>
      <TasksContent />
    </AuthProtected>
  )
}
