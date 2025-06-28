import { useState, useEffect } from 'react';
import { compatibilityEngine } from '@/services/compatibility/engine';

/**
 * Hook to access the compatibility engine singleton
 */
export function useCompatibilityEngine() {
  // Return the singleton instance
  return { compatibilityEngine };
}
