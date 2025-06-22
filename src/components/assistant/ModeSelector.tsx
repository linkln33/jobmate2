'use client';

import React from 'react';
import { AssistantMode } from '@/contexts/AssistantContext/types';

interface ModeSelectorProps {
  currentMode: AssistantMode;
  onModeChange: (mode: AssistantMode) => void;
}

const modeOptions: { value: AssistantMode; label: string; icon: string }[] = [
  { value: 'MATCHING', label: 'Matching', icon: '🔍' },
  { value: 'PROJECT_SETUP', label: 'Projects', icon: '🛠️' },
  { value: 'PAYMENTS', label: 'Payments', icon: '💰' },
  { value: 'PROFILE', label: 'Profile', icon: '👤' },
  { value: 'MARKETPLACE', label: 'Market', icon: '🏪' },
  { value: 'GENERAL', label: 'General', icon: '💡' },
];

const ModeSelector: React.FC<ModeSelectorProps> = ({ currentMode, onModeChange }) => {
  return (
    <div className="border-b overflow-x-auto">
      <div className="flex p-1 min-w-max">
        {modeOptions.map((mode) => (
          <button
            key={mode.value}
            onClick={() => onModeChange(mode.value)}
            className={`px-3 py-2 text-sm rounded-md flex items-center space-x-1 whitespace-nowrap transition-colors ${
              currentMode === mode.value
                ? 'bg-blue-100 text-blue-800 font-medium'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <span>{mode.icon}</span>
            <span>{mode.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ModeSelector;
