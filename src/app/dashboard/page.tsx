'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, X, ArrowRight } from "lucide-react";
import { FaClipboardList, FaCheckCircle, FaQuestionCircle, FaEnvelope, FaPhone, FaPlus } from "react-icons/fa";
import { authClient } from '@/lib/auth-client';
import AuthProtected from '@/components/auth/auth-protected';
import { toast } from 'sonner';
import { Spinner } from '@/components/ui/spinner';
import { useRedeemRequests } from '@/hooks/use-redeem-requests';
import { useTaskSubmissions } from '@/hooks/tasks/use-task-submissions';
import { RedeemRequest, TaskSubmission } from '@/types';
import { supabase } from '@/lib/supabase';

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

function UserDashboardContent() {
  const [userEmail, setUserEmail] = useState('');
  const [userId, setUserId] = useState<string | null>(null);
  const [isRedeemModalOpen, setIsRedeemModalOpen] = useState(false);
  const [redeemForm, setRedeemForm] = useState({
    salaryCode: '',
    upiId: '',
    userName: '',
    userPhone: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [tasksLoading, setTasksLoading] = useState(true);

  const { redeemRequests, loading: redeemLoading, error: redeemError, refetch: refetchRedeem } = useRedeemRequests(userId);
  const { taskSubmissions, loading: taskLoading, error: taskError, refetch: refetchTasks } = useTaskSubmissions(userId);

  const loading = redeemLoading || taskLoading || tasksLoading;

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const session = await authClient.getSession();
        if (session?.data?.user) {
          setUserEmail(session.data.user.email);
          setUserId(session.data.user.id);
        }
      } catch (error) {
        console.error('Error fetching session:', error);
      }
    };
    fetchSession();
  }, []);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const { data, error } = await supabase
          .from("tasks")
          .select("*")
          .eq("status", "active")
          .order("created_at", { ascending: false })
          .limit(3); // Show only 3 tasks in dashboard

        if (error) throw error;
        setTasks(data || []);
      } catch (error) {
        console.error("Error fetching tasks:", error);
        toast.error("Failed to fetch tasks");
      } finally {
        setTasksLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>;
      case 'approved':
        return <Badge variant="default">Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

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
  };

  const handleRedeemSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const response = await fetch('/api/user/redeem-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(redeemForm),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to redeem salary code');
      }

      // Show success toast and confetti
      toast.success('Redemption request submitted successfully! 🎉');
      
      // Trigger confetti effect
      const confetti = await import('canvas-confetti');
      confetti.default({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });

      // After successful submission, close modal and refresh requests
      setIsRedeemModalOpen(false);
      setRedeemForm({ salaryCode: '', upiId: '', userName: '', userPhone: '' });
      await refetchRedeem();
    } catch (error) {
      console.error('Error redeeming code:', error);
      toast.error(error instanceof Error ? error.message : 'Error redeeming code');
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRedeemForm(prev => ({ ...prev, [name]: value }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 pb-20 md:pb-6 space-y-8">
      

        {/* Stats Overview */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-2 lg:grid-cols-4 md:gap-6">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 p-4 md:p-6">
            <CardHeader className="pb-2 p-0">
              <CardTitle className="text-xs md:text-sm font-medium text-blue-600 dark:text-blue-400">
                Total Redemptions
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 pt-2">
              <div className="text-xl md:text-3xl font-bold">{redeemRequests.length}</div>
              <p className="text-[10px] md:text-xs text-muted-foreground">Salary code redemptions</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 p-4 md:p-6">
            <CardHeader className="pb-2 p-0">
              <CardTitle className="text-xs md:text-sm font-medium text-green-600 dark:text-green-400">
                Approved Redemptions
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 pt-2">
              <div className="text-xl md:text-3xl font-bold">
                {redeemRequests.filter(r => r.status === 'approved').length}
              </div>
              <p className="text-[10px] md:text-xs text-muted-foreground">Successful redemptions</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 p-4 md:p-6">
            <CardHeader className="pb-2 p-0">
              <CardTitle className="text-xs md:text-sm font-medium text-purple-600 dark:text-purple-400">
                Task Submissions
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 pt-2">
              <div className="text-xl md:text-3xl font-bold">{taskSubmissions.length}</div>
              <p className="text-[10px] md:text-xs text-muted-foreground">Completed tasks</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950 dark:to-amber-900 p-4 md:p-6">
            <CardHeader className="pb-2 p-0">
              <CardTitle className="text-xs md:text-sm font-medium text-amber-600 dark:text-amber-400">
                Pending Tasks
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 pt-2">
              <div className="text-xl md:text-3xl font-bold">
                {taskSubmissions.filter(t => t.status === 'pending').length}
              </div>
              <p className="text-[10px] md:text-xs text-muted-foreground">Awaiting approval</p>
            </CardContent>
          </Card>
        </div>

        {/* Available Tasks */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Available Tasks</CardTitle>
              <CardDescription>Complete tasks to earn salary codes</CardDescription>
            </div>
            <Button asChild variant="outline">
              <Link href="/tasks">
                View All Tasks
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {tasks.length === 0 ? (
              <div className="text-center py-12 space-y-4">
                <div className="text-muted-foreground">
                  <FaClipboardList className="mx-auto h-12 w-12" />
                </div>
                <h3 className="text-lg font-medium">No tasks available</h3>
                <p className="text-sm text-muted-foreground">
                  Check back later for new tasks to complete.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {tasks.map((task) => (
                  <div key={task.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex-1">
                      <h4 className="font-medium">{task.title}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline">{getTaskTypeBadge(task.task_type)}</Badge>
                        {task.is_free ? (
                          <Badge variant="secondary">Free</Badge>
                        ) : (
                          <Badge variant="default">₹{task.price}</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                        {task.description}
                      </p>
                    </div>
                    <Button asChild size="sm" className="ml-4">
                      <Link href={`/tasks/${task.id}`}>Start</Link>
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Redemption Requests */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Redemption Requests</CardTitle>
              <CardDescription>Track the status of your salary code redemption requests</CardDescription>
            </div>
            <Dialog open={isRedeemModalOpen} onOpenChange={setIsRedeemModalOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Redeem New Code
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Redeem Salary Code</DialogTitle>
                  <DialogDescription>
                    Enter your salary code details to redeem it.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleRedeemSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="salaryCode">Salary Code</Label>
                    <Input
                      id="salaryCode"
                      name="salaryCode"
                      value={redeemForm.salaryCode}
                      onChange={handleInputChange}
                      placeholder="Enter salary code"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="upiId">UPI ID</Label>
                    <Input
                      id="upiId"
                      name="upiId"
                      value={redeemForm.upiId}
                      onChange={handleInputChange}
                      placeholder="Enter your UPI ID"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="userName">Full Name</Label>
                    <Input
                      id="userName"
                      name="userName"
                      value={redeemForm.userName}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="userPhone">Phone Number</Label>
                    <Input
                      id="userPhone"
                      name="userPhone"
                      value={redeemForm.userPhone}
                      onChange={handleInputChange}
                      placeholder="Enter your phone number"
                      required
                    />
                  </div>
                  <div className="flex justify-end gap-3 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsRedeemModalOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={submitting}>
                      {submitting ? "Submitting..." : "Redeem Code"}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            {redeemRequests.length === 0 ? (
              <div className="text-center py-12 space-y-4">
                <div className="text-muted-foreground">
                  <Plus className="mx-auto h-12 w-12" />
                </div>
                <h3 className="text-lg font-medium">No redemption requests</h3>
                <p className="text-sm text-muted-foreground">
                  Get started by redeeming your first salary code.
                </p>
                <Dialog open={isRedeemModalOpen} onOpenChange={setIsRedeemModalOpen}>
                  <DialogTrigger asChild>
                    <Button className="mt-4">
                      <FaPlus className="w-4 h-4 mr-2" />
                      Redeem Now
                    </Button>
                  </DialogTrigger>
                </Dialog>
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Salary Code</TableHead>
                      <TableHead>Task</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>UPI ID</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Submitted</TableHead>
                      <TableHead>Last Update</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {redeemRequests.map((request) => {
                      // Handle both array and object formats for salary_codes
                      let salaryCode;
                      if (Array.isArray(request.salary_codes)) {
                        salaryCode = request.salary_codes[0];
                      } else {
                        salaryCode = request.salary_codes;
                      }
                      
                      return (
                        <TableRow key={request.id} className="hover:bg-muted/50">
                          <TableCell className="font-mono text-sm">{salaryCode?.code || '-'}</TableCell>
                          <TableCell className="max-w-xs truncate">{salaryCode?.task || '-'}</TableCell>
                          <TableCell className="font-medium">{salaryCode?.price ? `₹${salaryCode.price}` : '-'}</TableCell>
                          <TableCell className="max-w-xs truncate text-muted-foreground">{request.upi_id || '-'}</TableCell>
                          <TableCell>
                            {getStatusBadge(request.status)}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {new Date(request.created_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {request.approved_at && new Date(request.approved_at).toLocaleDateString()}
                            {request.rejected_at && new Date(request.rejected_at).toLocaleDateString()}
                            {!request.approved_at && !request.rejected_at && '-'}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Task Submissions */}
        <Card>
          <CardHeader>
            <CardTitle>Task Submissions</CardTitle>
            <CardDescription>Track the status of your completed tasks</CardDescription>
          </CardHeader>
          <CardContent>
            {taskSubmissions.length === 0 ? (
              <div className="text-center py-12 space-y-4">
                <div className="text-muted-foreground">
                  <FaCheckCircle className="mx-auto h-12 w-12" />
                </div>
                <h3 className="text-lg font-medium">No task submissions</h3>
                <p className="text-sm text-muted-foreground">
                  Complete tasks to see your submissions here.
                </p>
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Task</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Proof</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Submitted</TableHead>
                      <TableHead>Last Update</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {taskSubmissions.map((submission) => {
                      // Handle both array and object formats for tasks
                      let task;
                      if (Array.isArray(submission.tasks)) {
                        task = submission.tasks[0];
                      } else {
                        task = submission.tasks;
                      }
                      
                      return (
                        <TableRow key={submission.id} className="hover:bg-muted/50">
                          <TableCell className="font-medium">{task?.title || 'Unknown Task'}</TableCell>
                          <TableCell className="capitalize">{task?.task_type || '-'}</TableCell>
                          <TableCell className="max-w-xs truncate text-muted-foreground">
                            {submission.submission_proof?.proof || 'No proof provided'}
                          </TableCell>
                          <TableCell>
                            {getStatusBadge(submission.status)}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {new Date(submission.created_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {submission.approved_at && new Date(submission.approved_at).toLocaleDateString()}
                            {submission.rejected_at && new Date(submission.rejected_at).toLocaleDateString()}
                            {!submission.approved_at && !submission.rejected_at && '-'}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FaCheckCircle className="h-5 w-5" />
                Redeem New Code
              </CardTitle>
              <CardDescription>Have a new salary code to redeem?</CardDescription>
            </CardHeader>
            <CardContent>
              <Dialog open={isRedeemModalOpen} onOpenChange={setIsRedeemModalOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full" size="lg">
                    <FaCheckCircle className="w-4 h-4 mr-2" />
                    Redeem Now
                  </Button>
                </DialogTrigger>
              </Dialog>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FaQuestionCircle className="h-5 w-5" />
                Need Help?
              </CardTitle>
              <CardDescription>Contact support if you have issues</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <FaEnvelope className="h-4 w-4" />
                <span>support@salarywork.com</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <FaPhone className="h-4 w-4" />
                <span>+91-XXXXX-XXXXX</span>
              </div>
            </CardContent>
          </Card>
        </div>
        {/* Spacer for bottom navigation on mobile */}
        <div className="h-16 md:hidden -mt-8"></div>
      </div>
    </div>
  );
}

export default function UserDashboard() {
  return (
    <AuthProtected>
      <UserDashboardContent />
    </AuthProtected>
  );
}
