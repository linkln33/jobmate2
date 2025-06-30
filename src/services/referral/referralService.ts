// Referral service for tracking and managing referrals

export interface ReferralData {
  id: string;
  referrerId: string;
  referredUserId: string | null;
  listingId: string;
  listingType: 'job' | 'service' | 'rental' | 'item';
  status: 'pending' | 'clicked' | 'converted' | 'paid';
  commission: number;
  createdAt: string;
  convertedAt: string | null;
  paidAt: string | null;
}

// Mock data for development
const mockReferrals: ReferralData[] = [
  {
    id: 'ref-001',
    referrerId: 'user123',
    referredUserId: 'user456',
    listingId: 'item-1',
    listingType: 'item',
    status: 'converted',
    commission: 15.00,
    createdAt: '2025-06-25T10:30:00Z',
    convertedAt: '2025-06-26T14:20:00Z',
    paidAt: null
  },
  {
    id: 'ref-002',
    referrerId: 'user123',
    referredUserId: 'user789',
    listingId: 'service-1',
    listingType: 'service',
    status: 'paid',
    commission: 25.50,
    createdAt: '2025-06-20T08:15:00Z',
    convertedAt: '2025-06-21T16:45:00Z',
    paidAt: '2025-06-28T09:30:00Z'
  },
  {
    id: 'ref-003',
    referrerId: 'user123',
    referredUserId: null,
    listingId: 'rental-2',
    listingType: 'rental',
    status: 'clicked',
    commission: 0,
    createdAt: '2025-06-29T11:20:00Z',
    convertedAt: null,
    paidAt: null
  }
];

// Generate a unique referral ID
function generateReferralId(): string {
  return `ref-${Math.random().toString(36).substring(2, 8)}`;
}

// Create a new referral
export async function createReferral(
  referrerId: string,
  listingId: string,
  listingType: 'job' | 'service' | 'rental' | 'item'
): Promise<ReferralData> {
  // In a real implementation, this would save to a database
  const newReferral: ReferralData = {
    id: generateReferralId(),
    referrerId,
    referredUserId: null,
    listingId,
    listingType,
    status: 'pending',
    commission: 0,
    createdAt: new Date().toISOString(),
    convertedAt: null,
    paidAt: null
  };
  
  // In a real implementation, save to database
  mockReferrals.push(newReferral);
  
  return newReferral;
}

// Track a referral click
export async function trackReferralClick(
  referralId: string,
  visitorId: string | null
): Promise<ReferralData | null> {
  // In a real implementation, this would update the database
  const referral = mockReferrals.find(r => r.id === referralId);
  
  if (!referral) {
    return null;
  }
  
  referral.status = 'clicked';
  
  return referral;
}

// Convert a referral (when a referred user completes a transaction)
export async function convertReferral(
  referralId: string,
  referredUserId: string,
  transactionAmount: number
): Promise<ReferralData | null> {
  // In a real implementation, this would update the database
  const referral = mockReferrals.find(r => r.id === referralId);
  
  if (!referral) {
    return null;
  }
  
  referral.status = 'converted';
  referral.referredUserId = referredUserId;
  referral.convertedAt = new Date().toISOString();
  
  // Calculate commission based on listing type
  switch (referral.listingType) {
    case 'job':
      referral.commission = transactionAmount * 0.05; // 5% commission
      break;
    case 'service':
      referral.commission = transactionAmount * 0.07; // 7% commission
      break;
    case 'rental':
      referral.commission = transactionAmount * 0.10; // 10% commission
      break;
    case 'item':
      referral.commission = transactionAmount * 0.03; // 3% commission
      break;
    default:
      referral.commission = transactionAmount * 0.05; // Default 5% commission
  }
  
  return referral;
}

// Get referrals by user ID
export async function getReferralsByUser(userId: string): Promise<ReferralData[]> {
  // In a real implementation, this would query the database
  return mockReferrals.filter(r => r.referrerId === userId);
}

// Get referral stats for a user
export async function getUserReferralStats(userId: string): Promise<{
  totalReferrals: number;
  pendingReferrals: number;
  convertedReferrals: number;
  totalEarnings: number;
  pendingEarnings: number;
}> {
  const userReferrals = await getReferralsByUser(userId);
  
  const totalReferrals = userReferrals.length;
  const pendingReferrals = userReferrals.filter(r => r.status === 'clicked' || r.status === 'pending').length;
  const convertedReferrals = userReferrals.filter(r => r.status === 'converted' || r.status === 'paid').length;
  
  const totalEarnings = userReferrals.reduce((sum, r) => sum + r.commission, 0);
  const pendingEarnings = userReferrals
    .filter(r => r.status === 'converted')
    .reduce((sum, r) => sum + r.commission, 0);
  
  return {
    totalReferrals,
    pendingReferrals,
    convertedReferrals,
    totalEarnings,
    pendingEarnings
  };
}

// Process a payout for a referral
export async function processReferralPayout(referralId: string): Promise<ReferralData | null> {
  // In a real implementation, this would update the database and trigger payment
  const referral = mockReferrals.find(r => r.id === referralId);
  
  if (!referral || referral.status !== 'converted') {
    return null;
  }
  
  referral.status = 'paid';
  referral.paidAt = new Date().toISOString();
  
  return referral;
}
