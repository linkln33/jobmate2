'use client';

import { useState, useEffect } from 'react';
import { X, Gift } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface ReferralNotificationProps {
  referrerName?: string;
  onClose: () => void;
}

export function ReferralNotification({ 
  referrerName = 'Someone', 
  onClose 
}: ReferralNotificationProps) {
  const [isVisible, setIsVisible] = useState(true);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 300); // Allow animation to complete
  };

  return (
    <div className={`fixed bottom-4 right-4 z-50 transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <Card className="p-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg max-w-md border-none">
        <div className="flex items-start gap-3">
          <div className="bg-white/20 p-2 rounded-full">
            <Gift className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-lg">You were referred!</h4>
            <p className="text-sm opacity-90 mt-1">
              {referrerName} referred you to JobMate. Complete your first transaction to give them a reward!
            </p>
            <div className="mt-3 flex items-center gap-2">
              <Button 
                variant="secondary" 
                size="sm" 
                className="bg-white/20 hover:bg-white/30 text-white border-none"
              >
                Learn More
              </Button>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-6 w-6 p-0 text-white opacity-70 hover:opacity-100 hover:bg-transparent"
            onClick={handleClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </Card>
    </div>
  );
}
