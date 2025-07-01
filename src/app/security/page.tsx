"use client";

import React from 'react';
import { LegalLayout } from '@/components/layout/legal-layout';

export default function SecurityPage() {
  return (
    <LegalLayout
      title="Security"
      description="How JobMate protects your data and ensures platform security."
    >
      
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Our Security Commitment</h2>
        <p className="mb-4">
          At JobMate, we prioritize the security of your data and transactions. We implement industry-standard 
          security measures and continuously monitor our systems to protect against unauthorized access, 
          disclosure, alteration, and destruction of your information.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Data Protection</h2>
        <ul className="list-disc pl-5 space-y-2 mb-4">
          <li>All data is encrypted in transit using HTTPS with TLS</li>
          <li>Sensitive data is encrypted at rest in our databases</li>
          <li>Regular security assessments and penetration testing</li>
          <li>Strict access controls and authentication protocols</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Account Security</h2>
        <ul className="list-disc pl-5 space-y-2 mb-4">
          <li>Passwords are securely hashed using bcrypt/Argon2</li>
          <li>Multi-factor authentication options</li>
          <li>Session management with automatic timeouts</li>
          <li>Account activity monitoring for suspicious behavior</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Payment Security</h2>
        <p className="mb-4">
          We partner with Stripe, a PCI-DSS compliant payment processor, to ensure that all payment 
          information is handled securely. JobMate does not store your full credit card details on our servers.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Security Practices</h2>
        <ul className="list-disc pl-5 space-y-2 mb-4">
          <li>Regular security updates and patches</li>
          <li>Comprehensive audit logging and monitoring</li>
          <li>Employee security training and access controls</li>
          <li>Incident response plan with 72-hour notification policy</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Reporting Security Issues</h2>
        <p className="mb-4">
          If you discover a security vulnerability or have concerns about the security of your account, 
          please contact our security team immediately at security@jobmate.app.
        </p>
      </section>

      <div className="text-sm text-gray-500 mt-12">
        Last updated: July 2025
      </div>
    </LegalLayout>
  );
}
