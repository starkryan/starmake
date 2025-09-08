"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { supabase } from "@/lib/supabase"
import { authClient } from "@/lib/auth-client"
import AuthProtected from "@/components/auth/auth-protected"
import { Spinner } from "@/components/ui/spinner"
import { toast } from "sonner"

function formatDate(input?: string) {
  if (!input) return "-"
  try { return new Date(input).toLocaleDateString() } catch { return input as string }
}

function ProfileContent() {
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [userRole, setUserRole] = useState<string | null>(null)
  const [createdAt, setCreatedAt] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUserProfile()
  }, [])

  const fetchUserProfile = async () => {
    try {
      const session = await authClient.getSession()
      if (session?.data?.user) {
        setUserEmail(session.data.user.email)
        const userWithRole = session.data.user as any
        setUserRole(userWithRole.role || "user")
        // try to read metadata/created_at if available
        if ((userWithRole as any).created_at) setCreatedAt((userWithRole as any).created_at)
      }
    } catch (error) {
      console.error("Error fetching user profile:", error)
      toast.error("Failed to load profile")
    } finally {
      setLoading(false)
    }
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center"><Spinner className="h-8 w-8" /></div>
  )

  return (
    <div className="min-h-screen bg-background py-6">
      <div className="max-w-3xl mx-auto p-4 sm:p-6 space-y-6">
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-full bg-muted-foreground/10 flex items-center justify-center text-xl font-semibold">
              {userEmail ? userEmail.charAt(0).toUpperCase() : "U"}
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">Profile</h1>
              <p className="text-sm text-muted-foreground mt-0.5">Manage your account details and settings</p>
            </div>
          </div>
          <div className="w-full sm:w-auto flex gap-2">
            <Button variant="outline" className="w-full sm:w-auto">Edit Profile</Button>
            <Button variant="ghost" className="hidden sm:inline">Sign Out</Button>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>Your profile details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col gap-2 sm:gap-0 sm:flex-row sm:justify-between">
                <span className="font-medium">Email</span>
                <span className="break-words text-sm">{userEmail || "-"}</span>
              </div>

              <div className="flex flex-col gap-2 sm:gap-0 sm:flex-row sm:justify-between items-start sm:items-center">
                <span className="font-medium">Role</span>
                <Badge variant={userRole === "admin" ? "default" : "secondary"} className="mt-1 sm:mt-0">{userRole}</Badge>
              </div>

              <div className="flex flex-col gap-2 sm:gap-0 sm:flex-row sm:justify-between">
                <span className="font-medium">Member since</span>
                <span className="text-sm text-muted-foreground">{createdAt ? formatDate(createdAt) : "Recently joined"}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Account Actions</CardTitle>
              <CardDescription>Manage security and preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full">Change Password</Button>
              <Button variant="outline" className="w-full">Privacy Settings</Button>
              <Button variant="destructive" className="w-full">Delete Account</Button>
            </CardContent>
          </Card>
        </div>

        <section className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Activity</CardTitle>
              <CardDescription>Recent account activity</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">No recent activity to show.</p>
            </CardContent>
          </Card>
        </section>

        {/* Spacer for bottom navigation on mobile */}
        <div className="h-16 md:hidden -mt-8" />
      </div>
    </div>
  )
}

export default function ProfilePage() {
  return (
    <AuthProtected>
      <ProfileContent />
    </AuthProtected>
  )
}
