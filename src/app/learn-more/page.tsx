import React from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { FaMoneyBillWave, FaClock, FaGraduationCap, FaShield, FaHeadset, FaUsers } from 'react-icons/fa6'

function LearnMorePage() {
  const features = [
    {
      title: "Instant Withdrawals",
      description: "Get your earnings instantly transferred to your UPI account. No waiting periods.",
      icon: <FaMoneyBillWave className="h-8 w-8 md:h-12 md:w-12 text-primary" />
    },
    {
      title: "Flexible Working Hours",
      description: "Work whenever you want - early morning, during breaks, or late at night.",
      icon: <FaClock className="h-8 w-8 md:h-12 md:w-12 text-primary" />
    },
    {
      title: "No Special Skills Required",
      description: "Most tasks require no prior experience. Perfect for students, homemakers, and professionals.",
      icon: <FaGraduationCap className="h-8 w-8 md:h-12 md:w-12 text-primary" />
    },
    {
      title: "100% Secure & Trusted",
      description: "Your data and earnings are completely secure with bank-level encryption.",
      icon: <FaShield className="h-8 w-8 md:h-12 md:w-12 text-primary" />
    },
    {
      title: "24/7 Support",
      description: "Our support team is always available to help you with any questions.",
      icon: <FaHeadset className="h-8 w-8 md:h-12 md:w-12 text-primary" />
    },
    {
      title: "Growing Community",
      description: "Join over 50,000+ earners across India who trust our platform.",
      icon: <FaUsers className="h-8 w-8 md:h-12 md:w-12 text-primary" />
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
      <section className="container mx-auto py-8 md:py-16 text-center px-4">
        <div className="space-y-4 md:space-y-6 max-w-4xl mx-auto">
          <Badge variant="secondary" className="text-sm md:text-lg px-3 md:px-4 py-1">
            Everything You Need to Know
          </Badge>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight">
            Learn More About{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Earning With Us
            </span>
          </h1>
          <p className="text-base md:text-xl text-muted-foreground leading-relaxed">
            Discover how thousands of Indians are turning their free time into real income with our trusted platform.
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto py-8 md:py-16 px-4">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Why Choose Our Platform?</h2>
          <p className="text-base md:text-xl text-muted-foreground max-w-2xl mx-auto">
            We're committed to providing the best earning experience for our users
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="text-center hover-lift transition-all duration-300">
              <CardHeader className="p-4 md:p-6">
                <div className="mb-3 md:mb-4 flex justify-center">{feature.icon}</div>
                <CardTitle className="text-xl md:text-2xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent className="p-4 md:p-6">
                <CardDescription className="text-sm md:text-lg">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-muted/50 py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-base md:text-xl text-muted-foreground">
              Start earning in just 3 simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-primary rounded-full flex items-center justify-center text-white text-xl md:text-3xl font-bold mx-auto mb-4 md:mb-6">
                1
              </div>
              <h3 className="text-xl md:text-2xl font-semibold mb-2 md:mb-4">Sign Up & Complete Profile</h3>
              <p className="text-sm md:text-base text-muted-foreground">
                Create your free account and complete your profile with basic details and UPI information.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-primary rounded-full flex items-center justify-center text-white text-xl md:text-3xl font-bold mx-auto mb-4 md:mb-6">
                2
              </div>
              <h3 className="text-xl md:text-2xl font-semibold mb-2 md:mb-4">Choose Earning Tasks</h3>
              <p className="text-sm md:text-base text-muted-foreground">
                Browse available tasks and select those that match your interests and schedule.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-primary rounded-full flex items-center justify-center text-white text-xl md:text-3xl font-bold mx-auto mb-4 md:mb-6">
                3
              </div>
              <h3 className="text-xl md:text-2xl font-semibold mb-2 md:mb-4">Get Paid Instantly</h3>
              <p className="text-sm md:text-base text-muted-foreground">
                Complete tasks and receive instant payments directly to your UPI account.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="container mx-auto py-12 md:py-20 px-4">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Frequently Asked Questions</h2>
          <p className="text-base md:text-xl text-muted-foreground">
            Everything you need to know about earning with us
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left font-semibold text-base md:text-lg">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-sm md:text-base">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto py-8 md:py-16 text-center px-4">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl md:rounded-3xl p-4 md:p-8 lg:p-12 text-white">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-3 md:mb-4">
            Ready to Start Your Earning Journey?
          </h2>
          <p className="text-sm md:text-base lg:text-lg mb-4 md:mb-6 opacity-90">
            Join thousands of satisfied users who are already earning with us
          </p>
          <div className="flex flex-col sm:flex-row gap-2 md:gap-3 justify-center">
            <Link href="/login">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto px-4 md:px-6">
                Sign Up Now
              </Button>
            </Link>
            <Link href="/">
              <Button size="lg" variant="outline" className="w-full sm:w-auto px-4 md:px-6 border-white/50 hover:border-white text-white hover:bg-white/10">
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
