"use client";

import React from 'react';
import { LegalLayout } from '@/components/layout/legal-layout';

export default function PrivacyPolicy() {
  return (
    <LegalLayout
      title="Privacy Policy"
      description="How JobMate collects, uses, and protects your personal information."
    >
      
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Overview</h2>
        <p className="mb-4">
          JobMate respects your privacy and complies with GDPR and CCPA.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Data Collection Types</h2>
        <h3 className="text-xl font-medium mb-2">Personal Data</h3>
        <p className="mb-4">
          Name, email, phone, location, payment info
        </p>

        <h3 className="text-xl font-medium mb-2">Listing Data</h3>
        <p className="mb-4">
          User-generated content, categories, media
        </p>

        <h3 className="text-xl font-medium mb-2">Usage Data</h3>
        <p className="mb-4">
          Device info, IP, session logs
        </p>

        <h3 className="text-xl font-medium mb-2">Preference Data</h3>
        <p className="mb-4">
          Skills, availability, budget, agent configurations
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Data Usage</h2>
        <ul className="list-disc pl-5 space-y-2 mb-4">
          <li>To operate services, match listings, process payments, offer AI insights</li>
          <li>For analytics, A/B testing, communications and improvements</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Data Sharing</h2>
        <ul className="list-disc pl-5 space-y-2 mb-4">
          <li>Shared with Stripe, Supabase, email provider, analytics tools</li>
          <li>No sale of personal data</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Rights</h2>
        <ul className="list-disc pl-5 space-y-2 mb-4">
          <li>Access, rectify, delete your data</li>
          <li>Request export</li>
          <li>Opt out of cookies/marketing</li>
          <li>Lodge privacy complaints with relevant authorities</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Data Retention</h2>
        <ul className="list-disc pl-5 space-y-2 mb-4">
          <li>Retained while account exists + up to 3 years for records</li>
          <li>De-identified usage logs retained longer for analytics</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Security</h2>
        <ul className="list-disc pl-5 space-y-2 mb-4">
          <li>Encryption in transit (HTTPS) and at rest</li>
          <li>Access controls, backups, SOC‑2 style processes</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">GDPR & CCPA Compliance</h2>
        <p className="mb-4">
          JobMate is registered with the ICO (Information Commissioner's Office) and complies with both UK GDPR 
          and EU GDPR regulations, as well as CCPA for California residents.
        </p>
        <p className="mb-4">
          To exercise your rights under these regulations, please contact us at privacy@jobmate.app.
        </p>
      </section>

      <div className="text-sm text-gray-500 mt-12">
        Last updated: July 2025
      </div>
    </LegalLayout>
  );
}
