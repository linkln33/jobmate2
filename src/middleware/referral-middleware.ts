import { NextRequest, NextResponse } from 'next/server';

/**
 * Middleware to handle referral tracking
 * This middleware checks for ref parameter in URLs and sets a cookie to track the referral
 */
export function referralMiddleware(request: NextRequest) {
  const url = request.nextUrl;
  
  // Check if URL has a referral code
  if (url.searchParams.has('ref')) {
    const refCode = url.searchParams.get('ref');
    const response = NextResponse.next();
    
    // Set referral cookie (30 days)
    if (refCode) {
      response.cookies.set('jobmate_ref', refCode, { 
        maxAge: 60 * 60 * 24 * 30,
        path: '/',
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production'
      });
    }
    
    // Track the referral click via API if we have a listing ID
    const pathParts = url.pathname.split('/');
    const listingId = pathParts[pathParts.length - 1];
    
    // Determine listing type from URL path
    let listingType = 'item'; // Default
    if (url.pathname.includes('/job/')) listingType = 'job';
    else if (url.pathname.includes('/service/')) listingType = 'service';
    else if (url.pathname.includes('/rental/')) listingType = 'rental';
    
    // Log referral click for analytics (in a real app, this would call the API)
    console.log(`Referral click: ${refCode} -> ${listingType}/${listingId}`);
    
    return response;
  }
  
  return NextResponse.next();
}
