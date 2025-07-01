import { toast } from 'react-toastify';
import confetti from 'canvas-confetti';

// Define achievement types
export type AchievementType = 
  | 'earlyBird' 
  | 'referrer' 
  | 'influencer' 
  | 'champion' 
  | 'topTen' 
  | 'vip';

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
    type: 'earlyBird',
    name: 'Early Bird',
    description: 'Joined during the early access period',
    points: 10,
    condition: () => true, // Always true for early access users
  },
  {
    type: 'referrer',
    name: 'Referrer',
    description: 'Successfully referred at least one person',
    points: 15,
    condition: (stats) => stats.referrals >= 1,
  },
  {
    type: 'influencer',
    name: 'Influencer',
    description: 'Referred 5 or more people to join',
    points: 50,
    condition: (stats) => stats.referrals >= 5,
  },
  {
    type: 'champion',
    name: 'Champion',
    description: 'Referred 10 or more people to join',
    points: 100,
    condition: (stats) => stats.referrals >= 10,
  },
  {
    type: 'topTen',
    name: 'Top 10',
    description: 'Ranked in the top 10 on the leaderboard',
    points: 50,
    condition: (stats) => stats.rank <= 10,
  },
  {
    type: 'vip',
    name: 'VIP',
    description: 'Earned 100 or more points',
    points: 0, // No additional points for this achievement
    condition: (stats) => stats.points >= 100,
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
