"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { MarketplacePreviewCard } from '@/components/ui/marketplace-preview-card';
import { Button } from '@/components/ui/button';

export function MarketplaceSection() {
  const marketplaceItems = [
    {
      title: "Senior Frontend Developer",
      description: "Looking for an experienced React developer to join our growing team. Remote position with competitive salary.",
      category: "Tech",
      price: "$120-150k/yr",
      location: "Remote",
      type: "job",
      userName: "TechCorp Inc."
    },
    {
      title: "UI/UX Designer",
      description: "Creative designer needed for a 3-month project to redesign our mobile app interface and improve user experience.",
      category: "Design",
      price: "$85/hr",
      location: "New York, NY",
      type: "gig",
      userName: "DesignStudio"
    },
    {
      title: "Data Analysis & Visualization",
      description: "I'll transform your raw data into actionable insights with beautiful visualizations and detailed reports.",
      category: "Data",
      price: "From $500",
      location: "Worldwide",
      type: "service",
      userName: "DataVizPro",
      rating: 4.9
    },
    {
      title: "Marketing Consultant",
      description: "Strategic marketing consultant with 10+ years experience in SaaS and B2B sectors. Available for part-time roles.",
      category: "Marketing",
      price: "Negotiable",
      location: "Chicago, IL",
      type: "service",
      userName: "MarketingGuru",
      rating: 4.8
    }
  ];

  return (
    <section id="marketplace" className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="gradient-text from-blue-600 to-purple-600">
              Explore the Marketplace
            </span>
          </h2>
          <p className="text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
            Discover jobs, gigs, services, and more on our AI-powered marketplace that connects talent with opportunities.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {marketplaceItems.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <MarketplacePreviewCard
                title={item.title}
                description={item.description}
                category={item.category}
                price={item.price}
                location={item.location}
                type={item.type as any}
                userName={item.userName}
                rating={item.rating}
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
            Explore Full Marketplace
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
