"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { AIRobotFace } from '@/components/ui/ai-robot-face';
import { Button } from '@/components/ui/button';
import { MessageSquare, Sparkles, Zap } from 'lucide-react';

export function AIAssistantSection() {
  return (
    <section className="py-16 bg-gradient-to-b from-transparent to-gray-50 dark:to-gray-900/30">
      <div className="container px-4 mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Meet Your Personal AI Career Assistant
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              JobMate's AI assistant helps you navigate every step of your job search journey with personalized guidance and support.
            </p>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-start">
                <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full mr-4">
                  <Sparkles className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Resume Enhancement</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Get AI-powered suggestions to optimize your resume for each job application.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-full mr-4">
                  <MessageSquare className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Interview Coaching</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Practice interviews with our AI and receive real-time feedback to improve.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-indigo-100 dark:bg-indigo-900/30 p-2 rounded-full mr-4">
                  <Zap className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">24/7 Career Advice</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Get answers to your career questions anytime, anywhere.
                  </p>
                </div>
              </div>
            </div>
            
            <Button size="lg" className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
              Try AI Assistant Now
            </Button>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="glass-card p-6 rounded-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500" />
              
              <div className="flex justify-center mb-6">
                <AIRobotFace size="lg" variant="glow" />
              </div>
              
              <h3 className="text-2xl font-semibold text-center mb-4">
                AI Career Assistant
              </h3>
              
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg mb-4">
                <p className="text-gray-800 dark:text-gray-200">
                  "I can help you prepare for your upcoming interview at Google. Would you like to practice some common questions?"
                </p>
              </div>
              
              <div className="flex space-x-2 mb-4">
                <Button variant="outline" size="sm" className="flex-1">Yes, let's practice</Button>
                <Button variant="outline" size="sm" className="flex-1">Show me tips first</Button>
              </div>
              
              <div className="text-center text-sm text-gray-500 dark:text-gray-400">
                Your AI assistant learns from each interaction to provide better guidance.
              </div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
