"use client";

import React from 'react';
import { LegalLayout } from '@/components/layout/legal-layout';

export default function TermsOfService() {
  return (
    <LegalLayout 
      title="Terms of Service"
      description="These terms govern your use of JobMate's AI-driven marketplace platform."
    >
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Introduction & Acceptance</h2>
        <p className="mb-4">
          These Terms of Service govern use of JobMate, the AI-driven marketplace platform ("Platform"). 
          By using the Platform, you agree to follow these terms. JobMate facilitates secure payments 
          through Stripe Connect; JobMate itself does not hold funds.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Platform Use</h2>
        <p className="mb-4">
          Users can register, create listings (jobs, services, rentals, items, favors, learning, etc.), 
          search, match, message, and complete transactions.
        </p>
        <p className="mb-4">
          JobMate offers compatibility scoring, AI assistant "Agents," referrals, and analytics.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Payment & Fees</h2>
        <p className="mb-4">
          All payments are processed via Stripe Connect—JobMate does not hold funds.
        </p>
        <p className="mb-4">
          Providers receive payout after task completion; JobMate deducts fees with each transaction.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">User Responsibilities & Content</h2>
        <ul className="list-disc pl-5 space-y-2 mb-4">
          <li>You must provide accurate and legal information.</li>
          <li>You are fully responsible for your listings & transactions.</li>
          <li>No illegal, harmful, or misrepresented listings or activity.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Referrals & Rewards</h2>
        <ul className="list-disc pl-5 space-y-2 mb-4">
          <li>You may earn referral bonuses if a new user you referred transacts.</li>
          <li>JobMate defines bonus rules in-platform; users agree to abide by them.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">AI Agents & Insights</h2>
        <ul className="list-disc pl-5 space-y-2 mb-4">
          <li>Your use of AI Agents is voluntary.</li>
          <li>JobMate provides guidance based on collected preferences—agents are not perfect and based on estimates.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Disclaimers & Limitation of Liability</h2>
        <ul className="list-disc pl-5 space-y-2 mb-4">
          <li>JobMate is not responsible for disputes, misrepresentations, or losses.</li>
          <li>Use Platform at your own risk.</li>
          <li>Liability is limited to the amount you paid to JobMate in the past 12 months.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Termination & Suspension</h2>
        <p className="mb-4">
          JobMate may suspend or terminate accounts at any time for TOS violations.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Governing Law & Dispute Resolution</h2>
        <p className="mb-4">
          Governed by the laws of the United Kingdom, disputes resolved by arbitration.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Platform Role & Legal Positioning</h2>
        <p className="mb-4">
          JobMate is a neutral platform connecting independent users. It does not offer, sell, 
          or employ for any services.
        </p>
      </section>

      <div className="text-sm text-gray-500 mt-12">
        Last updated: July 2025
      </div>
    </LegalLayout>
  );
}
