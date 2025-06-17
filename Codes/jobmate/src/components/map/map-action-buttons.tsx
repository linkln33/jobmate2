"use client";

import { CheckCircle2, ThumbsUp, DollarSign, Clock } from 'lucide-react';

interface MapActionButtonsProps {
  showAccepted: boolean;
  showSuggested: boolean;
  showHighestPay: boolean;
  showNewest: boolean;
  onToggleAccepted: () => void;
  onToggleSuggested: () => void;
  onToggleHighestPay: () => void;
  onToggleNewest: () => void;
}

export function MapActionButtons({
  showAccepted,
  showSuggested,
  showHighestPay,
  showNewest,
  onToggleAccepted,
  onToggleSuggested,
  onToggleHighestPay,
  onToggleNewest
}: MapActionButtonsProps) {
  return (
    <div className="absolute top-1/4 right-4 z-10 flex flex-col gap-2">
      <button
        onClick={onToggleAccepted}
        style={{
          backgroundColor: showAccepted ? 'rgba(34, 197, 94, 0.9)' : 'rgba(255, 255, 255, 0.9)',
          border: '1px solid rgba(34, 197, 94, 0.9)',
          borderRadius: '4px',
          width: '40px',
          height: '40px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          cursor: 'pointer'
        }}
        aria-label="Show accepted jobs"
      >
        <CheckCircle2 
          style={{ 
            color: showAccepted ? 'white' : 'rgba(34, 197, 94, 0.9)',
            width: '20px', 
            height: '20px' 
          }} 
        />
      </button>
      
      <button
        onClick={onToggleSuggested}
        style={{
          backgroundColor: showSuggested ? 'rgba(59, 130, 246, 0.9)' : 'rgba(255, 255, 255, 0.9)',
          border: '1px solid rgba(59, 130, 246, 0.9)',
          borderRadius: '4px',
          width: '40px',
          height: '40px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          cursor: 'pointer'
        }}
        aria-label="Show suggested jobs"
      >
        <ThumbsUp 
          style={{ 
            color: showSuggested ? 'white' : 'rgba(59, 130, 246, 0.9)',
            width: '20px', 
            height: '20px' 
          }} 
        />
      </button>
      
      <button
        onClick={onToggleHighestPay}
        style={{
          backgroundColor: showHighestPay ? 'rgba(245, 158, 11, 0.9)' : 'rgba(255, 255, 255, 0.9)',
          border: '1px solid rgba(245, 158, 11, 0.9)',
          borderRadius: '4px',
          width: '40px',
          height: '40px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          cursor: 'pointer'
        }}
        aria-label="Show highest paying jobs"
      >
        <DollarSign 
          style={{ 
            color: showHighestPay ? 'white' : 'rgba(245, 158, 11, 0.9)',
            width: '20px', 
            height: '20px' 
          }} 
        />
      </button>
      
      <button
        onClick={onToggleNewest}
        style={{
          backgroundColor: showNewest ? 'rgba(168, 85, 247, 0.9)' : 'rgba(255, 255, 255, 0.9)',
          border: '1px solid rgba(168, 85, 247, 0.9)',
          borderRadius: '4px',
          width: '40px',
          height: '40px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          cursor: 'pointer'
        }}
        aria-label="Show newest jobs"
      >
        <Clock 
          style={{ 
            color: showNewest ? 'white' : 'rgba(168, 85, 247, 0.9)',
            width: '20px', 
            height: '20px' 
          }} 
        />
      </button>
    </div>
  );
}
