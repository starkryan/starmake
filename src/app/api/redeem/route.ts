import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    // Authenticate the user
    const session = await auth.api.getSession({
      headers: request.headers
    });

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { salaryCode, upiId, userName, userPhone } = await request.json();

    // Validate required fields
    if (!salaryCode || !upiId || !userName || !userPhone) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    // Check if the salary code exists and is valid
    const { data: salaryCodeData, error: salaryCodeError } = await supabase
      .from('salary_codes')
      .select('*')
      .eq('code', salaryCode)
      .single();

    if (salaryCodeError || !salaryCodeData) {
      return NextResponse.json({ error: 'Invalid salary code' }, { status: 400 });
    }

    // Check if the code has already been redeemed
    const { data: existingRedemption, error: redemptionCheckError } = await supabase
      .from('redeem_requests')
      .select('*')
      .eq('salary_code_id', salaryCodeData.id)
      .eq('user_id', session.user.id)
      .single();

    if (existingRedemption) {
      return NextResponse.json({ error: 'This salary code has already been redeemed' }, { status: 400 });
    }

    // Create redemption request
    const { data: redemption, error: redemptionError } = await supabase
      .from('redeem_requests')
      .insert({
        salary_code_id: salaryCodeData.id,
        user_id: session.user.id,
        user_name: userName,
        user_phone: userPhone,
        upi_id: upiId,
        status: 'pending'
      })
      .select('*')
      .single();

    if (redemptionError) {
      console.error('Redemption error:', redemptionError);
      return NextResponse.json({ error: 'Failed to process redemption' }, { status: 500 });
    }

    // Update the salary code status to 'redeemed'
    const { error: updateError } = await supabase
      .from('salary_codes')
      .update({ status: 'redeemed' })
      .eq('id', salaryCodeData.id);

    if (updateError) {
      console.error('Update salary code error:', updateError);
      // We don't fail the request here since the redemption was successful
      // but we log the error for debugging
    }

    return NextResponse.json({
      message: 'Redemption request submitted successfully',
      redemption
    }, { status: 200 });

  } catch (error) {
    console.error('Redeem API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
