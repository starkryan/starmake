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

function ProfileContent() {
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [userRole, setUserRole] = useState<string | null>(null)
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
        setUserRole(userWithRole.role || 'user')
      }
    } catch (error) {
      console.error('Error fetching user profile:', error)
      toast.error('Failed to load profile')
    } finally {
      setLoading(false)
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
      <h1 className="text-3xl font-bold">Profile</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
          <CardDescription>Your profile details and account settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="font-medium">Email:</span>
            <span>{userEmail}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-medium">Role:</span>
            <Badge variant={userRole === 'admin' ? 'default' : 'secondary'}>
              {userRole}
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-medium">Member since:</span>
            <span className="text-muted-foreground">Recently joined</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Account Actions</CardTitle>
          <CardDescription>Manage your account settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button variant="outline" className="w-full">Edit Profile</Button>
          <Button variant="outline" className="w-full">Change Password</Button>
          <Button variant="outline" className="w-full">Privacy Settings</Button>
        </CardContent>
      </Card>
      {/* Spacer for bottom navigation on mobile */}
      <div className="h-16 md:hidden -mt-8"></div>
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
