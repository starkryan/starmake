"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import AuthProtected from "@/components/auth/auth-protected"
import { toast } from "sonner"
import { FaGift, FaRupeeSign, FaUser, FaPhone, FaQrcode } from "react-icons/fa6"
import { FaCheckCircle } from "react-icons/fa"

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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ salaryCode, upiId, userName, userPhone }),
      })

      const result = await response.json()
      if (!response.ok) throw new Error(result.error || "Failed to redeem salary code")

      toast.success("Redemption request submitted successfully! 🎉")
      const confetti = await import("canvas-confetti")
      confetti.default({ particleCount: 100, spread: 70, origin: { y: 0.6 } })

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
    <div className="min-h-screen bg-background py-6">
      <div className="max-w-3xl mx-auto p-4 sm:p-6">
        <h1 className="text-3xl font-bold mb-4 text-center">Redeem Salary Codes</h1>

        <Card>
          <CardHeader className="text-center py-6 px-6 sm:px-12">
            <div className="mx-auto mb-4 bg-primary/10 p-3 rounded-full w-16 h-16 flex items-center justify-center">
              <FaGift className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">Redeem Your Earnings</CardTitle>
            <CardDescription className="max-w-prose mx-auto">Enter your salary code details to redeem your earnings</CardDescription>
          </CardHeader>

          <CardContent className="px-4 sm:px-8 pb-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Salary Code */}
              <div className="space-y-2">
                <Label htmlFor="salaryCode" className="flex items-center gap-2">
                  <span className="sr-only">Salary Code</span>
                  <div className="hidden sm:inline-flex items-center gap-2 text-sm text-muted-foreground">
                    <FaQrcode className="h-4 w-4" /> Salary Code
                  </div>
                  <div className="inline-flex sm:hidden items-center gap-2 text-sm text-muted-foreground">
                    <FaQrcode className="h-4 w-4" />
                  </div>
                </Label>
                <Input
                  id="salaryCode"
                  value={salaryCode}
                  onChange={(e) => setSalaryCode(e.target.value)}
                  placeholder="Enter your salary code"
                  required
                  disabled={isSubmitting}
                />
              </div>

              {/* UPI ID */}
              <div className="space-y-2">
                <Label htmlFor="upiId" className="flex items-center gap-2">
                  <span className="sr-only">UPI ID</span>
                  <div className="hidden sm:inline-flex items-center gap-2 text-sm text-muted-foreground">
                    <FaRupeeSign className="h-4 w-4" /> UPI ID
                  </div>
                  <div className="inline-flex sm:hidden items-center gap-2 text-sm text-muted-foreground">
                    <FaRupeeSign className="h-4 w-4" />
                  </div>
                </Label>
                <Input
                  id="upiId"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder="example@bank"
                  required
                  disabled={isSubmitting}
                />
              </div>

              {/* Name & Phone - responsive two column on sm+ */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="userName" className="flex items-center gap-2">
                    <span className="sr-only">Full Name</span>
                    <div className="hidden sm:inline-flex items-center gap-2 text-sm text-muted-foreground">
                      <FaUser className="h-4 w-4" /> Full Name
                    </div>
                    <div className="inline-flex sm:hidden items-center gap-2 text-sm text-muted-foreground">
                      <FaUser className="h-4 w-4" />
                    </div>
                  </Label>
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
                  <Label htmlFor="userPhone" className="flex items-center gap-2">
                    <span className="sr-only">Phone Number</span>
                    <div className="hidden sm:inline-flex items-center gap-2 text-sm text-muted-foreground">
                      <FaPhone className="h-4 w-4" /> Phone Number
                    </div>
                    <div className="inline-flex sm:hidden items-center gap-2 text-sm text-muted-foreground">
                      <FaPhone className="h-4 w-4" />
                    </div>
                  </Label>
                  <Input
                    id="userPhone"
                    value={userPhone}
                    onChange={(e) => setUserPhone(e.target.value)}
                    placeholder="Enter your phone number"
                    required
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-end pt-2">
                <Button type="button" variant="outline" onClick={() => {
                  setSalaryCode(""); setUpiId(""); setUserName(""); setUserPhone("");
                }} className="w-full sm:w-auto">Cancel</Button>

                <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Processing...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <FaCheckCircle className="h-4 w-4" /> Redeem Now
                    </div>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Spacer for bottom navigation on mobile */}
        <div className="h-16 md:hidden -mt-8" />
      </div>
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
