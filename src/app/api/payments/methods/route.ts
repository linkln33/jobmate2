import { NextRequest } from 'next/server';
import { createApiHandler } from '../../utils';
import { paymentService } from '@/services/api';

// GET /api/payments/methods - Get payment methods for the current user
export const GET = createApiHandler(async (req) => {
  // Get the current user's payment methods
  return await paymentService.getMyPaymentMethods();
});
