"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight, Moon, Sun } from 'lucide-react';
import { Footer } from './footer';
import { Button } from '@/components/ui/button';

interface LegalLayoutProps {
  children: React.ReactNode;
  title: string;
  description?: string;
}

export function LegalLayout({ children, title, description }: LegalLayoutProps) {
  const [darkMode, setDarkMode] = React.useState(false);
  
  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };
  
  // Check system preference on mount
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setDarkMode(isDarkMode);
      if (isDarkMode) {
        document.documentElement.classList.add('dark');
      }
    }
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header/Navbar */}
      <header className="sticky top-0 z-40 w-full bg-white dark:bg-gray-900 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-2">
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">JobMate</span>
                <span className="text-xs bg-blue-500 text-white px-1.5 py-0.5 rounded-md font-medium">AI</span>
              </Link>
            </div>
            
            {/* Main Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/features" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                Features
              </Link>
              <Link href="/how-it-works" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                How It Works
              </Link>
              <Link href="/pricing" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                Pricing
              </Link>
              <Link href="/marketplace" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                Marketplace
              </Link>
              <Link href="/testimonials" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                Testimonials
              </Link>
            </nav>
            
            {/* Right side buttons */}
            <div className="flex items-center space-x-4">
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
              <div className="hidden md:flex items-center space-x-2">
                <Link href="/login">
                  <Button variant="ghost">Log In</Button>
                </Link>
                <Link href="/signup">
                  <Button>Sign Up</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </header>
      
      {/* Page header with breadcrumb */}
      <div className="bg-gradient-to-r from-brand-50 to-brand-100 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col space-y-2">
            {/* Breadcrumb */}
            <nav className="flex" aria-label="Breadcrumb">
              <ol className="inline-flex items-center space-x-1 md:space-x-3">
                <li className="inline-flex items-center">
                  <Link href="/" className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-brand-500 dark:text-gray-400 dark:hover:text-brand-400">
                    Home
                  </Link>
                </li>
                <li>
                  <div className="flex items-center">
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                    <span className="ml-1 text-sm font-medium text-gray-500 dark:text-gray-400">{title}</span>
                  </div>
                </li>
              </ol>
            </nav>
            
            {/* Title */}
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{title}</h1>
            
            {/* Description (if provided) */}
            {description && (
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl">
                {description}
              </p>
            )}
          </div>
        </div>
      </div>
      
      {/* Legal navigation sidebar */}
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar navigation */}
          <div className="lg:col-span-1">
            <div className="sticky top-20">
              <h3 className="text-lg font-semibold mb-4">Legal Documents</h3>
              <nav className="flex flex-col space-y-1">
                <Link 
                  href="/terms" 
                  className={`px-3 py-2 rounded-md text-sm ${
                    title === 'Terms of Service' 
                      ? 'bg-brand-50 text-brand-600 font-medium dark:bg-gray-800 dark:text-brand-400' 
                      : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                  }`}
                >
                  Terms of Service
                </Link>
                <Link 
                  href="/privacy" 
                  className={`px-3 py-2 rounded-md text-sm ${
                    title === 'Privacy Policy' 
                      ? 'bg-brand-50 text-brand-600 font-medium dark:bg-gray-800 dark:text-brand-400' 
                      : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                  }`}
                >
                  Privacy Policy
                </Link>
                <Link 
                  href="/cookies" 
                  className={`px-3 py-2 rounded-md text-sm ${
                    title === 'Cookie Policy' 
                      ? 'bg-brand-50 text-brand-600 font-medium dark:bg-gray-800 dark:text-brand-400' 
                      : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                  }`}
                >
                  Cookie Policy
                </Link>
                <Link 
                  href="/compliance" 
                  className={`px-3 py-2 rounded-md text-sm ${
                    title === 'Compliance & Security' 
                      ? 'bg-brand-50 text-brand-600 font-medium dark:bg-gray-800 dark:text-brand-400' 
                      : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                  }`}
                >
                  Compliance
                </Link>
                <Link 
                  href="/security" 
                  className={`px-3 py-2 rounded-md text-sm ${
                    title === 'Security' 
                      ? 'bg-brand-50 text-brand-600 font-medium dark:bg-gray-800 dark:text-brand-400' 
                      : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                  }`}
                >
                  Security
                </Link>
              </nav>
            </div>
          </div>
          
          {/* Main content */}
          <div className="lg:col-span-3">
            <div className="prose prose-brand max-w-none dark:prose-invert">
              {children}
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );
}
