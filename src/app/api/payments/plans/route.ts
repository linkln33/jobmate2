import { NextRequest } from 'next/server';
import { createApiHandler, getBooleanQueryParam } from '../../utils';
import { paymentService } from '@/services/api';

// GET /api/payments/plans - Get all subscription plans
export const GET = createApiHandler(async (req) => {
  const includeInactive = getBooleanQueryParam(req, 'includeInactive', false);
  
  // Get all subscription plans
  return await paymentService.getSubscriptionPlans(includeInactive);
}, { requireAuth: false });
