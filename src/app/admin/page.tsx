"use client";

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import AuthProtected from '@/components/auth/auth-protected';
import { Spinner } from '@/components/ui/spinner';
import { 
  Users, 
  CreditCard, 
  FileText, 
  Settings, 
  PlusCircle,
  CheckCircle,
  XCircle,
  ArrowLeft,
  BarChart3
} from 'lucide-react';

interface SalaryCode {
  id: string;
  code: string;
  name: string;
  phone: string;
  task: string;
  price: number;
  status: string;
  created_at: string;
  expires_at: string;
}

const salaryCodeSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits').regex(/^\d+$/, 'Phone number must contain only digits'),
  task: z.string().min(5, 'Task description must be at least 5 characters'),
  price: z.string().min(1, 'Price is required').regex(/^\d+(\.\d{1,2})?$/, 'Price must be a valid number')
});

interface RedeemRequest {
  id: string;
  salary_code_id: string;
  user_name: string;
  user_phone: string;
  upi_id: string;
  status: string;
  created_at: string;
  salary_codes?: SalaryCode[];
}

function formatDate(input?: string) {
  if (!input) return '-';
  try {
    return new Date(input).toLocaleDateString();
  } catch {
    return input;
  }
}

function AdminDashboardContent() {
  const [salaryCodes, setSalaryCodes] = useState<SalaryCode[]>([]);
  const [redeemRequests, setRedeemRequests] = useState<RedeemRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const form = useForm<z.infer<typeof salaryCodeSchema>>({
    resolver: zodResolver(salaryCodeSchema),
    defaultValues: { name: '', phone: '', task: '', price: '' }
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const { data: codesData, error: codesError } = await supabase
        .from('salary_codes')
        .select('*')
        .order('created_at', { ascending: false });

      if (codesError) throw codesError;

      const { data: requestsData, error: requestsError } = await supabase
        .from('redeem_requests')
        .select(`*, salary_codes (*)`)
        .order('created_at', { ascending: false });

      if (requestsError) throw requestsError;

      setSalaryCodes((codesData as SalaryCode[]) || []);
      setRedeemRequests((requestsData as RedeemRequest[]) || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to fetch admin data');
    } finally {
      setLoading(false);
    }
  };

  const generateSalaryCode = async (values: z.infer<typeof salaryCodeSchema>) => {
    try {
      const response = await fetch('/api/admin/generate-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Failed to generate salary code');
      form.reset();
      fetchData();
      toast.success(`Salary code generated: ${result.code}`);
    } catch (error) {
      console.error('Error generating salary code:', error);
      toast.error(error instanceof Error ? error.message : 'Error generating salary code');
    }
  };

  const handleApproveRequest = async (requestId: string) => {
    try {
      const { error } = await supabase
        .from('redeem_requests')
        .update({ status: 'approved', approved_at: new Date().toISOString() })
        .eq('id', requestId);
      if (error) throw error;
      fetchData();
      toast.success('Request approved successfully');
    } catch (error) {
      console.error('Error approving request:', error);
      toast.error('Error approving request');
    }
  };

  const handleRejectRequest = async (requestId: string) => {
    try {
      const { error } = await supabase
        .from('redeem_requests')
        .update({ status: 'rejected', rejected_at: new Date().toISOString() })
        .eq('id', requestId);
      if (error) throw error;
      fetchData();
      toast.success('Request rejected successfully');
    } catch (error) {
      console.error('Error rejecting request:', error);
      toast.error('Error rejecting request');
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Spinner className="h-8 w-8" />
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 pb-24 space-y-6">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <BarChart3 className="h-8 w-8 text-primary" />
          <h1 className="text-2xl md:text-3xl font-bold">Admin Dashboard</h1>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline" className="gap-2">
            <a href="/admin/users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Manage Users</span>
            </a>
          </Button>
          <Button asChild variant="outline" className="gap-2">
            <a href="/admin/tasks" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Tasks</span>
            </a>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="flex gap-2 overflow-x-auto pb-1">
          <TabsTrigger value="overview" className="flex items-center gap-2 whitespace-nowrap text-xs md:text-sm">
            <BarChart3 className="h-4 w-4" />
            <span>Overview</span>
          </TabsTrigger>
          <TabsTrigger value="codes" className="flex items-center gap-2 whitespace-nowrap text-xs md:text-sm">
            <CreditCard className="h-4 w-4" />
            <span>Codes</span>
          </TabsTrigger>
          <TabsTrigger value="requests" className="flex items-center gap-2 whitespace-nowrap text-xs md:text-sm">
            <FileText className="h-4 w-4" />
            <span>Requests</span>
          </TabsTrigger>
          <TabsTrigger value="generate" className="flex items-center gap-2 whitespace-nowrap text-xs md:text-sm">
            <PlusCircle className="h-4 w-4" />
            <span>Generate</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">6</div>
                <p className="text-xs text-muted-foreground">Registered users</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Salary Codes</CardTitle>
                <CreditCard className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{salaryCodes.length}</div>
                <p className="text-xs text-muted-foreground">Generated codes</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
                <FileText className="h-4 w-4 text-amber-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{redeemRequests.filter(r => r.status === 'pending').length}</div>
                <p className="text-xs text-muted-foreground">Awaiting approval</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="codes">
          <Card>
            <CardHeader>
              <CardTitle>Generated Salary Codes</CardTitle>
              <CardDescription>All salary codes created by the system</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Desktop table */}
              <div className="hidden md:block overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Code</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Task</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {salaryCodes.map((code) => (
                      <TableRow key={code.id}>
                        <TableCell className="font-mono font-medium text-sm">{code.code}</TableCell>
                        <TableCell className="text-sm">{code.name}</TableCell>
                        <TableCell className="text-sm">{code.phone}</TableCell>
                        <TableCell className="max-w-xs truncate text-sm">{code.task}</TableCell>
                        <TableCell className="font-medium text-sm">₹{code.price}</TableCell>
                        <TableCell>
                          <Badge variant={code.status === 'active' ? 'default' : code.status === 'redeemed' ? 'secondary' : 'outline'}>
                            {code.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">{formatDate(code.created_at)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile list */}
              <div className="md:hidden space-y-3">
                {salaryCodes.map(code => (
                  <div key={code.id} className="border rounded-lg p-3 bg-card/40">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="font-mono font-medium text-sm">{code.code}</div>
                        <div className="text-sm font-medium">{code.name}</div>
                        <div className="text-xs text-muted-foreground truncate max-w-[220px]">{code.task}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">₹{code.price}</div>
                        <div className="text-xs text-muted-foreground">{formatDate(code.created_at)}</div>
                        <div className="mt-1">
                          <Badge variant={code.status === 'active' ? 'default' : code.status === 'redeemed' ? 'secondary' : 'outline'}>
                            {code.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="requests">
          <Card>
            <CardHeader>
              <CardTitle>Redeem Requests</CardTitle>
              <CardDescription>Manage redemption requests from users</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="hidden md:block overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>UPI ID</TableHead>
                      <TableHead>Salary Code</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {redeemRequests.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell className="font-medium text-sm">{request.user_name}</TableCell>
                        <TableCell className="text-sm">{request.user_phone}</TableCell>
                        <TableCell className="max-w-xs truncate text-sm">{request.upi_id}</TableCell>
                        <TableCell className="font-mono text-sm">{request.salary_codes?.[0]?.code}</TableCell>
                        <TableCell>
                          <Badge variant={request.status === 'pending' ? 'secondary' : request.status === 'approved' ? 'default' : 'destructive'}>{request.status}</Badge>
                        </TableCell>
                        <TableCell>
                          {request.status === 'pending' && (
                            <div className="flex flex-col sm:flex-row gap-2">
                              <Button size="sm" onClick={() => handleApproveRequest(request.id)} className="gap-1">
                                <CheckCircle className="h-3 w-3" />
                                Approve
                              </Button>
                              <Button size="sm" variant="destructive" onClick={() => handleRejectRequest(request.id)} className="gap-1">
                                <XCircle className="h-3 w-3" />
                                Reject
                              </Button>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile cards */}
              <div className="md:hidden space-y-3">
                {redeemRequests.map(r => (
                  <div key={r.id} className="border rounded-lg p-3 bg-card/40">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-medium text-sm">{r.user_name}</div>
                        <div className="text-xs text-muted-foreground">{r.user_phone} • {formatDate(r.created_at)}</div>
                        <div className="mt-1 font-mono text-sm">{r.salary_codes?.[0]?.code}</div>
                        <div className="mt-1">
                          <Badge variant={r.status === 'pending' ? 'secondary' : r.status === 'approved' ? 'default' : 'destructive'}>
                            {r.status}
                          </Badge>
                        </div>
                        <div className="mt-2 text-xs text-muted-foreground truncate max-w-[240px]">{r.upi_id}</div>
                      </div>
                      <div className="flex flex-col gap-2">
                        {r.status === 'pending' && (
                          <>
                            <Button size="sm" onClick={() => handleApproveRequest(r.id)} className="gap-1">Approve</Button>
                            <Button size="sm" variant="destructive" onClick={() => handleRejectRequest(r.id)} className="gap-1">Reject</Button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="generate">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><PlusCircle className="h-5 w-5" /> Generate Salary Code</CardTitle>
              <CardDescription>Create a new 9-digit salary code for tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(generateSalaryCode)} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField control={form.control} name="name" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />

                    <FormField control={form.control} name="phone" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone</FormLabel>
                        <FormControl>
                          <Input type="tel" placeholder="Enter phone number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>

                  <FormField control={form.control} name="task" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Task Description</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Describe the task" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="price" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price (₹)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" placeholder="Enter price" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <div className="flex justify-end">
                    <Button type="submit" className="gap-2">
                      <PlusCircle className="h-4 w-4" />
                      Generate Salary Code
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <AuthProtected requireAdmin={true}>
      <AdminDashboardContent />
    </AuthProtected>
  );
}
