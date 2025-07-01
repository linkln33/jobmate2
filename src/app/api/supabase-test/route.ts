import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/utils/supabase';

export async function GET(request: NextRequest) {
  try {
    // Print the Supabase URL and key (first few characters)
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'Not set';
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'Not set';
    const maskedKey = key.substring(0, 10) + '...' + key.substring(key.length - 5);
    
    console.log('Supabase URL:', url);
    console.log('Supabase Key (masked):', maskedKey);
    
    // Test the connection by making a simple query
    const { data, error } = await supabase
      .from('waitlist_users')
      .select('*')
      .limit(1);
    
    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ 
        success: false, 
        error: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint
      }, { status: 500 });
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Supabase connection successful',
      data
    });
  } catch (error: any) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}
