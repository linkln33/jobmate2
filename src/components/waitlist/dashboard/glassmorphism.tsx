/**
 * Glassmorphism UI components for the waitlist dashboard
 */
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Award, Star, Users, Zap, Trophy, Crown } from 'lucide-react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export const GlassCard: React.FC<GlassCardProps> = ({ children, className = '', delay = 0 }) => {
  return (
    <div
      className={`bg-white dark:bg-gray-800 bg-opacity-80 dark:bg-opacity-60 backdrop-filter backdrop-blur-lg rounded-xl border border-gray-100 dark:border-gray-700 border-opacity-30 dark:border-opacity-30 shadow-lg transition-all duration-300 hover:shadow-xl hover:bg-opacity-90 dark:hover:bg-opacity-70 hover:transform hover:-translate-y-1 ${className}`}
      style={{
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.05)',
      }}
    >
      {children}
    </div>
  );
};

interface BadgeProps {
  label: string;
  color: string;
  icon?: React.ReactNode;
  iconType?: 'award' | 'star' | 'users' | 'zap' | 'trophy' | 'crown';
  earned?: boolean;
  points?: number;
}

export const Badge: React.FC<BadgeProps> = ({ label, color, icon, iconType, earned = true, points }) => {
  // Determine which icon to display
  const getIcon = () => {
    if (icon) return icon;
    
    switch (iconType) {
      case 'award': return <Award size={24} />;
      case 'star': return <Star size={24} />;
      case 'users': return <Users size={24} />;
      case 'zap': return <Zap size={24} />;
      case 'trophy': return <Trophy size={24} />;
      case 'crown': return <Crown size={24} />;
      default: return <span className="text-2xl font-bold">{label.charAt(0)}</span>;
    }
  };

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      className={`flex flex-col items-center justify-center p-4 ${earned ? '' : 'grayscale opacity-50'}`}
    >
      <div 
        className={`w-16 h-16 rounded-full flex items-center justify-center text-white mb-2 shadow-lg ${earned ? `bg-${color}-500` : 'bg-gray-400'}`}
        style={{ background: earned ? `var(--${color})` : '#9CA3AF' }}
      >
        {getIcon()}
      </div>
      <span className="text-sm font-medium">{label}</span>
      {points && <span className="text-xs mt-1">{points} points</span>}
    </motion.div>
  );
};

interface ProgressBarProps {
  value: number;
  max: number;
  color?: string;
  height?: number;
  label?: string;
  showValue?: boolean;
  currentBadge?: React.ReactNode;
  nextBadge?: React.ReactNode;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ 
  value, 
  max, 
  color = 'blue', 
  height = 8,
  label,
  showValue = true,
  currentBadge,
  nextBadge
}) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  
  // Get color class based on the color prop
  const getColorClass = () => {
    switch (color) {
      case 'red': return 'bg-red-500 bg-opacity-80';
      case 'orange': return 'bg-orange-500 bg-opacity-80';
      case 'yellow': return 'bg-yellow-500 bg-opacity-80';
      case 'green': return 'bg-green-500 bg-opacity-80';
      case 'lightblue': return 'bg-sky-500 bg-opacity-80';
      case 'blue': return 'bg-blue-500 bg-opacity-80';
      case 'purple': return 'bg-purple-500 bg-opacity-80';
      default: return 'bg-blue-500 bg-opacity-80';
    }
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-1">
        <div className="flex items-center gap-2">
          {currentBadge && (
            <div className="flex-shrink-0">
              {currentBadge}
            </div>
          )}
          {label && (
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {showValue && <span className="text-sm font-medium text-blue-600 dark:text-blue-400">{value}/{max} points</span>}
          {nextBadge && (
            <div className="flex-shrink-0">
              {nextBadge}
            </div>
          )}
        </div>
      </div>
      <div 
        className="w-full bg-gray-200 dark:bg-gray-700 bg-opacity-50 dark:bg-opacity-50 rounded-full overflow-hidden shadow-inner"
        style={{ height: `${height}px` }}
      >
        <div 
          style={{ width: `${percentage}%` }}
          className={`h-full ${getColorClass()} transition-all duration-1000 ease-out rounded-full`}
        />
      </div>
    </div>
  );
};

interface CountdownTimerProps {
  endDate: Date;
  title?: string;
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({ endDate, title }) => {
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +new Date(endDate) - +new Date();
      
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [endDate]);

  return (
    <div className="text-center">
      {title && <h3 className="text-lg font-medium mb-4 text-gray-800 dark:text-gray-200">{title}</h3>}
      <div className="flex justify-center space-x-4">
        <TimeUnit value={timeLeft.days} label="Days" />
        <TimeUnit value={timeLeft.hours} label="Hours" />
        <TimeUnit value={timeLeft.minutes} label="Minutes" />
        <TimeUnit value={timeLeft.seconds} label="Seconds" />
      </div>
    </div>
  );
};

interface TimeUnitProps {
  value: number;
  label: string;
}

const TimeUnit: React.FC<TimeUnitProps> = ({ value, label }) => {
  return (
    <div className="flex flex-col items-center">
      <div className="bg-blue-600 bg-opacity-20 dark:bg-blue-900 dark:bg-opacity-30 rounded-lg w-16 h-16 flex items-center justify-center mb-2 shadow-inner border border-blue-200 dark:border-blue-800 border-opacity-30 dark:border-opacity-30 transition-all duration-300 hover:bg-opacity-30 dark:hover:bg-opacity-40">
        <span className="text-2xl font-bold text-blue-700 dark:text-blue-300">
          {value}
        </span>
      </div>
      <span className="text-xs text-gray-600 dark:text-gray-400">{label}</span>
    </div>
  );
};

interface CallToActionProps {
  title: string;
  description: string;
  buttonText: string;
  onClick: () => void;
  showSocialButtons?: boolean;
  referralLink?: string;
}

export const CallToAction: React.FC<CallToActionProps> = ({ 
  title, 
  description, 
  buttonText, 
  onClick,
  showSocialButtons = false,
  referralLink = ''
}) => {
  // Function to handle social media sharing
  const handleSocialShare = (platform: string) => {
    if (!referralLink) return;
    
    const text = 'I just joined the JobMate waitlist! Use my referral link to sign up and get priority access.';
    const encodedText = encodeURIComponent(text);
    const encodedUrl = encodeURIComponent(referralLink);
    
    let shareUrl = '';
    
    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
        break;
      default:
        return;
    }
    
    window.open(shareUrl, '_blank');
  };
  
  return (
    <motion.div 
      className="text-center p-5"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.4 }}
    >
      <h2 className="text-xl font-bold mb-3">{title}</h2>
      <p className="mb-5 opacity-80 text-sm">{description}</p>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-500 text-white text-sm font-medium rounded-full shadow-lg"
        onClick={onClick}
      >
        {buttonText}
      </motion.button>
      
      {showSocialButtons && (
        <div className="mt-5">
          <p className="text-xs mb-3">Or share directly on:</p>
          <div className="flex justify-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-1 bg-[#1DA1F2] rounded-full"
              onClick={() => handleSocialShare('twitter')}
              aria-label="Share on Twitter"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
              </svg>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-1 bg-[#4267B2] rounded-full"
              onClick={() => handleSocialShare('facebook')}
              aria-label="Share on Facebook"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
              </svg>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-1 bg-[#0077B5] rounded-full"
              onClick={() => handleSocialShare('linkedin')}
              aria-label="Share on LinkedIn"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                <rect x="2" y="9" width="4" height="12"></rect>
                <circle cx="4" cy="4" r="2"></circle>
              </svg>
            </motion.button>
          </div>
        </div>
      )}
    </motion.div>
  );
};
