"use client";

/**
 * @file Feature Highlights Section Component
 * @module components/sections/feature-highlights-section
 * 
 * This component displays a categorized grid of feature cards highlighting
 * the key capabilities of the JobMate platform. Features are organized into
 * categories (AI Technology, Security & Trust, Marketplace, Business Tools)
 * and can be filtered by category.
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FeatureCard } from '@/components/ui/feature-card';
import { 
  Brain, ShieldCheck, TrendingUp, Award, Layers, Database, 
  Fingerprint, Zap, Sparkles, BarChart, Users, Store, 
  Link, Briefcase, Cpu, Lock, Globe, Repeat, Clock, 
  CreditCard, MessageSquare, Star, Rocket, PieChart
} from 'lucide-react';

/**
 * Feature Highlights Section Component
 * 
 * Displays an interactive grid of feature cards with category filtering.
 * Features are organized into categories and displayed with icons and descriptions.
 * Users can filter features by category using the category tabs.
 * 
 * @returns {JSX.Element} The rendered Feature Highlights Section
 */
export function FeatureHighlightsSection() {
  const [activeCategory, setActiveCategory] = useState('all');
  
  const featureCategories = [
    { id: 'all', name: 'All Features' },
    { id: 'ai', name: 'AI Technology' },
    { id: 'security', name: 'Security & Trust' },
    { id: 'marketplace', name: 'Marketplace' },
    { id: 'business', name: 'Business Tools' }
  ];

  const allFeatures = {
    ai: [
      {
        icon: <Brain className="h-6 w-6 text-white" />,
        title: "AI Matching",
        description: "Our AI connects you with perfect matches using 50+ data points",
        bgColor: "bg-gradient-to-br from-blue-500 to-blue-600",
        category: "ai"
      },
      {
        icon: <Cpu className="h-6 w-6 text-white" />,
        title: "Smart Profiles",
        description: "AI-optimized profiles that attract more clients and opportunities",
        bgColor: "bg-gradient-to-br from-blue-600 to-blue-700",
        category: "ai"
      }
    ],
    security: [
      {
        icon: <Fingerprint className="h-6 w-6 text-white" />,
        title: "Identity Verification",
        description: "Multi-factor authentication ensures all users are verified",
        bgColor: "bg-gradient-to-br from-purple-400 to-purple-600",
        category: "security"
      },
      {
        icon: <Lock className="h-6 w-6 text-white" />,
        title: "Secure Payments",
        description: "Encrypted payment system with fraud detection and protection",
        bgColor: "bg-gradient-to-br from-purple-300 to-purple-500",
        category: "security"
      }
    ],
    marketplace: [
      {
        icon: <BarChart className="h-6 w-6 text-white" />,
        title: "Dynamic Pricing",
        description: "AI-powered price recommendations based on market demand",
        bgColor: "bg-gradient-to-br from-amber-500 to-amber-600",
        category: "marketplace"
      },
      {
        icon: <Store className="h-6 w-6 text-white" />,
        title: "Store Front",
        description: "Branded storefront for your services with customizable themes",
        bgColor: "bg-gradient-to-br from-amber-600 to-amber-700",
        category: "marketplace"
      },
      {
        icon: <Layers className="h-6 w-6 text-white" />,
        title: "Unified Services",
        description: "Combine services, gigs, and rentals with unified billing",
        bgColor: "bg-gradient-to-br from-amber-400 to-amber-600",
        category: "marketplace"
      }
    ],
    business: [
      {
        icon: <Link className="h-6 w-6 text-white" />,
        title: "Affiliate Program",
        description: "Earn passive income with our multi-tier referral system",
        bgColor: "bg-gradient-to-br from-green-500 to-green-600",
        category: "business"
      },
      {
        icon: <Users className="h-6 w-6 text-white" />,
        title: "Team Tools",
        description: "Manage team members and track progress efficiently",
        bgColor: "bg-gradient-to-br from-green-600 to-green-700",
        category: "business"
      }
    ]
  };
  
  // Flatten all features for 'all' category view
  const features = activeCategory === 'all' 
    ? [...allFeatures.ai, ...allFeatures.security, ...allFeatures.marketplace, ...allFeatures.business]
    : allFeatures[activeCategory as keyof typeof allFeatures] || [];

  return (
    <section className="py-16 bg-gradient-to-b from-transparent to-gray-50 dark:to-gray-900/30">
      <div className="container px-4 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
              Next-Generation Marketplace Technology
            </span>
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-3xl mx-auto text-lg">
            JobMate leverages cutting-edge AI, bulletproof security, and advanced verification systems to create a marketplace experience that outperforms traditional platforms in every dimension.
          </p>
          
          {/* Stats row */}
          <div className="flex flex-wrap justify-center gap-8 mt-8">
            <motion.div 
              className="flex items-center gap-2"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Zap className="h-5 w-5 text-blue-500" />
              <span className="text-xl font-bold">50+</span>
              <span className="text-gray-600 dark:text-gray-400">AI Data Points</span>
            </motion.div>
            <motion.div 
              className="flex items-center gap-2"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <ShieldCheck className="h-5 w-5 text-purple-500" />
              <span className="text-xl font-bold">100%</span>
              <span className="text-gray-600 dark:text-gray-400">Secure Transactions</span>
            </motion.div>
            <motion.div 
              className="flex items-center gap-2"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Globe className="h-5 w-5 text-amber-500" />
              <span className="text-xl font-bold">Global</span>
              <span className="text-gray-600 dark:text-gray-400">Marketplace</span>
            </motion.div>
            <motion.div 
              className="flex items-center gap-2"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Users className="h-5 w-5 text-green-500" />
              <span className="text-xl font-bold">10,000+</span>
              <span className="text-gray-600 dark:text-gray-400">Active Users</span>
            </motion.div>
          </div>
        </motion.div>

        {/* Category tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {featureCategories.map((category) => (
            <motion.button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${activeCategory === category.id 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {category.name}
            </motion.button>
          ))}
        </div>

        {/* Features grid with animation */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {features.map((feature, index) => (
              <motion.div
                key={`${feature.category}-${index}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="h-full"
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <div className="h-full flex flex-col bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-shadow duration-300">
                  <div className="p-6 flex-1 flex flex-col">
                    <div className={`${feature.bgColor} w-12 h-12 rounded-lg flex items-center justify-center mb-4 shadow-lg`}>
                      {feature.icon}
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm flex-1">{feature.description}</p>
                    <div className="mt-4 pt-2 border-t border-gray-100 dark:border-gray-700">
                      <span className="text-xs text-blue-600 dark:text-blue-400 flex items-center gap-1 hover:underline cursor-pointer">
                        Learn more <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
        
        {/* Comparison table removed */}
      </div>
    </section>
  );
}
