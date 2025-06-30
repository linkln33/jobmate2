import { NextRequest } from 'next/server';
import { createApiHandler, getNumericQueryParam } from '../utils';
import { paymentService } from '@/services/api';

// GET /api/payments - Get transaction history for the current user
export const GET = createApiHandler(async (req) => {
  const limit = getNumericQueryParam(req, 'limit', 20);
  const offset = getNumericQueryParam(req, 'offset', 0);
  
  // Get the current user's transaction history
  return await paymentService.getMyTransactions(limit, offset);
});
