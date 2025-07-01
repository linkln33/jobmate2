"use client";

import React from 'react';
import { LegalLayout } from '@/components/layout/legal-layout';

export default function CookiePolicy() {
  return (
    <LegalLayout
      title="Cookie Policy"
      description="How JobMate uses cookies and similar technologies on our platform."
    >
      
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">What Are Cookies</h2>
        <p className="mb-4">
          Cookies are small files stored on your device to help enhance browsing.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Why We Use Them</h2>
        <h3 className="text-xl font-medium mb-2">Essential cookies</h3>
        <p className="mb-4">
          Session management, login
        </p>

        <h3 className="text-xl font-medium mb-2">Functional cookies</h3>
        <p className="mb-4">
          Preferences, language
        </p>

        <h3 className="text-xl font-medium mb-2">Performance cookies</h3>
        <p className="mb-4">
          Analytics
        </p>

        <h3 className="text-xl font-medium mb-2">Marketing cookies</h3>
        <p className="mb-4">
          Job referral tracking
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Consent & Management</h2>
        <ul className="list-disc pl-5 space-y-2 mb-4">
          <li>Users consent on first visit via a banner</li>
          <li>You can disable non-essential cookies in browser settings</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Cookie List</h2>
        <ul className="list-disc pl-5 space-y-2 mb-4">
          <li><strong>_session, _auth:</strong> session and login</li>
          <li><strong>_analytics, _ga:</strong> performance</li>
          <li><strong>_ref:</strong> referral tracking</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Third‑Party Cookies</h2>
        <p className="mb-4">
          We use cookies from the following third-party services:
        </p>
        <ul className="list-disc pl-5 space-y-2 mb-4">
          <li>Stripe (payment)</li>
          <li>Supabase (auth, analytics)</li>
          <li>Google/Segment (analytics)</li>
          <li>Intercom or Chatbot</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Managing Your Cookie Preferences</h2>
        <p className="mb-4">
          Most web browsers allow you to manage your cookie preferences. You can:
        </p>
        <ul className="list-disc pl-5 space-y-2 mb-4">
          <li>Delete cookies from your device</li>
          <li>Block cookies by activating the setting on your browser that allows you to refuse all or some cookies</li>
          <li>Set your browser to notify you when you receive a cookie</li>
        </ul>
        <p className="mb-4">
          Please note that if you choose to block or delete cookies, you may not be able to access certain areas or features of our Platform.
        </p>
      </section>

      <div className="text-sm text-gray-500 mt-12">
        Last updated: July 2025
      </div>
    </LegalLayout>
  );
}
