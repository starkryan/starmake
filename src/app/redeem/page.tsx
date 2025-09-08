"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import AuthProtected from '@/components/auth/auth-protected'
import { FaCheckCircle } from 'react-icons/fa'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function RedeemPage() {
  const [form, setForm] = useState({
    salaryCode: '',
    upiId: '',
    userName: '',
    userPhone: ''
  })
  const [submitting, setSubmitting] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const response = await fetch('/api/user/redeem-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || 'Failed to redeem salary code')
      
      toast.success('Redemption request submitted successfully! 🎉')
      const confetti = await import('canvas-confetti')
      confetti.default({ particleCount: 80, spread: 60, origin: { y: 0.6 } })
      router.push('/dashboard')
    } catch (error) {
      console.error('Error redeeming code:', error)
      toast.error(error instanceof Error ? error.message : 'Error redeeming code')
    } finally {
      setSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  return (
    <AuthProtected>
      <div className="min-h-screen bg-background">
        <div className="max-w-md mx-auto p-4 sm:p-6 pb-24">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FaCheckCircle className="h-5 w-5" />
                Redeem Salary Code
              </CardTitle>
              <CardDescription>
                Enter your salary code details to redeem it
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="salaryCode">Salary Code</Label>
                  <Input
                    id="salaryCode"
                    name="salaryCode"
                    value={form.salaryCode}
                    onChange={handleChange}
                    placeholder="Enter salary code"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="upiId">UPI ID</Label>
                  <Input
                    id="upiId"
                    name="upiId"
                    value={form.upiId}
                    onChange={handleChange}
                    placeholder="Enter your UPI ID"
                    required
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="userName">Full Name</Label>
                    <Input
                      id="userName"
                      name="userName"
                      value={form.userName}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="userPhone">Phone Number</Label>
                    <Input
                      id="userPhone"
                      name="userPhone"
                      value={form.userPhone}
                      onChange={handleChange}
                      placeholder="Enter your phone number"
                      required
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push('/dashboard')}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={submitting}>
                    {submitting ? 'Submitting...' : 'Redeem Code'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </AuthProtected>
  )
}
