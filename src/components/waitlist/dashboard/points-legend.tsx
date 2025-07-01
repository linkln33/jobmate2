"use client";

import React from 'react';
import { Info, Star, Users, Award } from 'lucide-react';

interface PointsRule {
  title: string;
  points: number;
  description: string;
  icon: React.ReactNode;
}

const pointsRules: PointsRule[] = [
  {
    title: 'Join Waitlist',
    points: 10,
    description: 'Sign up for the JobMate waitlist',
    icon: <Star className="text-blue-500" size={18} />
  },
  {
    title: 'Referral Signup',
    points: 15,
    description: 'Each person who signs up using your referral link',
    icon: <Users className="text-purple-500" size={18} />
  },
  {
    title: 'Top 10 Position',
    points: 50,
    description: 'Bonus for reaching the top 10 on the leaderboard',
    icon: <Award className="text-green-500" size={18} />
  },
  {
    title: 'Social Share',
    points: 5,
    description: 'Share your referral link on social media',
    icon: <Info className="text-pink-500" size={18} />
  }
];

interface PointsLegendProps {
  className?: string;
}

export const PointsLegend: React.FC<PointsLegendProps> = ({ className = '' }) => {
  return (
    <div className={`${className}`}>
      <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">How to Earn Points</h3>
      <div className="space-y-3">
        {pointsRules.map((rule, index) => (
          <div 
            key={index} 
            className="flex items-center p-2 rounded-lg bg-white dark:bg-gray-800 bg-opacity-50 dark:bg-opacity-40 border border-gray-100 dark:border-gray-700 border-opacity-30 dark:border-opacity-30 transition-all duration-200 hover:bg-opacity-70 dark:hover:bg-opacity-50"
          >
            <div className="mr-3 p-2 rounded-full bg-gray-100 dark:bg-gray-700">
              {rule.icon}
            </div>
            <div className="flex-1">
              <div className="flex justify-between">
                <span className="font-medium text-gray-900 dark:text-white">{rule.title}</span>
                <span className="font-bold text-blue-600 dark:text-blue-400">+{rule.points} pts</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">{rule.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
