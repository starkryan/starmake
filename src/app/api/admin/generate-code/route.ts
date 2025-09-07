import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import * as z from 'zod';

// Zod schema for salary code generation
const salaryCodeSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits').regex(/^\d+$/, 'Phone number must contain only digits'),
  task: z.string().min(5, 'Task description must be at least 5 characters'),
  price: z.string().min(1, 'Price is required').regex(/^\d+(\.\d{1,2})?$/, 'Price must be a valid number')
});

export async function POST(request: NextRequest) {
  try {
    // Check authentication and admin access
    const session = await requireAdmin(request);

    // Parse and validate request body
    const body = await request.json();
    const validatedData = salaryCodeSchema.parse(body);

    // Generate alphanumeric code
    const generateAlphanumericCode = (length = 9) => {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      let result = '';
      for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return result;
    };

    const randomCode = generateAlphanumericCode(9);

    // Insert into database
    const { data, error } = await supabase
      .from('salary_codes')
      .insert({
        code: randomCode,
        name: validatedData.name,
        phone: validatedData.phone,
        task: validatedData.task,
        price: parseFloat(validatedData.price),
        status: 'active'
      })
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json({ error: 'Failed to generate salary code' }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      code: randomCode,
      salaryCode: data 
    }, { status: 201 });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input data', details: error.issues }, { status: 400 });
    }
    
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
