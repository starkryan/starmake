import React from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { TestimonialsSection } from '@/components/blocks/testimonials-with-marquee'
import { FaThumbsUp, FaStar, FaPlay, FaClipboardList, FaMobile, FaUsers } from 'react-icons/fa6'

function Page() {
  const earningOpportunities = [
    {
      title: "Like Social Media Posts",
      description: "Get paid for liking and engaging with posts on popular social platforms.",
      earnings: "₹50-200 per post",
      icon: FaThumbsUp,
      category: "Social Media"
    },
    {
      title: "Rate Hotels & Restaurants",
      description: "Share your honest reviews and ratings for hotels and earn money.",
      earnings: "₹100-500 per review",
      icon: FaStar,
      category: "Reviews"
    },
    {
      title: "Watch Ads & Videos",
      description: "Earn money by watching promotional content and advertisements.",
      earnings: "₹20-100 per video",
      icon: FaPlay,
      category: "Advertising"
    },
    {
      title: "Complete Surveys",
      description: "Share your opinions through surveys and get rewarded.",
      earnings: "₹150-300 per survey",
      icon: FaClipboardList,
      category: "Surveys"
    },
    {
      title: "Test Apps & Websites",
      description: "Get paid to test new applications and provide feedback.",
      earnings: "₹200-800 per test",
      icon: FaMobile,
      category: "Testing"
    },
    {
      title: "Refer Friends",
      description: "Earn commission by referring friends to our platform.",
      earnings: "₹500 per referral",
      icon: FaUsers,
      category: "Referral"
    }
  ];

  const testimonials = [
    {
      author: {
        name: "Priya Sharma",
        handle: "College Student",
        avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=200&q=80"
      },
      text: "I earned ₹5000 last month just by rating hotels during my free time. Perfect side hustle for students!"
    },
    {
      author: {
        name: "Rahul Kapoor",
        handle: "Freelancer",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=200&q=80"
      },
      text: "The social media liking tasks are so easy. I make money while scrolling through my phone during breaks!"
    },
    {
      author: {
        name: "Sneha Patel",
        handle: "Homemaker",
        avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=200&q=80"
      },
      text: "Completed surveys during my kids' nap time and earned extra income for my family. Very flexible!"
    },
    {
      author: {
        name: "Ankit Verma",
        handle: "Graphic Designer",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=200&q=80"
      },
      text: "App testing is my favorite - I get to use new apps and earn ₹800 per test. Great side income!"
    },
    {
      author: {
        name: "Neha Gupta",
        handle: "Teacher",
        avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=200&q=80"
      },
      text: "I refer friends and earn ₹500 per referral. It's amazing how quickly the earnings add up!"
    },
    {
      author: {
        name: "Rajesh Kumar",
        handle: "Delivery Executive",
        avatar: "https://images.unsplash.com/photo-1552058544-f2b08422138a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=200&q=80"
      },
      text: "Watching ads during my free time helps me earn extra ₹2000 monthly. Very convenient!"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="container mx-auto py-12 md:py-20 text-center px-4">
        <div className="space-y-4 md:space-y-6 max-w-4xl mx-auto">
          <Badge variant="secondary" className="text-sm md:text-lg px-3 md:px-4 py-1">
            Earn Real Money Online
          </Badge>
          <h1 className="text-3xl md:text-5xl lg:text-7xl font-bold tracking-tight">
            Turn Your{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Free Time
            </span>{' '}
            Into Income
          </h1>
          <p className="text-base md:text-xl lg:text-2xl text-muted-foreground leading-relaxed">
            Discover thousands of earning opportunities from social media engagement to hotel reviews. 
            Get paid for your time and creativity with instant withdrawals.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4 md:pt-6">
            <Link href="/login" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto px-6 md:px-8">
                Start Earning Now
              </Button>
            </Link>
            <Link href="/learn-more" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full sm:w-auto px-6 md:px-8">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Earning Opportunities Section */}
      <section className="container mx-auto py-12 md:py-16 px-4">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">How You Can Earn</h2>
          <p className="text-base md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose from various earning methods that fit your skills and schedule
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {earningOpportunities.map((opportunity, index) => (
            <Card key={index} className="hover-lift transition-all duration-300">
              <CardHeader className="p-4 md:p-6">
                <div className="flex items-center justify-between mb-3 md:mb-4">
                  <Badge variant="outline" className="text-xs md:text-sm">{opportunity.category}</Badge>
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-muted rounded-lg flex items-center justify-center">
                    <opportunity.icon className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                  </div>
                </div>
                <CardTitle className="text-xl md:text-2xl">{opportunity.title}</CardTitle>
                <CardDescription className="text-sm md:text-lg">
                  {opportunity.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 md:p-6">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-green-600 text-sm md:text-base">
                    {opportunity.earnings}
                  </span>
                  <Button variant="ghost" size="sm" className="text-xs md:text-sm">
                    Get Started →
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-muted/50 py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-base md:text-xl text-muted-foreground">
              Start earning in just 3 simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <div className="text-center">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-primary rounded-full flex items-center justify-center text-white text-xl md:text-2xl font-bold mx-auto mb-3 md:mb-4">
                1
              </div>
              <h3 className="text-xl md:text-2xl font-semibold mb-2">Sign Up Free</h3>
              <p className="text-sm md:text-base text-muted-foreground">
                Create your account and complete your profile in minutes
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-primary rounded-full flex items-center justify-center text-white text-xl md:text-2xl font-bold mx-auto mb-3 md:mb-4">
                2
              </div>
              <h3 className="text-xl md:text-2xl font-semibold mb-2">Choose Tasks</h3>
              <p className="text-sm md:text-base text-muted-foreground">
                Select from available earning opportunities that interest you
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-primary rounded-full flex items-center justify-center text-white text-xl md:text-2xl font-bold mx-auto mb-3 md:mb-4">
                3
              </div>
              <h3 className="text-xl md:text-2xl font-semibold mb-2">Get Paid</h3>
              <p className="text-sm md:text-base text-muted-foreground">
                Complete tasks and receive instant payments to your UPI account
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <TestimonialsSection 
        title="Real Earnings, Real People"
        description="Join thousands of users who are already earning with us"
        testimonials={testimonials}
      />

      {/* CTA Section */}
      <section className="container mx-auto py-12 md:py-20 text-center px-4">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl md:rounded-3xl p-6 md:p-12 text-white">
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6">
            Ready to Start Earning?
          </h2>
          <p className="text-base md:text-xl mb-6 md:mb-8 opacity-90">
            Join our community of earners and start making money today
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button size="lg" variant="secondary" className="w-full sm:w-auto px-6 md:px-8">
              Sign Up Free
            </Button>
            <Button size="lg" variant="outline" className="w-full sm:w-auto px-6 md:px-8 text-black">
              See All Opportunities
            </Button>
          </div>
        </div>
      </section>
      {/* Spacer for bottom navigation on mobile */}
      <div className="h-16 md:hidden -mt-8"></div>
    </div>
  )
}

export default Page
