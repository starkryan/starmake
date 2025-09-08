'use client';

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

// Zod schema for salary code generation
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

interface User {
  id: string;
  email: string;
  role: string;
  created_at: string;
}

function AdminDashboardContent() {
  const [salaryCodes, setSalaryCodes] = useState<SalaryCode[]>([]);
  const [redeemRequests, setRedeemRequests] = useState<RedeemRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const form = useForm<z.infer<typeof salaryCodeSchema>>({
    resolver: zodResolver(salaryCodeSchema),
    defaultValues: {
      name: '',
      phone: '',
      task: '',
      price: ''
    }
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch salary codes
      const { data: codesData, error: codesError } = await supabase
        .from('salary_codes')
        .select('*')
        .order('created_at', { ascending: false });

      if (codesError) throw codesError;

      // Fetch redeem requests with salary code details
      const { data: requestsData, error: requestsError } = await supabase
        .from('redeem_requests')
        .select(`
          *,
          salary_codes (*)
        `)
        .order('created_at', { ascending: false });

      if (requestsError) throw requestsError;

      setSalaryCodes(codesData || []);
      setRedeemRequests(requestsData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateAlphanumericCode = (length = 9) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const generateSalaryCode = async (values: z.infer<typeof salaryCodeSchema>) => {
    try {
      // Call the API endpoint instead of direct database access
      const response = await fetch('/api/admin/generate-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to generate salary code');
      }

      form.reset();
      fetchData(); // Refresh data
      
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
        .update({ 
          status: 'approved',
          approved_at: new Date().toISOString()
        })
        .eq('id', requestId);

      if (error) throw error;

      fetchData(); // Refresh data
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
        .update({ 
          status: 'rejected',
          rejected_at: new Date().toISOString()
        })
        .eq('id', requestId);

      if (error) throw error;

      fetchData(); // Refresh data
      toast.success('Request rejected successfully');
    } catch (error) {
      console.error('Error rejecting request:', error);
      toast.error('Error rejecting request');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 pb-20 md:pb-6 space-y-6">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <BarChart3 className="h-8 w-8 text-primary" />
          <h1 className="text-2xl md:text-3xl font-bold">Admin Dashboard</h1>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline" className="gap-2">
            <a href="/admin/users">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Manage Users</span>
            </a>
          </Button>
          <Button asChild variant="outline" className="gap-2">
            <a href="/admin/tasks">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Tasks</span>
            </a>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full max-w-md md:w-[400px]">
          <TabsTrigger value="overview" className="gap-2 text-xs md:text-sm">
            <BarChart3 className="h-3 w-3 md:h-4 md:w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="codes" className="gap-2 text-xs md:text-sm">
            <CreditCard className="h-3 w-3 md:h-4 md:w-4" />
            Codes
          </TabsTrigger>
          <TabsTrigger value="requests" className="gap-2 text-xs md:text-sm">
            <FileText className="h-3 w-3 md:h-4 md:w-4" />
            Requests
          </TabsTrigger>
          <TabsTrigger value="generate" className="gap-2 text-xs md:text-sm">
            <PlusCircle className="h-3 w-3 md:h-4 md:w-4" />
            Generate
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">6</div>
                <p className="text-xs text-muted-foreground">Registered users</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Salary Codes</CardTitle>
                <CreditCard className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{salaryCodes.length}</div>
                <p className="text-xs text-muted-foreground">Generated codes</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950 dark:to-amber-900">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
                <FileText className="h-4 w-4 text-amber-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {redeemRequests.filter(r => r.status === 'pending').length}
                </div>
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
              <div className="overflow-x-auto">
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
                          <Badge variant={
                            code.status === 'active' ? 'default' :
                            code.status === 'redeemed' ? 'secondary' : 'outline'
                          }>
                            {code.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {new Date(code.created_at).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
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
              <div className="overflow-x-auto">
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
                        <TableCell className="font-mono text-sm">
                          {request.salary_codes?.[0]?.code}
                        </TableCell>
                        <TableCell>
                          <Badge variant={
                            request.status === 'pending' ? 'secondary' :
                            request.status === 'approved' ? 'default' : 'destructive'
                          }>
                            {request.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {request.status === 'pending' && (
                            <div className="flex flex-col sm:flex-row gap-2">
                              <Button
                                size="sm"
                                onClick={() => handleApproveRequest(request.id)}
                                className="gap-1"
                              >
                                <CheckCircle className="h-3 w-3" />
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleRejectRequest(request.id)}
                                className="gap-1"
                              >
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
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="generate">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PlusCircle className="h-5 w-5" />
                Generate Salary Code
              </CardTitle>
              <CardDescription>Create a new 9-digit salary code for tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(generateSalaryCode)} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone</FormLabel>
                          <FormControl>
                            <Input type="tel" placeholder="Enter phone number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="task"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Task Description</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Describe the task" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
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
                  <Button type="submit" className="gap-2">
                    <PlusCircle className="h-4 w-4" />
                    Generate Salary Code
                  </Button>
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
