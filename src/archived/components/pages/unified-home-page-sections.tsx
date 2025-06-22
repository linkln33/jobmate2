"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { FeatureCard } from '@/components/ui/feature-card';
import { StepCard } from '@/components/ui/step-card';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { 
  Zap, 
  Search, 
  MessageSquare, 
  FileText, 
  Calendar, 
  Award, 
  TrendingUp, 
  Shield 
} from 'lucide-react';

export function FeatureHighlightsSection() {
  const features = [
    {
      icon: <Zap className="w-6 h-6 text-white" />,
      title: "AI-Powered Matching",
      description: "Our advanced algorithms analyze your skills, experience, and preferences to find the perfect job opportunities."
    },
    {
      icon: <Search className="w-6 h-6 text-white" />,
      title: "Smart Job Search",
      description: "Filter and search jobs with natural language. Just describe what you're looking for in plain English."
    },
    {
      icon: <FileText className="w-6 h-6 text-white" />,
      title: "Resume Optimization",
      description: "Our AI analyzes job descriptions and optimizes your resume to highlight relevant skills and experience."
    },
    {
      icon: <MessageSquare className="w-6 h-6 text-white" />,
      title: "Interview Coach",
      description: "Practice with our AI interview coach that provides personalized feedback and industry-specific questions."
    },
    {
      icon: <Calendar className="w-6 h-6 text-white" />,
      title: "Smart Scheduling",
      description: "Automatically find the perfect interview time that works for both parties with calendar integration."
    },
    {
      icon: <Award className="w-6 h-6 text-white" />,
      title: "Skill Verification",
      description: "Verify your skills with assessments and earn badges that make your profile stand out to employers."
    }
  ];

  return (
    <section id="features" className="py-24 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-50/50 to-purple-50/50 dark:from-gray-900/50 dark:to-gray-800/50 z-0" />
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="gradient-text from-blue-600 to-purple-600">
              Powered by Advanced AI
            </span>
          </h2>
          <p className="text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
            JobMate combines cutting-edge artificial intelligence with human expertise to revolutionize how you find and secure your next opportunity.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <FeatureCard
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                variant={index % 3 === 0 ? 'gradient' : index % 3 === 1 ? 'outline' : 'default'}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function HowItWorksSection() {
  const steps = [
    {
      step: 1,
      title: "Create Your Profile",
      description: "Sign up and build your professional profile. Our AI will help highlight your strengths and identify skill gaps.",
      icon: <FileText className="w-8 h-8" />
    },
    {
      step: 2,
      title: "Get Personalized Matches",
      description: "Our AI analyzes thousands of jobs in real-time to find opportunities that match your skills, experience, and preferences.",
      icon: <Search className="w-8 h-8" />
    },
    {
      step: 3,
      title: "Apply with Confidence",
      description: "Use our AI tools to optimize your application, prepare for interviews, and negotiate offers with industry insights.",
      icon: <TrendingUp className="w-8 h-8" />
    },
    {
      step: 4,
      title: "Land Your Dream Job",
      description: "Accept offers, manage your onboarding, and continue growing with JobMate's career development resources.",
      icon: <Award className="w-8 h-8" />
    }
  ];

  return (
    <section id="how-it-works" className="py-24 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-blue-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-purple-500/5 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="gradient-text from-blue-600 to-purple-600">
              How JobMate Works
            </span>
          </h2>
          <p className="text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
            A simple, streamlined process designed to help you find and secure the perfect job with the power of AI.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <StepCard
                step={step.step}
                title={step.title}
                description={step.description}
                icon={step.icon}
                isActive={index === 1}
              />
            </motion.div>
          ))}
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex justify-center"
        >
          <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600">
            Start Your Journey
          </Button>
        </motion.div>
      </div>
    </section>
  );
}

export function AIAssistantSection() {
  return (
    <section className="py-24 relative overflow-hidden bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              <span className="gradient-text from-blue-600 to-purple-600">
                Meet Your AI Career Assistant
              </span>
            </h2>
            
            <p className="text-xl text-gray-700 dark:text-gray-300 mb-8">
              Your personal AI career coach available 24/7 to help with every aspect of your job search and career development.
            </p>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-start">
                <div className="bg-blue-500 rounded-full p-2 mr-4 mt-1">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-1">Resume Analysis & Optimization</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Get detailed feedback on your resume and tailored suggestions to improve it for each job application.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-purple-500 rounded-full p-2 mr-4 mt-1">
                  <MessageSquare className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-1">Interview Preparation</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Practice with AI-powered mock interviews customized for your target role and industry.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-blue-500 rounded-full p-2 mr-4 mt-1">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-1">Salary Negotiation Coach</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Get data-driven advice on negotiating compensation based on market rates and your unique value.
                  </p>
                </div>
              </div>
            </div>
            
            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600">
              Try AI Assistant Now
            </Button>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative"
          >
            <GlassCard 
              className="p-6 rounded-2xl overflow-hidden border-2 border-blue-500/20" 
              intensity="medium"
              colorTint="blue"
            >
              <div className="chat-interface h-96 flex flex-col">
                <div className="flex items-center mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white mr-3">
                    AI
                  </div>
                  <div>
                    <h3 className="font-semibold">JobMate Assistant</h3>
                    <div className="text-xs text-green-500 flex items-center">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                      Online
                    </div>
                  </div>
                </div>
                
                <div className="flex-grow overflow-y-auto space-y-4 mb-4">
                  <div className="flex items-start">
                    <div className="bg-blue-500 rounded-full w-8 h-8 flex items-center justify-center text-white text-xs mr-2">
                      AI
                    </div>
                    <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3 max-w-[80%]">
                      <p>Hi there! I'm your JobMate AI assistant. How can I help with your job search today?</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start justify-end">
                    <div className="bg-blue-500 rounded-lg p-3 max-w-[80%] text-white">
                      <p>I need help preparing for a product manager interview at a tech company.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-blue-500 rounded-full w-8 h-8 flex items-center justify-center text-white text-xs mr-2">
                      AI
                    </div>
                    <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3 max-w-[80%]">
                      <p>I'd be happy to help you prepare for your product manager interview! Let's start by focusing on these key areas:</p>
                      <ul className="list-disc pl-5 mt-2 space-y-1">
                        <li>Product design and strategy questions</li>
                        <li>Analytical and metrics-driven thinking</li>
                        <li>Behavioral scenarios specific to product management</li>
                      </ul>
                      <p className="mt-2">Would you like to start with a mock interview or review specific question types?</p>
                    </div>
                  </div>
                </div>
                
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="Type your message..." 
                    className="w-full p-3 pr-12 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </button>
                </div>
              </div>
            </GlassCard>
            
            {/* Decorative elements */}
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-blue-500/10 rounded-full blur-xl" />
            <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-purple-500/10 rounded-full blur-xl" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
