"use client"
import React from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { TestimonialsSection } from '@/components/blocks/testimonials-with-marquee'
import { motion } from "framer-motion"

import { FaThumbsUp, FaStar, FaPlay, FaClipboardList, FaMobile, FaUsers, FaArrowRight, FaCheck, FaRupeeSign } from 'react-icons/fa6'

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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-4 md:space-y-6 max-w-4xl mx-auto"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Badge variant="secondary" className="text-sm md:text-lg px-3 md:px-4 py-1 hover-lift">
              <FaRupeeSign className="inline mr-1" />
              Earn Real Money Online
            </Badge>
          </motion.div>
          
          <motion.h1 
            className="text-3xl md:text-5xl lg:text-7xl font-bold tracking-tight"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            Turn Your{' '}
            <motion.span 
              className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
              initial={{ backgroundPosition: '0% 50%' }}
              animate={{ backgroundPosition: '100% 50%' }}
              transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}
            >
              Free Time
            </motion.span>{' '}
            Into Income
          </motion.h1>
          
          <motion.p 
            className="text-base md:text-xl lg:text-2xl text-muted-foreground leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            Discover thousands of earning opportunities from social media engagement to hotel reviews. 
            Get paid for your time and creativity with instant withdrawals.
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row gap-3 justify-center pt-4 md:pt-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            <Link href="/login" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto px-6 md:px-8 hover-lift group">
                Start Earning Now
                <FaArrowRight className="ml-2 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link href="/learn-more" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full sm:w-auto px-6 md:px-8 hover-lift">
                Learn More
              </Button>
            </Link>
          </motion.div>
        </motion.div>
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
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <Card className="hover-lift transition-all duration-300 h-full flex flex-col">
                <CardHeader className="p-4 md:p-6 flex-1">
                  <div className="flex items-center justify-between mb-3 md:mb-4">
                    <Badge variant="outline" className="text-xs md:text-sm">{opportunity.category}</Badge>
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <opportunity.icon className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                    </div>
                  </div>
                  <CardTitle className="text-xl md:text-2xl">{opportunity.title}</CardTitle>
                  <CardDescription className="text-sm md:text-lg mt-2">
                    {opportunity.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4 md:p-6 pt-0">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-green-600 text-sm md:text-base flex items-center">
                      <FaRupeeSign className="mr-1" />
                      {opportunity.earnings.replace('₹', '')}
                    </span>
                    <Button variant="ghost" size="sm" className="text-xs md:text-sm group">
                      Get Started 
                      <FaArrowRight className="ml-1 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-muted/50 py-12 md:py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-8 md:mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-base md:text-xl text-muted-foreground">
              Start earning in just 3 simple steps
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {[
              { 
                step: 1, 
                title: "Sign Up Free", 
                description: "Create your account and complete your profile in minutes",
                icon: <FaCheck className="text-white" />
              },
              { 
                step: 2, 
                title: "Choose Tasks", 
                description: "Select from available earning opportunities that interest you",
                icon: <FaClipboardList className="text-white" />
              },
              { 
                step: 3, 
                title: "Get Paid", 
                description: "Complete tasks and receive instant payments to your UPI account",
                icon: <FaRupeeSign className="text-white" />
              }
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                className="text-center"
              >
                <div className="w-12 h-12 md:w-16 md:h-16 bg-primary rounded-full flex items-center justify-center text-white text-xl md:text-2xl font-bold mx-auto mb-3 md:mb-4 hover-lift">
                  {item.icon}
                </div>
                <motion.h3 
                  className="text-xl md:text-2xl font-semibold mb-2"
                  whileHover={{ scale: 1.05 }}
                >
                  {item.title}
                </motion.h3>
                <p className="text-sm md:text-base text-muted-foreground">
                  {item.description}
                </p>
              </motion.div>
            ))}
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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl md:rounded-3xl p-6 md:p-12 text-white"
        >
          <motion.h2 
            className="text-2xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Ready to Start Earning?
          </motion.h2>
          <motion.p 
            className="text-base md:text-xl mb-6 md:mb-8 opacity-90"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Join our community of earners and start making money today
          </motion.p>
          <motion.div 
            className="flex flex-col sm:flex-row gap-3 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Link href="/signup" className="w-full sm:w-auto">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto px-6 md:px-8 hover-lift group">
                Sign Up Free
                <FaArrowRight className="ml-2 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link href="/tasks" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full sm:w-auto px-6 md:px-8 text-black hover-lift">
                See All Opportunities
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </section>
      {/* Spacer for bottom navigation on mobile */}
      <div className="h-16 md:hidden -mt-8"></div>
    </div>
  )
}

export default Page
