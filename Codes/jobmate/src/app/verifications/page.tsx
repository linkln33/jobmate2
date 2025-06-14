"use client";

import { useState } from 'react';
import { MainLayout } from '@/components/layout/main-layout';
import { VerificationTabs } from '@/components/verification/verification-tabs';

export default function VerificationsPage() {
  return (
    <MainLayout>
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">
              Account Verification
            </h1>
            <p className="text-muted-foreground">
              Complete verification steps to unlock platform features
            </p>
          </div>
        </div>
        
        <VerificationTabs />
      </div>
    </MainLayout>
  );
}
