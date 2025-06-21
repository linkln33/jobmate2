"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { FeatureCard } from '@/components/ui/feature-card';
import { Briefcase, Search, MessageSquare, Award, TrendingUp, Shield } from 'lucide-react';

export function FeatureHighlightsSection() {
  const features = [
    {
      icon: <Search className="h-6 w-6 text-blue-500" />,
      title: "Smart Job Search",
      description: "AI-powered job matching that understands your skills and career goals"
    },
    {
      icon: <MessageSquare className="h-6 w-6 text-purple-500" />,
      title: "Interview Prep",
      description: "Practice with our AI interviewer and get personalized feedback"
    },
    {
      icon: <Briefcase className="h-6 w-6 text-indigo-500" />,
      title: "Career Planning",
      description: "Map your career path with personalized recommendations"
    },
    {
      icon: <Award className="h-6 w-6 text-green-500" />,
      title: "Skill Assessment",
      description: "Identify your strengths and areas for improvement"
    },
    {
      icon: <TrendingUp className="h-6 w-6 text-orange-500" />,
      title: "Salary Insights",
      description: "Get real-time salary data for your industry and location"
    },
    {
      icon: <Shield className="h-6 w-6 text-red-500" />,
      title: "Privacy Protection",
      description: "Your data is always secure and under your control"
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-b from-transparent to-gray-50 dark:to-gray-900/30">
      <div className="container px-4 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Supercharge Your Job Search
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            JobMate combines cutting-edge AI with human expertise to help you find and land your dream job faster.
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
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
