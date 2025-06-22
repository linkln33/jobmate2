"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Image from "next/image";
import { Button } from '@/components/ui/button';
import { MessageSquare, Sparkles, Zap, Search, ShieldCheck, Star } from 'lucide-react';

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
              MarketMind™: The Ultimate AI Marketplace Assistant
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              JobMate's proprietary MarketMind™ AI goes beyond basic assistance to become your strategic partner in the marketplace, with capabilities that learn and evolve with every interaction.
            </p>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-start">
                <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full mr-4">
                  <Sparkles className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Advanced Opportunity Detection</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Identifies high-value opportunities tailored to your skills, preferences, and success patterns with predictive market analysis.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-full mr-4">
                  <MessageSquare className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Adaptive Negotiation Coach</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Analyzes negotiation patterns to suggest optimal pricing, terms, and counteroffers with real-time market rate data and success probability.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-indigo-100 dark:bg-indigo-900/30 p-2 rounded-full mr-4">
                  <ShieldCheck className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Smart Contract Automation</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Generates custom smart contracts with milestone verification, automated payments, and dispute prevention mechanisms tailored to your specific transaction.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-full mr-4">
                  <Star className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Reputation Enhancement</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Provides actionable insights to improve your marketplace standing with personalized recommendations for profile optimization and service delivery excellence.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-amber-100 dark:bg-amber-900/30 p-2 rounded-full mr-4">
                  <Zap className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Cross-Category Intelligence</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Identifies complementary service opportunities across categories to maximize your marketplace potential and create service bundles.
                  </p>
                </div>
              </div>
            </div>
            
            <Button size="lg" className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
              Try AI Assistant Now
            </Button>
          </motion.div>
          
          <div className="relative py-12">
            <div className="flex flex-col items-center">
              {/* Speech bubble above AI Hero */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="relative z-10 mb-6 max-w-lg"
              >
                <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-lg relative speech-bubble border border-blue-200 dark:border-blue-800">
                  <p className="text-gray-600 dark:text-gray-300 font-medium">
                    "Found 3 premium opportunities matching your skills with 22% higher rates! Ready to prepare proposals or analyze these clients?"
                  </p>
                  {/* Speech bubble pointer */}
                  <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 h-6 w-6 bg-white dark:bg-gray-800 border-b border-r border-blue-100 dark:border-blue-900 rotate-45"></div>
                </div>
              </motion.div>
              
              {/* AI Hero Image */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="relative"
              >
                <div className="relative w-80 h-80 md:w-[500px] md:h-[500px]">
                  <Image 
                    src="/images/ai-hero.svg" 
                    alt="AI Hero" 
                    fill 
                    className="object-contain" 
                    priority 
                  />
                  <div className="absolute -inset-20 bg-blue-500/25 rounded-full blur-3xl -z-10"></div>
                  <div className="absolute -inset-12 bg-indigo-400/15 rounded-full blur-2xl -z-10 animate-pulse"></div>
                  <div className="absolute -inset-8 bg-purple-500/10 rounded-full blur-xl -z-10"></div>
                </div>
              </motion.div>

              {/* Buttons below */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="mt-8 flex flex-col items-center"
              >
                <div className="flex flex-wrap justify-center gap-3 mb-4">
                  <Button size="sm" variant="outline">
                    Prepare proposals
                  </Button>
                  <Button size="sm" variant="outline">
                    Analyze clients
                  </Button>
                  <Button size="sm" variant="outline">
                    Show opportunities
                  </Button>
                </div>
                
                <div className="text-sm text-gray-500 dark:text-gray-400 text-center max-w-md">
                  Your AI assistant learns from each interaction to provide better guidance.
                </div>
              </motion.div>
            </div>
          </div>
          {/* Decorative elements */}
          <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl" />
        </div>
      </div>
    </section>
  );
}
