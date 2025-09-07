"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"
import AuthProtected from "@/components/auth/auth-protected"
import { Spinner } from "@/components/ui/spinner"
import { Check, X, Eye } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface TaskSubmission {
  id: string
  task_id: string
  user_id: string
  submission_proof: {
    proof: string
    additional_notes: string
    image_url?: string
    submitted_at: string
  }
  status: string
  created_at: string
  tasks?: {
    title: string
    task_type: string
    price: number
    is_free: boolean
  }
  user?: {
    email: string
  }
}

function AdminSubmissionsContent() {
  const [submissions, setSubmissions] = useState<TaskSubmission[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedSubmission, setSelectedSubmission] = useState<TaskSubmission | null>(null)

  useEffect(() => {
    fetchSubmissions()
  }, [])

  const fetchSubmissions = async () => {
    try {
      const { data, error } = await supabase
        .from("task_submissions")
        .select(`
          *,
          tasks (*),
          user:user_id (email)
        `)
        .order("created_at", { ascending: false })

      if (error) throw error
      setSubmissions(data || [])
    } catch (error) {
      console.error("Error fetching submissions:", error)
      toast.error("Failed to fetch submissions")
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (submissionId: string) => {
    try {
      const { error } = await supabase
        .from("task_submissions")
        .update({ status: "approved" })
        .eq("id", submissionId)

      if (error) throw error

      toast.success("Submission approved successfully")
      fetchSubmissions()
    } catch (error) {
      console.error("Error approving submission:", error)
      toast.error("Failed to approve submission")
    }
  }

  const handleReject = async (submissionId: string) => {
    try {
      const { error } = await supabase
        .from("task_submissions")
        .update({ status: "rejected" })
        .eq("id", submissionId)

      if (error) throw error

      toast.success("Submission rejected successfully")
      fetchSubmissions()
    } catch (error) {
      console.error("Error rejecting submission:", error)
      toast.error("Failed to reject submission")
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="secondary">Pending Review</Badge>
      case "approved":
        return <Badge variant="default">Approved</Badge>
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>
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
        <h1 className="text-3xl font-bold">Task Submissions</h1>
        <Button onClick={fetchSubmissions} variant="outline">
          Refresh
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Submissions</CardTitle>
          <CardDescription>Review and manage task submissions from users</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Task</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Proof</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {submissions.map((submission) => (
                <TableRow key={submission.id}>
                  <TableCell className="font-medium">{submission.user?.email}</TableCell>
                  <TableCell>{submission.tasks?.title}</TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {submission.tasks?.task_type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedSubmission(submission)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Proof
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[600px]">
                        <DialogHeader>
                          <DialogTitle>Submission Details</DialogTitle>
                          <DialogDescription>
                            Review the proof submitted by the user
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-semibold">Proof:</h4>
                            <p className="text-muted-foreground">
                              {submission.submission_proof.proof}
                            </p>
                          </div>
                          {submission.submission_proof.additional_notes && (
                            <div>
                              <h4 className="font-semibold">Additional Notes:</h4>
                              <p className="text-muted-foreground">
                                {submission.submission_proof.additional_notes}
                              </p>
                            </div>
                          )}
                          {submission.submission_proof.image_url && (
                            <div>
                              <h4 className="font-semibold">Screenshot:</h4>
                              <img
                                src={submission.submission_proof.image_url}
                                alt="Submission proof"
                                className="w-full h-48 object-contain rounded-lg border"
                              />
                            </div>
                          )}
                        </div>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                  <TableCell>{getStatusBadge(submission.status)}</TableCell>
                  <TableCell>
                    {new Date(submission.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {submission.status === "pending" && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleApprove(submission.id)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <Check className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleReject(submission.id)}
                        >
                          <X className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {submissions.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium">No submissions yet</h3>
          <p className="text-muted-foreground">
            Users haven't submitted any tasks for review yet.
          </p>
        </div>
      )}
    </div>
  )
}

export default function AdminSubmissionsPage() {
  return (
    <AuthProtected requireAdmin={true}>
      <AdminSubmissionsContent />
    </AuthProtected>
  )
}
