import { toast } from 'react-toastify';
import confetti from 'canvas-confetti';

// Define achievement types
export type AchievementType = 
  | 'earlyAccess' 
  | 'freeProMonth' 
  | 'proYearDiscount' 
  | 'proSixMonths' 
  | 'proOneYear' 
  | 'proTwoYears' 
  | 'proLifetime';

// Define achievement data
export interface Achievement {
  type: AchievementType;
  name: string;
  description: string;
  points: number;
  condition: (stats: UserStats) => boolean;
}

// Define user stats interface
export interface UserStats {
  referrals: number;
  points: number;
  rank: number;
  previousAchievements?: AchievementType[];
}

// Define achievements
export const achievements: Achievement[] = [
  {
    type: 'earlyAccess',
    name: 'Early Access',
    description: 'Early access to platform',
    points: 10,
    condition: (stats) => stats.points >= 10,
  },
  {
    type: 'freeProMonth',
    name: 'Free Pro - 1 Month',
    description: 'Free pro plan for the 1st month',
    points: 0,
    condition: (stats) => stats.points >= 50,
  },
  {
    type: 'proYearDiscount',
    name: 'Free Pro - 3 Months',
    description: 'Free pro plan for 3 months',
    points: 0,
    condition: (stats) => stats.points >= 150,
  },
  {
    type: 'proSixMonths',
    name: 'Pro - 6 Months',
    description: 'Free pro plan for 6 months',
    points: 0,
    condition: (stats) => stats.points >= 350,
  },
  {
    type: 'proOneYear',
    name: 'Pro - 1 Year',
    description: 'Free pro plan for 1 year',
    points: 0,
    condition: (stats) => stats.points >= 540,
  },
  {
    type: 'proTwoYears',
    name: 'Pro - 2 Years',
    description: 'Free pro plan for two years',
    points: 0,
    condition: (stats) => stats.points >= 1000,
  },
  {
    type: 'proLifetime',
    name: 'Pro Lifetime',
    description: 'Free pro plan lifetime with special perks',
    points: 0,
    condition: (stats) => stats.points >= 3000,
  },
];

// Function to check for new achievements
export const checkNewAchievements = (
  currentStats: UserStats,
  previousStats?: UserStats
): Achievement[] => {
  // Get previously earned achievements
  const previousAchievements = previousStats?.previousAchievements || [];
  
  // Check for newly earned achievements
  const newAchievements = achievements.filter((achievement) => {
    // Check if the achievement condition is met
    const isEarned = achievement.condition(currentStats);
    
    // Check if this is a new achievement (not previously earned)
    const isNew = isEarned && !previousAchievements.includes(achievement.type);
    
    return isNew;
  });
  
  return newAchievements;
};

// Function to display achievement notification
export const showAchievementNotification = (achievement: Achievement) => {
  // Show toast notification
  toast.success(
    `${achievement.name} Unlocked!\n${achievement.description}${achievement.points > 0 ? `\n+${achievement.points} points` : ''}`,
    {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    }
  );
  
  // Trigger confetti effect
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
    colors: ['#4F46E5', '#8B5CF6', '#EC4899'],
  });
};

// Function to track progress and show notifications for new achievements
export const trackProgress = (
  currentStats: UserStats,
  previousStats?: UserStats
): UserStats => {
  // Check for new achievements
  const newAchievements = checkNewAchievements(currentStats, previousStats);
  
  // Show notifications for new achievements
  newAchievements.forEach((achievement) => {
    showAchievementNotification(achievement);
  });
  
  // Update current stats with new achievements
  const updatedStats: UserStats = {
    ...currentStats,
    previousAchievements: [
      ...(currentStats.previousAchievements || []),
      ...newAchievements.map((a) => a.type),
    ],
  };
  
  return updatedStats;
};

// Function to save user stats to localStorage
export const saveUserStats = (userId: string, stats: UserStats): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(`jobmate_user_stats_${userId}`, JSON.stringify(stats));
  }
};

// Function to load user stats from localStorage
export const loadUserStats = (userId: string): UserStats | undefined => {
  if (typeof window !== 'undefined') {
    const savedStats = localStorage.getItem(`jobmate_user_stats_${userId}`);
    if (savedStats) {
      return JSON.parse(savedStats);
    }
  }
  return undefined;
};
