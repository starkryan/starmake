"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import AuthProtected from "@/components/auth/auth-protected"
import { toast } from "sonner"

function RedeemContent() {
  const [salaryCode, setSalaryCode] = useState("")
  const [upiId, setUpiId] = useState("")
  const [userName, setUserName] = useState("")
  const [userPhone, setUserPhone] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/redeem", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          salaryCode,
          upiId,
          userName,
          userPhone,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Failed to redeem salary code")
      }

      toast.success("Redemption request submitted successfully! 🎉")
      
      // Trigger confetti animation
      const confetti = await import('canvas-confetti');
      confetti.default({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      
      // Reset form
      setSalaryCode("")
      setUpiId("")
      setUserName("")
      setUserPhone("")
    } catch (error) {
      console.error("Redemption error:", error)
      toast.error(error instanceof Error ? error.message : "Error redeeming code")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">Redeem Salary Codes</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Redeem Your Earnings</CardTitle>
          <CardDescription>Enter your salary code details to redeem your earnings</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="salaryCode">Salary Code</Label>
              <Input
                id="salaryCode"
                value={salaryCode}
                onChange={(e) => setSalaryCode(e.target.value)}
                placeholder="Enter your salary code"
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="upiId">UPI ID</Label>
              <Input
                id="upiId"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                placeholder="Enter your UPI ID"
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="userName">Full Name</Label>
              <Input
                id="userName"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Enter your full name"
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="userPhone">Phone Number</Label>
              <Input
                id="userPhone"
                value={userPhone}
                onChange={(e) => setUserPhone(e.target.value)}
                placeholder="Enter your phone number"
                required
                disabled={isSubmitting}
              />
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Processing..." : "Redeem Now"}
            </Button>
          </form>
        </CardContent>
      </Card>
      {/* Spacer for bottom navigation on mobile */}
      <div className="h-16 md:hidden -mt-8"></div>
    </div>
  )
}

export default function RedeemPage() {
  return (
    <AuthProtected>
      <RedeemContent />
    </AuthProtected>
  )
}
