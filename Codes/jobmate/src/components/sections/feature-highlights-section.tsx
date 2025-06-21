"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { FeatureCard } from '@/components/ui/feature-card';
import { Brain, ShieldCheck, TrendingUp, Award, Layers, Database, Fingerprint, Zap, Sparkles, BarChart } from 'lucide-react';

export function FeatureHighlightsSection() {
  const features = [
    {
      icon: <Brain className="h-6 w-6 text-white" />,
      title: "Hyper-Personalized Matching",
      description: "Our proprietary AI analyzes 50+ data points to connect you with the perfect match for your specific needs",
      bgColor: "bg-gradient-to-br from-blue-500 to-blue-600"
    },
    {
      icon: <ShieldCheck className="h-6 w-6 text-white" />,
      title: "Advanced Escrow Protection",
      description: "Multi-stage escrow with milestone verification and automated dispute resolution using smart contracts",
      bgColor: "bg-gradient-to-br from-purple-500 to-purple-600"
    },
    {
      icon: <BarChart className="h-6 w-6 text-white" />,
      title: "Dynamic Pricing Engine",
      description: "AI-powered pricing recommendations based on market demand, skill level, and project complexity",
      bgColor: "bg-gradient-to-br from-indigo-500 to-indigo-600"
    },
    {
      icon: <Fingerprint className="h-6 w-6 text-white" />,
      title: "Verified Skills Marketplace",
      description: "All service providers undergo skill verification and background checks for maximum quality assurance",
      bgColor: "bg-gradient-to-br from-amber-500 to-amber-600"
    },
    {
      icon: <Layers className="h-6 w-6 text-white" />,
      title: "Cross-Category Integration",
      description: "Seamlessly combine services, gigs, and rentals in a single transaction with unified billing",
      bgColor: "bg-gradient-to-br from-green-500 to-green-600"
    },
    {
      icon: <Database className="h-6 w-6 text-white" />,
      title: "Blockchain Transaction Ledger",
      description: "Immutable record of all transactions with cryptographic verification for ultimate security and transparency",
      bgColor: "bg-gradient-to-br from-red-500 to-red-600"
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
            Next-Generation Marketplace Technology
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            JobMate leverages cutting-edge AI, blockchain security, and advanced verification systems to create a marketplace experience that outperforms traditional platforms in every dimension.
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
              className="h-full"
            >
              <div className="h-full flex flex-col bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700">
                <div className="p-6 flex-1 flex flex-col">
                  <div className={`${feature.bgColor} w-12 h-12 rounded-lg flex items-center justify-center mb-4 shadow-lg`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 flex-1">{feature.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
