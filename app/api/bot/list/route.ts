import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Database, Tables } from '@/types/database.types';
import { NextResponse } from 'next/server';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseAnonKey = process.env.SUPABASE_PRIVATE_KEY!;
const supabase: SupabaseClient = createClient<Database>(
  supabaseUrl,
  supabaseAnonKey,
);

export const GET = async () => {
  try {
    const res = await supabase.from('bots').select('*');
    if (res?.error) {
      return NextResponse.json({ error: res?.error?.message }, { status: 400 });
    }
    const bots = res?.data ?? ([] as Tables<'bots'>[]);
    return NextResponse.json({ data: bots }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
};