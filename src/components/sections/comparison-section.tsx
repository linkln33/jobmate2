"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { ComparisonTable } from '@/components/ui/comparison-table';

export function ComparisonSection() {
  const features = [
    {
      name: "AI Skill Matching",
      jobmate: true,
      upwork: false,
      taskRabbit: false,
      airtasker: false,
      fiverr: false
    },
    {
      name: "Dual User Roles",
      jobmate: true,
      upwork: false,
      taskRabbit: false,
      airtasker: false,
      fiverr: false
    },
    {
      name: "Smart Contracts & Escrow",
      jobmate: true,
      upwork: true,
      taskRabbit: false,
      airtasker: false,
      fiverr: false
    },
    {
      name: "Rentals Marketplace",
      jobmate: true,
      upwork: false,
      taskRabbit: true,
      airtasker: false,
      fiverr: false
    },
    {
      name: "Proposal Builder",
      jobmate: true,
      upwork: false,
      taskRabbit: false,
      airtasker: false,
      fiverr: false
    },
    {
      name: "Multilingual Support",
      jobmate: true,
      upwork: true,
      taskRabbit: false,
      airtasker: false,
      fiverr: true
    },
    {
      name: "Reputation System",
      jobmate: true,
      upwork: true,
      taskRabbit: true,
      airtasker: true,
      fiverr: true
    }
  ];

  return (
    <section id="comparison" className="py-16 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-3">
            <span className="gradient-text from-blue-600 to-purple-600">
              Why Choose JobMate?
            </span>
          </h2>
          <p className="text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
            See how JobMate compares to other platforms and discover the advantages of our hybrid marketplace with AI-powered matching.
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="glassmorphism-container relative z-10 rounded-xl overflow-hidden"
          style={{
            background: 'rgba(173, 216, 230, 0.08)',
            backdropFilter: 'blur(15px)',
            border: '1px solid rgba(173, 216, 230, 0.2)',
            boxShadow: '0 4px 12px 0 rgba(31, 38, 135, 0.08)',
            transition: 'all 0.3s ease-in-out'
          }}
          whileHover={{
            y: -8,
            boxShadow: '0 15px 30px 0 rgba(31, 38, 135, 0.1)'
          }}
        >
          <ComparisonTable features={features} className="" />
        </motion.div>
      </div>
    </section>
  );
}
