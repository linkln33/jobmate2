"use client";

import { useState } from 'react';
import { MainLayout } from '@/components/layout/main-layout';
import { SocialConnectionsContent } from '@/components/social/social-connections-content';

export default function SocialConnectionsPage() {
  return (
    <MainLayout>
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">
              Social Media Connections
            </h1>
            <p className="text-muted-foreground">
              Connect your social media accounts to enhance your profile and reach
            </p>
          </div>
        </div>
        
        <SocialConnectionsContent />
      </div>
    </MainLayout>
  );
}
