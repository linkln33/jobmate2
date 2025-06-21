"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { MarketplacePreviewCard } from '@/components/ui/marketplace-preview-card';
import { Button } from '@/components/ui/button';

export function MarketplaceSection() {
  const marketplaceItems = [
    {
      title: "Fix My WiFi Network",
      description: "Need someone to troubleshoot and fix my home WiFi network that keeps dropping connection.",
      category: "Any Task",
      price: "$75",
      location: "San Francisco, CA",
      type: "task",
      userName: "HomeTechHelp"
    },
    {
      title: "Website Development",
      description: "Professional web development services for businesses of all sizes. Custom designs and mobile-responsive.",
      category: "Any Services",
      price: "From $1,000",
      location: "Remote",
      type: "service",
      userName: "WebDevPro",
      rating: 4.9
    },
    {
      title: "Professional Camera Kit",
      description: "Rent my complete Sony A7III camera kit with lenses, tripod, and lighting equipment for your project.",
      category: "Any Rentals",
      price: "$75/day",
      location: "Los Angeles, CA",
      type: "rental",
      userName: "CameraGear",
      rating: 4.8
    },
    {
      title: "Logo Design Package",
      description: "Quick, professional logo design with unlimited revisions. Perfect for startups and small businesses.",
      category: "Any Micro Job",
      price: "$150",
      location: "Worldwide",
      type: "gig",
      userName: "LogoCreative",
      rating: 5.0
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
              Explore Our Marketplace
            </span>
          </h2>
          <p className="text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
            Find services, tasks, rentals, and jobs all in one place - powered by AI matching and secure transactions.
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
