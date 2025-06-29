"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MarketplacePreviewCard } from '@/components/ui/marketplace-preview-card';
import { Button } from '@/components/ui/button';
import { marketplaceListings } from '@/data/marketplace-listings';

export function MarketplaceSection() {
  const [featuredListings, setFeaturedListings] = useState(marketplaceListings.slice(0, 8));
  
  // Format listing data for preview cards
  const formatListingForPreview = (listing: any) => {
    return {
      title: listing.title,
      description: listing.description,
      category: listing.category,
      price: typeof listing.price === 'number' ? `$${listing.price}${listing.priceUnit ? `/${listing.priceUnit}` : ''}` : listing.price,
      location: listing.address ? listing.address.split(',').slice(-2).join(',').trim() : 'Remote',
      type: listing.type,
      userName: listing.user?.name || listing.sellerName || 'JobMate User',
      rating: listing.sellerRating ? Number(listing.sellerRating) : Number((Math.random() * (5 - 4) + 4).toFixed(1)),
      imageUrl: listing.imageUrl
    };
  };
  
  // Shuffle array for randomized display
  useEffect(() => {
    const shuffled = [...marketplaceListings]
      .sort(() => 0.5 - Math.random())
      .slice(0, 8);
    setFeaturedListings(shuffled);
  }, []);

  return (
    <section id="marketplace" className="py-16 pb-12 relative overflow-hidden">
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
              Explore Our Marketplace
            </span>
          </h2>
          <p className="text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
            Find services, tasks, rentals, and jobs all in one place - powered by AI matching and secure transactions.
          </p>
        </motion.div>
        
        <motion.div
          className="relative mb-10 overflow-hidden glassmorphism-container rounded-xl py-6"
          style={{
            background: 'rgba(173, 216, 230, 0.08)',
            backdropFilter: 'blur(15px)',
            border: '1px solid rgba(173, 216, 230, 0.2)',
            boxShadow: '0 4px 12px 0 rgba(31, 38, 135, 0.08)',
            transition: 'all 0.3s ease-in-out'
          }}
          whileHover={{
            y: -5,
            boxShadow: '0 12px 24px 0 rgba(31, 38, 135, 0.1)'
          }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex overflow-x-auto pb-4 hide-scrollbar">
            <div className="flex gap-6 px-4 animate-scroll">
              {[...featuredListings, ...featuredListings].map((listing, index) => {
                const item = formatListingForPreview(listing);
                return (
                  <div 
                    key={`${listing.id}-${index}`} 
                    className="flex-shrink-0 w-72"
                  >
                    <MarketplacePreviewCard
                      title={item.title}
                      description={item.description}
                      category={item.category}
                      price={item.price}
                      location={item.location}
                      type={item.type as any}
                      userName={item.userName}
                      rating={item.rating as number}
                      imageUrl={item.imageUrl}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
        
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
