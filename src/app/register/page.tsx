"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterRedirect() {
  const router = useRouter();
  
  useEffect(() => {
    // Redirect to signup page
    router.replace('/signup');
  }, [router]);
  
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <p className="text-lg">Redirecting to signup page...</p>
      </div>
    </div>
  );
}
