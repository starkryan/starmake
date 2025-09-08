import React from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

function LearnMorePage() {
  const features = [
    {
      title: "Instant Withdrawals",
      description: "Get your earnings instantly transferred to your UPI account. No waiting periods.",
      icon: "💰"
    },
    {
      title: "Flexible Working Hours",
      description: "Work whenever you want - early morning, during breaks, or late at night.",
      icon: "⏰"
    },
    {
      title: "No Special Skills Required",
      description: "Most tasks require no prior experience. Perfect for students, homemakers, and professionals.",
      icon: "🎓"
    },
    {
      title: "100% Secure & Trusted",
      description: "Your data and earnings are completely secure with bank-level encryption.",
      icon: "🔒"
    },
    {
      title: "24/7 Support",
      description: "Our support team is always available to help you with any questions.",
      icon: "📞"
    },
    {
      title: "Growing Community",
      description: "Join over 50,000+ earners across India who trust our platform.",
      icon: "👥"
    }
  ];

  const faqs = [
    {
      question: "How much can I earn?",
      answer: "Most users earn between ₹5000-₹15000 per month depending on the time they invest. Some top earners make over ₹30000 monthly!"
    },
    {
      question: "When do I get paid?",
      answer: "Payments are processed instantly to your UPI account upon task completion. No waiting periods."
    },
    {
      question: "Is there any registration fee?",
      answer: "No, registration is completely free. You only pay when you withdraw your earnings (small processing fee)."
    },
    {
      question: "What devices do I need?",
      answer: "You can use any smartphone with internet connection. Both Android and iOS are supported."
    },
    {
      question: "Are there any age restrictions?",
      answer: "You must be at least 18 years old to join our platform and start earning."
    },
    {
      question: "How do I get started?",
      answer: "Simply sign up, complete your profile, and start choosing from available earning tasks."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="container mx-auto py-16 text-center">
        <div className="space-y-6 max-w-4xl mx-auto">
          <Badge variant="secondary" className="text-lg px-4 py-1">
            Everything You Need to Know
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Learn More About{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Earning With Us
            </span>
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Discover how thousands of Indians are turning their free time into real income with our trusted platform.
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Why Choose Our Platform?</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            We're committed to providing the best earning experience for our users
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="text-center hover-lift transition-all duration-300">
              <CardHeader>
                <div className="text-4xl mb-4">{feature.icon}</div>
                <CardTitle className="text-2xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-lg">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-muted/50 py-20">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-muted-foreground">
              Start earning in just 3 simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto mb-6">
                1
              </div>
              <h3 className="text-2xl font-semibold mb-4">Sign Up & Complete Profile</h3>
              <p className="text-muted-foreground">
                Create your free account and complete your profile with basic details and UPI information.
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto mb-6">
                2
              </div>
              <h3 className="text-2xl font-semibold mb-4">Choose Earning Tasks</h3>
              <p className="text-muted-foreground">
                Browse available tasks and select those that match your interests and schedule.
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto mb-6">
                3
              </div>
              <h3 className="text-2xl font-semibold mb-4">Get Paid Instantly</h3>
              <p className="text-muted-foreground">
                Complete tasks and receive instant payments directly to your UPI account.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="container mx-auto py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
          <p className="text-xl text-muted-foreground">
            Everything you need to know about earning with us
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {faqs.map((faq, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="text-xl">{faq.question}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-lg">
                  {faq.answer}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto py-20 text-center">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Start Your Earning Journey?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of satisfied users who are already earning with us
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/login">
              <Button size="lg" variant="secondary" className="px-8 mb-4">
                Sign Up Now
              </Button>
            </Link>
            <Link href="/">
              <Button size="lg" variant="outline" className="px-8 border-white text-white mb-4">
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </section>
      {/* Spacer for bottom navigation on mobile */}
      <div className="h-16 md:hidden -mt-8"></div>
    </div>
  )
}

export default LearnMorePage
