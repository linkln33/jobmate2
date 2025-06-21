"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { TestimonialCard } from '@/components/ui/testimonial-card';

export function TestimonialsSection() {
  const testimonials = [
    {
      quote: "JobMate's AI matched me with a job that perfectly aligned with my skills and career goals. The interview preparation was incredibly helpful and gave me the confidence I needed.",
      name: "Sarah Johnson",
      role: "Software Developer",
      avatarUrl: "https://randomuser.me/api/portraits/women/32.jpg",
      badges: ["Tech Industry", "Career Changer"]
    },
    {
      quote: "As a hiring manager, JobMate has revolutionized our recruitment process. The AI-vetted candidates have been consistently high quality, saving us countless hours.",
      name: "Michael Rodriguez",
      role: "HR Director",
      avatarUrl: "https://randomuser.me/api/portraits/men/54.jpg",
      badges: ["Enterprise", "Hiring Manager"]
    },
    {
      quote: "The resume optimization tool helped me highlight my transferable skills when switching industries. I received more interview requests in one week than I had in months!",
      name: "Emily Chen",
      role: "Marketing Specialist",
      avatarUrl: "https://randomuser.me/api/portraits/women/68.jpg",
      badges: ["Industry Switch", "Remote Work"]
    },
    {
      quote: "JobMate's salary negotiation coach gave me the data and confidence to ask for 15% more than I would have otherwise. That's real value!",
      name: "David Okafor",
      role: "Financial Analyst",
      avatarUrl: "https://randomuser.me/api/portraits/men/22.jpg",
      badges: ["Finance", "Negotiation Win"]
    },
    {
      quote: "As someone returning to the workforce after parental leave, JobMate's personalized approach helped me find flexible opportunities that matched my experience.",
      name: "Priya Sharma",
      role: "Project Manager",
      avatarUrl: "https://randomuser.me/api/portraits/women/89.jpg",
      badges: ["Work-Life Balance", "Returning Professional"]
    },
    {
      quote: "The AI interview coach prepared me for questions I never would have anticipated. When those exact topics came up in my real interview, I was ready!",
      name: "James Wilson",
      role: "UX Designer",
      avatarUrl: "https://randomuser.me/api/portraits/men/42.jpg",
      badges: ["Creative Field", "First Job"]
    }
  ];

  return (
    <section id="testimonials" className="py-24 relative overflow-hidden bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      {/* Background elements */}
      <div className="absolute top-20 right-20 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-20 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl" />
      
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
              Success Stories
            </span>
          </h2>
          <p className="text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
            Hear from professionals and employers who have transformed their hiring and job search experience with JobMate.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <TestimonialCard
                quote={testimonial.quote}
                name={testimonial.name}
                role={testimonial.role}
                badges={testimonial.badges}
                variant={index === 1 ? 'highlight' : 'default'}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
