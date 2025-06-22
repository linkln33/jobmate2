"use client";

import React from 'react';
import { UnifiedDashboardLayout } from '@/components/layout/unified-dashboard-layout';
import { VerificationTabs } from '@/components/verification/verification-tabs';

export function UnifiedVerificationsPage() {
  return (
    <UnifiedDashboardLayout title="Account Verification - JobMate" showMap={false}>
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
    </UnifiedDashboardLayout>
  );
}
