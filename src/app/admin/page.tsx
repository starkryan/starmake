'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import AuthProtected from '@/components/auth-protected';
import { Spinner } from '@/components/ui/spinner';

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
  salary_code?: SalaryCode;
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
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>

      {/* Generate Salary Code Form */}
      <Card>
        <CardHeader>
          <CardTitle>Generate Salary Code</CardTitle>
          <CardDescription>Create a new 9-digit salary code</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(generateSalaryCode)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
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
              <Button type="submit">Generate Salary Code</Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Redeem Requests */}
      <Card>
        <CardHeader>
          <CardTitle>Redeem Requests</CardTitle>
          <CardDescription>Pending redemption requests awaiting approval</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User Name</TableHead>
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
                  <TableCell>{request.user_name}</TableCell>
                  <TableCell>{request.user_phone}</TableCell>
                  <TableCell>{request.upi_id}</TableCell>
                  <TableCell>{request.salary_code?.code}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded text-xs ${
                      request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      request.status === 'approved' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {request.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    {request.status === 'pending' && (
                      <div className="space-x-2">
                        <Button
                          size="sm"
                          onClick={() => handleApproveRequest(request.id)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleRejectRequest(request.id)}
                        >
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

      {/* Generated Salary Codes */}
      <Card>
        <CardHeader>
          <CardTitle>Generated Salary Codes</CardTitle>
          <CardDescription>All salary codes created by the system</CardDescription>
        </CardHeader>
        <CardContent>
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
                  <TableCell className="font-mono">{code.code}</TableCell>
                  <TableCell>{code.name}</TableCell>
                  <TableCell>{code.phone}</TableCell>
                  <TableCell className="max-w-xs truncate">{code.task}</TableCell>
                  <TableCell>₹{code.price}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded text-xs ${
                      code.status === 'active' ? 'bg-green-100 text-green-800' :
                      code.status === 'redeemed' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {code.status}
                    </span>
                  </TableCell>
                  <TableCell>{new Date(code.created_at).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
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
