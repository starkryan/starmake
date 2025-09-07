'use client';

import { useState, useEffect } from 'react';
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
import { Plus, X } from "lucide-react";
import { supabase } from '@/lib/supabase';
import { authClient } from '@/lib/auth-client';
import AuthProtected from '@/components/auth-protected';
import { toast } from 'sonner';
import { Spinner } from '@/components/ui/spinner';

interface RedeemRequest {
  id: string;
  salary_code_id: string;
  user_name: string;
  user_phone: string;
  upi_id: string;
  status: string;
  created_at: string;
  approved_at: string | null;
  rejected_at: string | null;
  salary_codes?: {
    code: string;
    task: string;
    price: number;
  }[];
}

function UserDashboardContent() {
  const [redeemRequests, setRedeemRequests] = useState<RedeemRequest[]>([]);
  const [loading, setLoading] = useState(true);
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

  useEffect(() => {
    // Fetch session first to get user ID
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
    if (userId) {
      fetchUserRequests();
    }
  }, [userId]);

  const fetchUserRequests = async () => {
    try {
      if (!userId) {
        setRedeemRequests([]);
        setLoading(false);
        return;
      }

      // Filter requests by the logged-in user's ID
      const { data, error } = await supabase
        .from('redeem_requests')
        .select(`
          *,
          salary_codes!inner (code, task, price)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRedeemRequests(data || []);
    } catch (error) {
      console.error('Error fetching redemption requests:', error);
    } finally {
      setLoading(false);
    }
  };

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
      await fetchUserRequests();
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
      <div className="container mx-auto p-6 space-y-8">
        {/* Header Section */}
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-bold tracking-tight">Dashboard</h1>
          {userEmail && (
            <p className="text-muted-foreground">
              Welcome back, <span className="font-medium text-foreground">{userEmail}</span>
            </p>
          )}
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-blue-600 dark:text-blue-400">
                Total Requests
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{redeemRequests.length}</div>
              <p className="text-xs text-muted-foreground">All time redemption requests</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-green-600 dark:text-green-400">
                Approved
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {redeemRequests.filter(r => r.status === 'approved').length}
              </div>
              <p className="text-xs text-muted-foreground">Successful redemptions</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950 dark:to-amber-900">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-amber-600 dark:text-amber-400">
                Pending
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {redeemRequests.filter(r => r.status === 'pending').length}
              </div>
              <p className="text-xs text-muted-foreground">Awaiting approval</p>
            </CardContent>
          </Card>
        </div>

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
                      <Plus className="w-4 h-4 mr-2" />
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

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Redeem New Code
              </CardTitle>
              <CardDescription>Have a new salary code to redeem?</CardDescription>
            </CardHeader>
            <CardContent>
              <Dialog open={isRedeemModalOpen} onOpenChange={setIsRedeemModalOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full" size="lg">
                    <Plus className="w-4 h-4 mr-2" />
                    Redeem Now
                  </Button>
                </DialogTrigger>
              </Dialog>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Need Help?
              </CardTitle>
              <CardDescription>Contact support if you have issues</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>support@salarywork.com</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>+91-XXXXX-XXXXX</span>
              </div>
            </CardContent>
          </Card>
        </div>
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
