"use client";

import React from 'react';
import { cn } from '@/lib/utils';
import { Check, X } from 'lucide-react';

interface ComparisonFeature {
  name: string;
  jobmate: boolean;
  upwork: boolean;
  taskRabbit: boolean;
  airtasker: boolean;
  fiverr: boolean;
}

interface ComparisonTableProps {
  features: ComparisonFeature[];
  className?: string;
}

export function ComparisonTable({ features, className = '' }: ComparisonTableProps) {
  const platforms = [
    { name: 'JobMate', key: 'jobmate' },
    { name: 'Upwork', key: 'upwork' },
    { name: 'TaskRabbit', key: 'taskRabbit' },
    { name: 'Airtasker', key: 'airtasker' },
    { name: 'Fiverr', key: 'fiverr' },
  ];

  return (
    <div className={cn('overflow-x-auto glass-card rounded-xl', className)}>
      <table className="w-full min-w-[800px]">
        <thead>
          <tr className="border-b border-gray-200 dark:border-gray-700">
            <th className="py-4 px-6 text-left text-gray-500 dark:text-gray-400 font-medium">Feature</th>
            {platforms.map((platform) => (
              <th 
                key={platform.key} 
                className={cn(
                  "py-4 px-6 text-center font-semibold",
                  platform.key === 'jobmate' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'
                )}
              >
                {platform.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {features.map((feature, index) => (
            <tr 
              key={index} 
              className={cn(
                "border-b border-gray-200 dark:border-gray-700",
                index % 2 === 0 ? 'bg-white/30 dark:bg-gray-800/30' : 'bg-white/10 dark:bg-gray-800/10'
              )}
            >
              <td className="py-4 px-6 font-medium">{feature.name}</td>
              {platforms.map((platform) => {
                const hasFeature = feature[platform.key as keyof ComparisonFeature];
                return (
                  <td key={platform.key} className="py-4 px-6 text-center">
                    {hasFeature ? (
                      <div className="flex justify-center">
                        <Check 
                          className={cn(
                            "w-5 h-5",
                            platform.key === 'jobmate' 
                              ? 'text-blue-500 dark:text-blue-400' 
                              : 'text-green-500 dark:text-green-400'
                          )} 
                        />
                      </div>
                    ) : (
                      <div className="flex justify-center">
                        <X className="w-5 h-5 text-red-500 dark:text-red-400" />
                      </div>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="text-xs text-gray-500 dark:text-gray-400 p-4 text-center">
        All logos belong to their respective owners. This comparison is based on publicly available information.
      </div>
    </div>
  );
}
