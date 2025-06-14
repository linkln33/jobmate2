"use client";

import React from "react";
import Link from "next/link";
import { Facebook, Instagram, Twitter, Linkedin, Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-background border-t">
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {/* Logo and Description */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-brand-500">JobMate</span>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground max-w-md">
              JobMate connects customers with skilled specialists for home services, repairs, and maintenance.
              Find trusted professionals in your area or offer your services to those who need them.
            </p>
            <div className="mt-6 flex space-x-4">
              <Button variant="ghost" size="icon" className="rounded-full">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold">Quick Links</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/about" className="text-sm text-muted-foreground hover:text-brand-500">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="text-sm text-muted-foreground hover:text-brand-500">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-sm text-muted-foreground hover:text-brand-500">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-sm text-muted-foreground hover:text-brand-500">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-sm text-muted-foreground hover:text-brand-500">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* For Customers */}
          <div>
            <h3 className="text-sm font-semibold">For Customers</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/jobs/create" className="text-sm text-muted-foreground hover:text-brand-500">
                  Post a Job
                </Link>
              </li>
              <li>
                <Link href="/search" className="text-sm text-muted-foreground hover:text-brand-500">
                  Find Specialists
                </Link>
              </li>
              <li>
                <Link href="/categories" className="text-sm text-muted-foreground hover:text-brand-500">
                  Browse Services
                </Link>
              </li>
              <li>
                <Link href="/customer-guide" className="text-sm text-muted-foreground hover:text-brand-500">
                  Customer Guide
                </Link>
              </li>
            </ul>
          </div>

          {/* For Specialists */}
          <div>
            <h3 className="text-sm font-semibold">For Specialists</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/register?role=specialist" className="text-sm text-muted-foreground hover:text-brand-500">
                  Join as Specialist
                </Link>
              </li>
              <li>
                <Link href="/jobs" className="text-sm text-muted-foreground hover:text-brand-500">
                  Find Jobs
                </Link>
              </li>
              <li>
                <Link href="/specialist-guide" className="text-sm text-muted-foreground hover:text-brand-500">
                  Specialist Guide
                </Link>
              </li>
              <li>
                <Link href="/success-stories" className="text-sm text-muted-foreground hover:text-brand-500">
                  Success Stories
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Contact Information */}
        <div className="mt-8 pt-8 border-t">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center space-x-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">support@jobmate.app</span>
            </div>
            <div className="flex items-center space-x-2 mt-2 md:mt-0">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">+1 (555) 123-4567</span>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <p className="text-xs text-muted-foreground">
              &copy; {currentYear} JobMate. All rights reserved.
            </p>
            <div className="mt-4 md:mt-0 flex space-x-4">
              <Link href="/terms" className="text-xs text-muted-foreground hover:text-brand-500">
                Terms of Service
              </Link>
              <Link href="/privacy" className="text-xs text-muted-foreground hover:text-brand-500">
                Privacy Policy
              </Link>
              <Link href="/cookies" className="text-xs text-muted-foreground hover:text-brand-500">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
