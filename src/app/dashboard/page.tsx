"use client"

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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, X, ArrowRight } from 'lucide-react';
import { FaClipboardList, FaCheckCircle, FaQuestionCircle, FaEnvelope, FaPhone, FaPlus } from 'react-icons/fa';
import { authClient } from '@/lib/auth-client';
import AuthProtected from '@/components/auth/auth-protected';
import { toast } from 'sonner';
import { Spinner } from '@/components/ui/spinner';
import { useRedeemRequests } from '@/hooks/use-redeem-requests';
import { useTaskSubmissions } from '@/hooks/tasks/use-task-submissions';
import { RedeemRequest, TaskSubmission } from '@/types';
import { supabase } from '@/lib/supabase';

interface Task {
  id: string;
  title: string;
  description: string;
  task_type: string;
  price: number;
  is_free: boolean;
  mb_limit: number | null;
  requirements: any;
  status: string;
}

function formatDate(input?: string) {
  if (!input) return '-';
  try { return new Date(input).toLocaleDateString(); } catch { return input as string; }
}

export default function UserDashboard() {
  return (
    <AuthProtected>
      <UserDashboardContent />
    </AuthProtected>
  )
}

function UserDashboardContent() {
  const [userEmail, setUserEmail] = useState('');
  const [userId, setUserId] = useState<string | null>(null);
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
          .from('tasks')
          .select('*')
          .eq('status', 'active')
          .order('created_at', { ascending: false })
          .limit(3);
        if (error) throw error;
        setTasks(data || []);
      } catch (error) {
        console.error('Error fetching tasks:', error);
        toast.error('Failed to fetch tasks');
      } finally {
        setTasksLoading(false);
      }
    };
    fetchTasks();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending': return <Badge variant='secondary'>Pending</Badge>;
      case 'approved': return <Badge variant='default'>Approved</Badge>;
      case 'rejected': return <Badge variant='destructive'>Rejected</Badge>;
      default: return <Badge variant='outline'>{status}</Badge>;
    }
  };

  const getTaskTypeBadge = (taskType: string) => {
    const typeMap: Record<string, string> = { instagram: 'Instagram', youtube: 'YouTube', video: 'Video', content: 'Content', survey: 'Survey', app_test: 'App Test', other: 'Other' };
    return typeMap[taskType] || taskType;
  };


  if (loading) return (<div className='min-h-screen flex items-center justify-center'><Spinner className='h-8 w-8' /></div>);

  return (
    <div className='min-h-screen bg-background'>
      <div className='max-w-6xl mx-auto p-4 sm:p-6 pb-24 space-y-8'>

        {/* Header */}
        <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4'>
          <div>
            <h1 className='text-2xl sm:text-3xl font-bold'>Welcome{userEmail ? `, ${userEmail.split('@')[0]}` : ''}</h1>
            <p className='text-sm text-muted-foreground mt-1'>Your dashboard — track redemptions & tasks</p>
          </div>
          <div className='flex gap-2 w-full sm:w-auto'>
            <Button asChild variant='outline' className='w-full sm:w-auto'>
              <Link href='/tasks'>View All Tasks <ArrowRight className='w-4 h-4 ml-2' /></Link>
            </Button>
            <Button asChild className='w-full sm:w-auto'>
              <Link href="/redeem">
                <FaPlus className='w-4 h-4 mr-2' />
                Redeem Code
              </Link>
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className='grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6'>
          <Card className='p-4 md:p-6'>
            <CardHeader className='pb-2 p-0'><CardTitle className='text-xs md:text-sm font-medium text-blue-600'>Total Redemptions</CardTitle></CardHeader>
            <CardContent className='p-0 pt-2'><div className='text-xl md:text-3xl font-bold'>{redeemRequests.length}</div><p className='text-[10px] md:text-xs text-muted-foreground'>Salary code redemptions</p></CardContent>
          </Card>

          <Card className='p-4 md:p-6'>
            <CardHeader className='pb-2 p-0'><CardTitle className='text-xs md:text-sm font-medium text-green-600'>Approved Redemptions</CardTitle></CardHeader>
            <CardContent className='p-0 pt-2'><div className='text-xl md:text-3xl font-bold'>{redeemRequests.filter(r => r.status === 'approved').length}</div><p className='text-[10px] md:text-xs text-muted-foreground'>Successful redemptions</p></CardContent>
          </Card>

          <Card className='p-4 md:p-6'>
            <CardHeader className='pb-2 p-0'><CardTitle className='text-xs md:text-sm font-medium text-purple-600'>Task Submissions</CardTitle></CardHeader>
            <CardContent className='p-0 pt-2'><div className='text-xl md:text-3xl font-bold'>{taskSubmissions.length}</div><p className='text-[10px] md:text-xs text-muted-foreground'>Completed tasks</p></CardContent>
          </Card>

          <Card className='p-4 md:p-6'>
            <CardHeader className='pb-2 p-0'><CardTitle className='text-xs md:text-sm font-medium text-amber-600'>Pending Tasks</CardTitle></CardHeader>
            <CardContent className='p-0 pt-2'><div className='text-xl md:text-3xl font-bold'>{taskSubmissions.filter(t => t.status === 'pending').length}</div><p className='text-[10px] md:text-xs text-muted-foreground'>Awaiting approval</p></CardContent>
          </Card>
        </div>

        {/* Available Tasks */}
        <Card>
          <CardHeader className='flex flex-row items-center justify-between'>
            <div><CardTitle>Available Tasks</CardTitle><CardDescription>Complete tasks to earn salary codes</CardDescription></div>
            <Button asChild variant='outline'><Link href='/tasks'>View All Tasks <ArrowRight className='w-4 h-4 ml-2' /></Link></Button>
          </CardHeader>
          <CardContent>
            {tasks.length === 0 ? (
              <div className='text-center py-12 space-y-4'>
                <div className='text-muted-foreground'><FaClipboardList className='mx-auto h-12 w-12' /></div>
                <h3 className='text-lg font-medium'>No tasks available</h3>
                <p className='text-sm text-muted-foreground'>Check back later for new tasks to complete.</p>
              </div>
            ) : (
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                {tasks.map((task) => (
                  <div key={task.id} className='flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors'>
                    <div className='flex-1'>
                      <h4 className='font-medium'>{task.title}</h4>
                      <div className='flex items-center gap-2 mt-1'>
                        <Badge variant='outline'>{getTaskTypeBadge(task.task_type)}</Badge>
                        {task.is_free ? <Badge variant='secondary'>Free</Badge> : <Badge variant='default'>₹{task.price}</Badge>}
                      </div>
                      <p className='text-sm text-muted-foreground mt-2 line-clamp-3'>{task.description}</p>
                    </div>
                    <div className='mt-3 sm:mt-0 sm:ml-4'>
                      <Button asChild size='sm' className='w-full sm:w-auto'>
                        <Link href={`/tasks/${task.id}`}>Start</Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Redemption Requests */}
        <Card>
          <CardHeader className='flex flex-row items-center justify-between'>
            <div><CardTitle>Redemption Requests</CardTitle><CardDescription>Track the status of your salary code redemption requests</CardDescription></div>
            <Button asChild>
              <Link href="/redeem"><Plus className='w-4 h-4 mr-2' /> Redeem New Code</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {/* Desktop table */}
            <div className='hidden md:block rounded-md border'>
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
                    let salaryCode = Array.isArray(request.salary_codes) ? request.salary_codes[0] : request.salary_codes;
                    return (
                      <TableRow key={request.id} className='hover:bg-muted/50'>
                        <TableCell className='font-mono text-sm'>{salaryCode?.code || '-'}</TableCell>
                        <TableCell className='max-w-xs truncate'>{salaryCode?.task || '-'}</TableCell>
                        <TableCell className='font-medium'>{salaryCode?.price ? `₹${salaryCode.price}` : '-'}</TableCell>
                        <TableCell className='max-w-xs truncate text-muted-foreground'>{request.upi_id || '-'}</TableCell>
                        <TableCell>{getStatusBadge(request.status)}</TableCell>
                        <TableCell className='text-sm text-muted-foreground'>{formatDate(request.created_at)}</TableCell>
                        <TableCell className='text-sm text-muted-foreground'>{request.approved_at ? formatDate(request.approved_at) : request.rejected_at ? formatDate(request.rejected_at) : '-'}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>

            {/* Mobile list */}
            <div className='md:hidden space-y-3'>
              {redeemRequests.map((request) => {
                let salaryCode = Array.isArray(request.salary_codes) ? request.salary_codes[0] : request.salary_codes;
                return (
                  <div key={request.id} className='border rounded-lg p-3 bg-card/40'>
                    <div className='flex items-start justify-between gap-3'>
                      <div>
                        <div className='font-mono font-medium'>{salaryCode?.code || '-'}</div>
                        <div className='text-sm text-muted-foreground truncate max-w-[220px]'>{salaryCode?.task || '-'}</div>
                        <div className='text-xs text-muted-foreground mt-1'>{formatDate(request.created_at)}</div>
                      </div>
                      <div className='text-right'>
                        <div className='font-medium'>{salaryCode?.price ? `₹${salaryCode.price}` : '-'}</div>
                        <div className='mt-1'>{getStatusBadge(request.status)}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Task Submissions */}
        <Card>
          <CardHeader>
            <CardTitle>Task Submissions</CardTitle>
            <CardDescription>Track the status of your completed tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='hidden md:block rounded-md border'>
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
                    let task = Array.isArray(submission.tasks) ? submission.tasks[0] : submission.tasks;
                    return (
                      <TableRow key={submission.id} className='hover:bg-muted/50'>
                        <TableCell className='font-medium'>{task?.title || 'Unknown Task'}</TableCell>
                        <TableCell className='capitalize'>{task?.task_type || '-'}</TableCell>
                        <TableCell className='max-w-xs truncate text-muted-foreground'>{submission.submission_proof?.proof || 'No proof provided'}</TableCell>
                        <TableCell>{getStatusBadge(submission.status)}</TableCell>
                        <TableCell className='text-sm text-muted-foreground'>{formatDate(submission.created_at)}</TableCell>
                        <TableCell className='text-sm text-muted-foreground'>{submission.approved_at ? formatDate(submission.approved_at) : submission.rejected_at ? formatDate(submission.rejected_at) : '-'}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>

            {/* Mobile cards */}
            <div className='md:hidden space-y-3'>
              {taskSubmissions.map((submission) => {
                let task = Array.isArray(submission.tasks) ? submission.tasks[0] : submission.tasks;
                return (
                  <div key={submission.id} className='border rounded-lg p-3 bg-card/40'>
                    <div className='flex items-start justify-between gap-3'>
                      <div className='flex-1'>
                        <div className='font-medium'>{task?.title || 'Unknown Task'}</div>
                        <div className='text-xs text-muted-foreground truncate max-w-[220px]'>{submission.submission_proof?.proof || 'No proof provided'}</div>
                        <div className='text-xs text-muted-foreground mt-1'>{formatDate(submission.created_at)}</div>
                      </div>
                      <div className='text-right'>
                        <div>{getStatusBadge(submission.status)}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>



        <div className='h-16 md:hidden -mt-8' />
      </div>
    </div>
  );
}
