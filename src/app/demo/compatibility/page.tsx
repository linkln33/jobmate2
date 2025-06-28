import React from 'react';
import CompatibilityExample from '@/components/compatibility/CompatibilityExample';

export default function CompatibilityDemoPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-gray-900">JobMate Compatibility Score System</h1>
        </div>
      </header>
      
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <CompatibilityExample />
        </div>
      </main>
    </div>
  );
}
