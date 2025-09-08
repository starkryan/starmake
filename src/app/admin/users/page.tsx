"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import AuthProtected from "@/components/auth/auth-protected";
import { Spinner } from "@/components/ui/spinner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Users,
  UserPlus,
  Trash2,
  ArrowLeft,
  Shield,
  Mail,
  Calendar,
  CheckCircle,
  XCircle,
} from "lucide-react";

interface User {
  id: string;
  name: string | null;
  email: string;
  emailVerified: boolean;
  role: string;
  createdAt: string;
  updatedAt: string;
}

function formatDate(input?: string) {
  if (!input) return "-";
  try {
    return new Date(input).toLocaleDateString();
  } catch {
    return input;
  }
}

function UsersManagementContent() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from("user")
        .select("*")
        .order("createdAt", { ascending: false });

      if (error) throw error;
      setUsers((data as User[]) || []);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (user: User) => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!userToDelete) return;

    setDeleting(true);
    try {
      const { error } = await supabase
        .from("user")
        .delete()
        .eq("id", userToDelete.id);

      if (error) throw error;

      toast.success("User deleted successfully");
      setDeleteDialogOpen(false);
      setUserToDelete(null);
      fetchUsers(); // Refresh the list
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Failed to delete user");
    } finally {
      setDeleting(false);
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
    <div className="max-w-6xl mx-auto p-4 sm:p-6 pb-24 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Users className="h-8 w-8 text-primary" />
          <h1 className="text-2xl sm:text-3xl font-bold">User Management</h1>
        </div>
        <Button asChild variant="outline" className="gap-2">
          <a href="/admin" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Back to Dashboard</span>
          </a>
        </Button>
      </div>

      {/* Tabs: make the tabs horizontally scrollable on small screens */}
      <Tabs defaultValue="all" className="space-y-6">
        <TabsList className="flex gap-2 overflow-x-auto pb-1">
          <TabsTrigger value="all" className="flex items-center gap-2 whitespace-nowrap">
            <Users className="h-4 w-4" />
            <span>All Users</span>
          </TabsTrigger>
          <TabsTrigger value="admins" className="flex items-center gap-2 whitespace-nowrap">
            <Shield className="h-4 w-4" />
            <span>Admins</span>
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2 whitespace-nowrap">
            <UserPlus className="h-4 w-4" />
            <span>Users</span>
          </TabsTrigger>
        </TabsList>

        {/* --------------------- ALL USERS --------------------- */}
        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                All Registered Users
              </CardTitle>
              <CardDescription>
                Manage all registered users and their permissions ({users.length} total)
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Desktop table */}
              <div className="hidden md:block overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Verification</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id} className="hover:bg-muted/50">
                        <TableCell className="font-medium">{user.name || <span className="text-muted-foreground">No Name</span>}</TableCell>
                        <TableCell className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-muted-foreground md:hidden" />
                          {user.email}
                        </TableCell>
                        <TableCell>
                          <Badge variant={user.role === "admin" ? "default" : "secondary"} className="gap-1">
                            {user.role === "admin" && <Shield className="h-3 w-3" />}
                            {user.role}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={user.emailVerified ? "default" : "secondary"} className="gap-1">
                            {user.emailVerified ? <CheckCircle className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                            {user.emailVerified ? "Verified" : "Unverified"}
                          </Badge>
                        </TableCell>
                        <TableCell className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4 md:hidden" />
                          {formatDate(user.createdAt)}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button size="sm" variant="destructive" onClick={() => handleDeleteClick(user)} disabled={user.role === "admin"} className="gap-1">
                            <Trash2 className="h-3 w-3" />
                            <span className="hidden md:inline">Delete</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile list view: cards for each user */}
              <div className="md:hidden space-y-3">
                {users.map((user) => (
                  <div key={user.id} className="border rounded-lg p-3 bg-card/60">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-muted-foreground/10 flex items-center justify-center text-sm font-semibold">
                              {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="font-medium text-sm">{user.name || <span className="text-muted-foreground">No Name</span>}</div>
                              <div className="text-xs text-muted-foreground truncate max-w-[220px]">{user.email}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-xs text-muted-foreground">{formatDate(user.createdAt)}</div>
                            <div className="mt-1">
                              <Badge variant={user.role === "admin" ? "default" : "secondary"} className="px-2 py-0.5">{user.role}</Badge>
                            </div>
                          </div>
                        </div>

                        <div className="mt-3 flex items-center gap-2">
                          <Badge variant={user.emailVerified ? "default" : "secondary"} className="gap-1">
                            {user.emailVerified ? <CheckCircle className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                            <span className="text-xs">{user.emailVerified ? "Verified" : "Unverified"}</span>
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center gap-2 justify-end">
                      <Button size="sm" variant="ghost" asChild>
                        <a href={`mailto:${user.email}`} className="flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          <span className="sr-only">Email</span>
                        </a>
                      </Button>

                      <Button size="sm" variant="destructive" onClick={() => handleDeleteClick(user)} disabled={user.role === "admin"} className="gap-1">
                        <Trash2 className="h-3 w-3" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* --------------------- ADMINS --------------------- */}
        <TabsContent value="admins">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Administrator Accounts
              </CardTitle>
              <CardDescription>Manage administrator accounts with elevated permissions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="hidden md:block overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Verification</TableHead>
                      <TableHead>Created</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users
                      .filter((user) => user.role === "admin")
                      .map((user) => (
                        <TableRow key={user.id} className="hover:bg-muted/50">
                          <TableCell className="font-medium">{user.name || <span className="text-muted-foreground">No Name</span>}</TableCell>
                          <TableCell className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-muted-foreground md:hidden" />
                            {user.email}
                          </TableCell>
                          <TableCell>
                            <Badge variant="default" className="gap-1">
                              <Shield className="h-3 w-3" />
                              {user.role}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={user.emailVerified ? "default" : "secondary"} className="gap-1">
                              {user.emailVerified ? <CheckCircle className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                              {user.emailVerified ? "Verified" : "Unverified"}
                            </Badge>
                          </TableCell>
                          <TableCell className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4 md:hidden" />
                            {formatDate(user.createdAt)}
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>

              <div className="md:hidden space-y-3">
                {users
                  .filter((user) => user.role === "admin")
                  .map((user) => (
                    <div key={user.id} className="border rounded-lg p-3 bg-card/60">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="font-medium">{user.name || <span className="text-muted-foreground">No Name</span>}</div>
                          <div className="text-xs text-muted-foreground truncate max-w-[220px]">{user.email}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-muted-foreground">{formatDate(user.createdAt)}</div>
                          <div className="mt-1">
                            <Badge variant="default" className="px-2 py-0.5">{user.role}</Badge>
                          </div>
                        </div>
                      </div>

                      <div className="mt-3 flex items-center gap-2 justify-end">
                        <Button size="sm" variant="ghost" asChild>
                          <a href={`mailto:${user.email}`} className="flex items-center gap-2">
                            <Mail className="h-4 w-4" />
                            <span className="sr-only">Email</span>
                          </a>
                        </Button>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* --------------------- USERS --------------------- */}
        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserPlus className="h-5 w-5" />
                Regular User Accounts
              </CardTitle>
              <CardDescription>Manage regular user accounts and permissions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="hidden md:block overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Verification</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users
                      .filter((user) => user.role === "user")
                      .map((user) => (
                        <TableRow key={user.id} className="hover:bg-muted/50">
                          <TableCell className="font-medium">{user.name || <span className="text-muted-foreground">No Name</span>}</TableCell>
                          <TableCell className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-muted-foreground md:hidden" />
                            {user.email}
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary" className="gap-1">{user.role}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={user.emailVerified ? "default" : "secondary"} className="gap-1">
                              {user.emailVerified ? <CheckCircle className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                              {user.emailVerified ? "Verified" : "Unverified"}
                            </Badge>
                          </TableCell>
                          <TableCell className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4 md:hidden" />
                            {formatDate(user.createdAt)}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button size="sm" variant="destructive" onClick={() => handleDeleteClick(user)} className="gap-1">
                              <Trash2 className="h-3 w-3" />
                              <span className="hidden md:inline">Delete</span>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>

              <div className="md:hidden space-y-3">
                {users
                  .filter((user) => user.role === "user")
                  .map((user) => (
                    <div key={user.id} className="border rounded-lg p-3 bg-card/60">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-muted-foreground/10 flex items-center justify-center text-sm font-semibold">
                              {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="font-medium text-sm">{user.name || <span className="text-muted-foreground">No Name</span>}</div>
                              <div className="text-xs text-muted-foreground truncate max-w-[220px]">{user.email}</div>
                            </div>
                          </div>

                          <div className="mt-3 flex items-center gap-2">
                            <Badge variant={user.emailVerified ? "default" : "secondary"} className="gap-1">
                              {user.emailVerified ? <CheckCircle className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                              <span className="text-xs">{user.emailVerified ? "Verified" : "Unverified"}</span>
                            </Badge>
                          </div>
                        </div>
                      </div>

                      <div className="mt-3 flex items-center gap-2 justify-end">
                        <Button size="sm" variant="ghost" asChild>
                          <a href={`mailto:${user.email}`} className="flex items-center gap-2">
                            <Mail className="h-4 w-4" />
                            <span className="sr-only">Email</span>
                          </a>
                        </Button>

                        <Button size="sm" variant="destructive" onClick={() => handleDeleteClick(user)} className="gap-1">
                          <Trash2 className="h-3 w-3" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Trash2 className="h-5 w-5 text-destructive" />
              Delete User
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete user <strong className="text-foreground">{userToDelete?.name || userToDelete?.email}</strong>? This action cannot be undone and will permanently remove the user account.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)} disabled={deleting} className="gap-1">
              <XCircle className="h-4 w-4" />
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm} disabled={deleting} className="gap-1">
              {deleting ? (
                <>
                  <Spinner className="h-4 w-4" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4" />
                  Delete User
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function UsersManagement() {
  return (
    <AuthProtected requireAdmin={true}>
      <UsersManagementContent />
    </AuthProtected>
  );
}
