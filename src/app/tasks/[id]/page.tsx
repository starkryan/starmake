"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"
import AuthProtected from "@/components/auth/auth-protected"
import { Spinner } from "@/components/ui/spinner"
import { authClient } from "@/lib/auth-client"
import { Upload, X, Link as LinkIcon, Image as ImageIcon, FileText, Info } from "lucide-react"
import { FaClipboardList } from "react-icons/fa6"

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

function TaskCompletionContent() {
  const params = useParams()
  const taskId = params.id as string
  const [task, setTask] = useState<Task | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [submissionData, setSubmissionData] = useState({
    proof: "",
    additional_notes: "",
    imageFile: null as File | null,
    imagePreview: null as string | null
  })

  useEffect(() => {
    fetchTask()
  }, [taskId])

  const fetchTask = async () => {
    try {
      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .eq("id", taskId)
        .single()

      if (error) throw error
      setTask(data)
    } catch (error) {
      console.error("Error fetching task:", error)
      toast.error("Failed to load task")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async () => {
    setSubmitting(true)
    try {
      const session = await authClient.getSession()
      if (!session?.data?.user) {
        throw new Error("User not authenticated")
      }

      let imageUrl = null
      // Upload image if provided
      if (submissionData.imageFile) {
        const formData = new FormData()
        formData.append('file', submissionData.imageFile)
        formData.append('userId', session.data.user.id)

        const response = await fetch('/api/upload-task-image', {
          method: 'POST',
          body: formData,
        })

        if (!response.ok) {
          throw new Error('Failed to upload image')
        }

        const result = await response.json()
        imageUrl = result.imageUrl
      }

      const { data, error } = await supabase
        .from("task_submissions")
        .insert([
          {
            task_id: taskId,
            user_id: session.data.user.id,
            submission_proof: {
              proof: submissionData.proof,
              additional_notes: submissionData.additional_notes,
              image_url: imageUrl,
              submitted_at: new Date().toISOString()
            },
            status: "pending"
          }
        ])
        .select()

      if (error) throw error

      toast.success("Task submitted successfully! Awaiting admin approval.")
      setSubmissionData({ 
        proof: "", 
        additional_notes: "", 
        imageFile: null,
        imagePreview: null
      })
    } catch (error) {
      console.error("Error submitting task:", error)
      toast.error("Failed to submit task")
    } finally {
      setSubmitting(false)
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSubmissionData({
        ...submissionData,
        imageFile: file,
        imagePreview: URL.createObjectURL(file)
      })
    }
  }

  const removeImage = () => {
    setSubmissionData({
      ...submissionData,
      imageFile: null,
      imagePreview: null
    })
  }

  const getTaskTypeLabel = (taskType: string) => {
    const typeMap: Record<string, string> = {
      instagram: "Instagram Post",
      youtube: "YouTube Video",
      video: "Video Creation",
      content: "Content Creation",
      survey: "Survey",
      app_test: "App Testing",
      other: "Other"
    }
    return typeMap[taskType] || taskType
  }

  const getSubmissionPlaceholder = (taskType: string) => {
    const placeholderMap: Record<string, string> = {
      instagram: "Paste Instagram post URL here...",
      youtube: "Paste YouTube video URL here...",
      video: "Provide video link or description...",
      content: "Provide content link or details...",
      survey: "Share survey completion details...",
      app_test: "Provide testing report or screenshots...",
      other: "Provide proof of completion..."
    }
    return placeholderMap[taskType] || "Provide proof of task completion..."
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner className="h-8 w-8" />
      </div>
    )
  }

  if (!task) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-2xl font-bold">Task not found</h1>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-4">
        <h1 className="text-3xl font-bold">{task.title}</h1>
        <Badge variant="outline">{getTaskTypeLabel(task.task_type)}</Badge>
        {task.is_free ? (
          <Badge variant="secondary">Free</Badge>
        ) : (
          <Badge variant="default">₹{task.price}</Badge>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Task Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5" />
              Task Details
            </CardTitle>
            <CardDescription>Complete this task to earn rewards</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Description:
              </h3>
              <p className="text-muted-foreground mt-1">{task.description}</p>
            </div>

            {task.mb_limit && (
              <div>
                <h3 className="font-semibold flex items-center gap-2">
                  <Info className="h-4 w-4" />
                  MB Limit:
                </h3>
                <p className="text-muted-foreground mt-1">{task.mb_limit}MB</p>
              </div>
            )}

            {task.requirements && Object.keys(task.requirements).length > 0 && (
              <div>
                <h3 className="font-semibold flex items-center gap-2">
                  <Info className="h-4 w-4" />
                  Requirements:
                </h3>
                <pre className="bg-muted p-3 rounded text-sm mt-2" aria-label="Task requirements in JSON format">
                  {JSON.stringify(task.requirements, null, 2)}
                </pre>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Submission Form */}
        <Card>
          <CardHeader>
            <CardTitle>Submit Your Work</CardTitle>
            <CardDescription>Provide proof of task completion</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="proof-input" className="text-sm font-medium flex items-center gap-2">
                <LinkIcon className="h-4 w-4" />
                Proof of Completion
              </label>
              <Input
                id="proof-input"
                placeholder={getSubmissionPlaceholder(task.task_type)}
                value={submissionData.proof}
                onChange={(e) => setSubmissionData({...submissionData, proof: e.target.value})}
                aria-describedby="proof-help"
              />
              <p id="proof-help" className="text-xs text-muted-foreground">
                {task.task_type === "instagram" && "Paste the URL of your Instagram post or upload screenshot"}
                {task.task_type === "youtube" && "Paste the URL of your YouTube video"}
                {task.task_type === "video" && "Share a link to your video or describe it"}
                {task.task_type === "content" && "Share a link to your content"}
                {task.task_type === "survey" && "Share survey completion details"}
                {task.task_type === "app_test" && "Provide testing report or screenshot links"}
                {task.task_type === "other" && "Provide evidence of task completion"}
              </p>
            </div>

            {/* Image Upload Section */}
            <div className="space-y-2">
              <label htmlFor="image-upload" className="text-sm font-medium flex items-center gap-2">
                <ImageIcon className="h-4 w-4" />
                Upload Screenshot (Optional)
              </label>
              {!submissionData.imagePreview ? (
                <div 
                  className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center"
                  role="region"
                  aria-labelledby="upload-instructions"
                >
                  <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                  <p id="upload-instructions" className="text-sm text-muted-foreground mb-2">
                    Drag & drop or click to upload
                  </p>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                    aria-describedby="image-help"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => document.getElementById('image-upload')?.click()}
                    aria-label="Select image file"
                  >
                    Select Image
                  </Button>
                </div>
              ) : (
                <div className="relative">
                  <img
                    src={submissionData.imagePreview}
                    alt="Preview of uploaded screenshot"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 h-8 w-8"
                    onClick={removeImage}
                    aria-label="Remove uploaded image"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
              <p id="image-help" className="text-xs text-muted-foreground">
                Upload a screenshot of your completed task (max 5MB)
              </p>
            </div>

            <div className="space-y-2">
              <label htmlFor="additional-notes" className="text-sm font-medium flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Additional Notes (Optional)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 pt-3 flex items-center pointer-events-none" aria-hidden="true">
                  <FaClipboardList className="h-4 w-4 text-muted-foreground" />
                </div>
                <Textarea
                  id="additional-notes"
                  placeholder="Any additional information or comments..."
                  value={submissionData.additional_notes}
                  onChange={(e) => setSubmissionData({...submissionData, additional_notes: e.target.value})}
                  className="pl-10"
                  aria-describedby="notes-help"
                />
              </div>
              <p id="notes-help" className="text-xs text-muted-foreground">
                Share any additional details about your task completion
              </p>
            </div>

            <Button 
              onClick={handleSubmit}
              disabled={submitting || !submissionData.proof}
              className="w-full"
            >
              {submitting ? "Submitting..." : "Submit Task"}
            </Button>
          </CardContent>
        </Card>
      </div>
      {/* Spacer for bottom navigation on mobile */}
      <div className="h-16 md:hidden -mt-8"></div>
    </div>
  )
}

export default function TaskCompletionPage() {
  return (
    <AuthProtected>
      <TaskCompletionContent />
    </AuthProtected>
  )
}
