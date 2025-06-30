import { NextRequest } from 'next/server';
import { createApiHandler } from '../../utils';
import { paymentService } from '@/services/api';

// GET /api/payments/subscriptions - Get active subscription for the current user
export const GET = createApiHandler(async (req) => {
  // Get the current user's active subscription
  return await paymentService.getMySubscription();
});
