"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { StepCard } from '@/components/ui/step-card';
import { Search, FileText, MessageSquare, Briefcase } from 'lucide-react';

export function HowItWorksSection() {
  const steps = [
    {
      icon: <Search className="h-6 w-6 text-blue-500" />,
      title: "Create Your Profile",
      description: "Build your AI-enhanced profile highlighting your skills, experience, and career goals."
    },
    {
      icon: <FileText className="h-6 w-6 text-purple-500" />,
      title: "Get Matched",
      description: "Our AI algorithm matches you with the most relevant job opportunities."
    },
    {
      icon: <MessageSquare className="h-6 w-6 text-indigo-500" />,
      title: "Prepare & Apply",
      description: "Use our AI tools to optimize your resume and prepare for interviews."
    },
    {
      icon: <Briefcase className="h-6 w-6 text-green-500" />,
      title: "Land Your Dream Job",
      description: "Accept offers and start your new career journey with confidence."
    }
  ];

  return (
    <section className="py-16">
      <div className="container px-4 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            How JobMate Works
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Our AI-powered platform simplifies your job search journey from start to finish.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <StepCard
                step={index + 1}
                icon={step.icon}
                title={step.title}
                description={step.description}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
