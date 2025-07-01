"use client";

import React from 'react';
import { LegalLayout } from '@/components/layout/legal-layout';

export default function CompliancePage() {
  return (
    <LegalLayout
      title="Compliance & Security"
      description="How JobMate maintains regulatory compliance and protects your data."
    >
      
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Security Measures</h2>
        <ul className="list-disc pl-5 space-y-2 mb-4">
          <li>HTTPS with TLS encryption</li>
          <li>Database encrypted at rest</li>
          <li>Passwords hashed (bcrypt/Argon2)</li>
          <li>Role-based access controls</li>
          <li>Audit/sys logs for admin actions</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Infrastructure</h2>
        <ul className="list-disc pl-5 space-y-2 mb-4">
          <li>Vercel IP restrictions, supabase row-level policies</li>
          <li>Stripe KYC compliance</li>
          <li>Regular software updating and patching</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Compliance Standards</h2>
        <ul className="list-disc pl-5 space-y-2 mb-4">
          <li>GDPR compliance: data export/deletion, cookie consent</li>
          <li>CCPA compliance: access/deletion requests</li>
          <li>PCI DSS: via Stripe handling payment data</li>
          <li>Data Processing Agreement (DPA) with vendors</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Incident Response</h2>
        <p className="mb-4">
          Security incident plan, disclosure within 72 hours per GDPR
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Regular Audits</h2>
        <p className="mb-4">
          Annual security review and penetration testing
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Platform Role & Legal Positioning</h2>
        <p className="mb-4">
          JobMate is structured as a marketplace operator and payment facilitator, not a service provider or employer.
          We serve as a neutral platform connecting independent users and do not offer, sell, or employ for any services.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Payment Compliance</h2>
        <p className="mb-4">
          As we use Stripe Connect for payment processing, we adhere to Stripe's Terms of Service and Connect Platform Guidelines.
          We implement all required KYC (Know Your Customer) procedures for both our platform and connected accounts.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Consumer Rights Protection</h2>
        <p className="mb-4">
          We comply with UK and EU consumer protection laws, clearly indicating whether transactions are B2C or C2C,
          and showing whether users are registered as "Business" or "Individual" in their listings.
        </p>
      </section>

      <div className="text-sm text-gray-500 mt-12">
        Last updated: July 2025
      </div>
    </LegalLayout>
  );
}
