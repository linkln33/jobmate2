"use client";

import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Moon, Sun, Menu, X } from 'lucide-react';

interface StickyNavbarProps {
  className?: string;
  hideDashboardButton?: boolean;
}

export function StickyNavbar({ className = '', hideDashboardButton = false }: StickyNavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const { isAuthenticated } = useAuth();
  
  const { scrollY } = useScroll();
  // Solid background that becomes visible on scroll
  const backgroundColor = useTransform(
    scrollY,
    [0, 100],
    ['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 0.95)']
  );
  // No blur effect
  const backdropFilter = useTransform(
    scrollY,
    [0, 100],
    ['none', 'none']
  );
  const boxShadow = useTransform(
    scrollY,
    [0, 100],
    ['none', '0 4px 20px rgba(0, 0, 0, 0.05)']
  );
  
  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };
  
  // Check system preference on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setDarkMode(isDarkMode);
      if (isDarkMode) {
        document.documentElement.classList.add('dark');
      }
    }
  }, []);

  return (
    <>
      <motion.nav
        className={cn(
          'fixed top-0 left-0 right-0 z-40 px-4 py-3 transition-all duration-300',
          className
        )}
        style={{
          backgroundColor: darkMode 
            ? 'rgba(17, 24, 39, 0.7)' 
            : backgroundColor,
          backdropFilter,
          boxShadow,
          // No gradient background image
          backgroundImage: 'none'
        }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo with AI Badge */}
          <Link href="/" className="flex items-center">
            <div className="flex items-center">
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
                JobMate
              </span>
              <span className="ml-1 text-xs bg-blue-500 text-white px-1.5 py-0.5 rounded-md font-medium">
                AI
              </span>
            </div>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="#features" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              Features
            </Link>
            <Link href="#how-it-works" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              How It Works
            </Link>
            <Link href="#marketplace" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              Marketplace
            </Link>
            <Link href="#testimonials" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              Testimonials
            </Link>
          </div>
          
          {/* Right side buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Dark mode toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              aria-label="Toggle dark mode"
            >
              {darkMode ? (
                <Sun className="h-5 w-5 text-gray-700 dark:text-gray-300" />
              ) : (
                <Moon className="h-5 w-5 text-gray-700 dark:text-gray-300" />
              )}
            </button>
            
            {/* Auth buttons */}
            {isAuthenticated ? (
              !hideDashboardButton && (
                <Link href="/dashboard">
                  <Button>Go to Dashboard</Button>
                </Link>
              )
            ) : (
              <div className="flex items-center space-x-2">
                <Link href="/login">
                  <Button variant="outline">Log In</Button>
                </Link>
                <Link href="/signup">
                  <Button>Sign Up</Button>
                </Link>
              </div>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-4">
            {/* Dark mode toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              aria-label="Toggle dark mode"
            >
              {darkMode ? (
                <Sun className="h-5 w-5 text-gray-700 dark:text-gray-300" />
              ) : (
                <Moon className="h-5 w-5 text-gray-700 dark:text-gray-300" />
              )}
            </button>
            
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6 text-gray-700 dark:text-gray-300" />
              ) : (
                <Menu className="h-6 w-6 text-gray-700 dark:text-gray-300" />
              )}
            </button>
          </div>
        </div>
      </motion.nav>
      
      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-16 left-0 right-0 z-30 bg-white dark:bg-gray-800 shadow-lg p-4 md:hidden"
          >
            <div className="flex flex-col space-y-4">
              <Link 
                href="#features" 
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Features
              </Link>
              <Link 
                href="#how-it-works" 
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                How It Works
              </Link>
              <Link 
                href="#marketplace" 
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Marketplace
              </Link>
              <Link 
                href="#testimonials" 
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Testimonials
              </Link>
              
              <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                {isAuthenticated ? (
                  !hideDashboardButton && (
                    <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                      <Button className="w-full">Go to Dashboard</Button>
                    </Link>
                  )
                ) : (
                  <div className="flex flex-col space-y-2">
                    <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="outline" className="w-full">Log In</Button>
                    </Link>
                    <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>
                      <Button className="w-full">Sign Up</Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
