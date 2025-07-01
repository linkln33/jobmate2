/**
 * @file Helper utility functions
 * @module utils/helpers
 */

/**
 * Generates a unique referral code based on user name and random characters
 * @param name User's name to base the referral code on
 * @returns A unique referral code
 */
export function generateReferralCode(name: string): string {
  // Take the first 3 characters of the name (or fewer if name is shorter)
  const namePrefix = name.toLowerCase().replace(/[^a-z0-9]/g, '').substring(0, 3);
  
  // Generate a random 4-digit number
  const randomNum = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  
  // Combine to create a referral code
  return `${namePrefix}${randomNum}`;
}
