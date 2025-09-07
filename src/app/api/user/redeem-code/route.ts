import { NextRequest, NextResponse } from 'next/server';
import { requireUser } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import * as z from 'zod';

// Zod schema for salary code redemption
const redeemCodeSchema = z.object({
  salaryCode: z.string().min(9, 'Salary code must be 9 characters').max(9, 'Salary code must be 9 characters'),
  upiId: z.string().min(5, 'UPI ID must be at least 5 characters'),
  userName: z.string().min(2, 'Name must be at least 2 characters'),
  userPhone: z.string().min(10, 'Phone number must be at least 10 digits').regex(/^\d+$/, 'Phone number must contain only digits')
});

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await requireUser(request);

    // Parse and validate request body
    const body = await request.json();
    const validatedData = redeemCodeSchema.parse(body);

    // Check if salary code exists and is active
    const { data: salaryCodeData, error: codeError } = await supabase
      .from('salary_codes')
      .select('*')
      .eq('code', validatedData.salaryCode)
      .eq('status', 'active')
      .single();

    if (codeError || !salaryCodeData) {
      return NextResponse.json({ 
        error: 'Invalid salary code or code already redeemed' 
      }, { status: 400 });
    }

    // Check if this code has already been redeemed by anyone
    const { data: existingRequest, error: requestError } = await supabase
      .from('redeem_requests')
      .select('*')
      .eq('salary_code_id', salaryCodeData.id)
      .neq('status', 'rejected')
      .single();

    if (existingRequest) {
      return NextResponse.json({ 
        error: 'Salary code has already been redeemed' 
      }, { status: 400 });
    }

    // Create redeem request with user ID
    const { data: redeemRequest, error: redeemError } = await supabase
      .from('redeem_requests')
      .insert({
        salary_code_id: salaryCodeData.id,
        user_id: session.user.id,
        user_name: validatedData.userName,
        user_phone: validatedData.userPhone,
        upi_id: validatedData.upiId,
        status: 'pending'
      })
      .select()
      .single();

    if (redeemError) {
      console.error('Database error:', redeemError);
      return NextResponse.json({ error: 'Failed to create redemption request' }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Redemption request submitted successfully',
      redeemRequest 
    }, { status: 201 });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input data', details: error.issues }, { status: 400 });
    }
    
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
