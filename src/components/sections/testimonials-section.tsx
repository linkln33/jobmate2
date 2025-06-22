"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { TestimonialCard } from '@/components/ui/testimonial-card';

export function TestimonialsSection() {
  const testimonials = [
    {
      quote: "JobMate's AI matched me with clients who needed exactly the web development services I offer. The proposal builder helped me win more projects than ever before.",
      name: "Sarah Johnson",
      role: "Freelance Developer",
      avatarUrl: "https://randomuser.me/api/portraits/women/32.jpg",
      badges: ["Service Provider", "Tech Services"]
    },
    {
      quote: "As a small business owner, JobMate has revolutionized how I find skilled professionals. The escrow system gives me peace of mind when hiring freelancers.",
      name: "Michael Rodriguez",
      role: "Business Owner",
      avatarUrl: "https://randomuser.me/api/portraits/men/54.jpg",
      badges: ["Customer", "Small Business"]
    },
    {
      quote: "I've been able to rent out my camera equipment when I'm not using it, creating a nice passive income stream. The secure payment system makes transactions worry-free.",
      name: "Emily Chen",
      role: "Photographer",
      avatarUrl: "https://randomuser.me/api/portraits/women/68.jpg",
      badges: ["Rentals", "Equipment Owner"]
    },
    {
      quote: "JobMate's negotiation tools helped me secure better rates for my consulting services. The milestone payment system ensures I get paid fairly for completed work.",
      name: "David Okafor",
      role: "Business Consultant",
      avatarUrl: "https://randomuser.me/api/portraits/men/22.jpg",
      badges: ["Service Provider", "Negotiation Win"]
    },
    {
      quote: "As someone with a busy schedule, JobMate's marketplace made it easy to find local help for home renovation projects. I could compare quotes and reviews all in one place.",
      name: "Priya Sharma",
      role: "Homeowner",
      avatarUrl: "https://randomuser.me/api/portraits/women/89.jpg",
      badges: ["Customer", "Local Services"]
    },
    {
      quote: "The AI assistant helped me create a compelling service listing that highlighted my design skills. I've connected with clients globally that I never would have found otherwise!",
      name: "James Wilson",
      role: "UX Designer",
      avatarUrl: "https://randomuser.me/api/portraits/men/42.jpg",
      badges: ["Service Provider", "Creative Field"]
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
              Marketplace Success Stories
            </span>
          </h2>
          <p className="text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
            Hear from service providers and customers who have transformed their business and hiring experience with our AI-powered marketplace.
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
