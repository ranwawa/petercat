import { Tables } from '@/types/database.types';
import { NextResponse } from 'next/server';
import { supabase } from '@/share/supabas-client';

export const runtime = 'edge';

export const GET = async (request: Request) => {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json(
      { error: 'Incomplete parameters' },
      { status: 400 },
    );
  }

  try {
    const res = await supabase
      .from('bots')
      .select(
        'id, created_at, updated_at, avatar, description, enable_img_generation, label, name, starters, voice, public',
      )
      .eq('id', id);
    if (res?.error) {
      return NextResponse.json({ error: res?.error?.message }, { status: 400 });
    }
    const bots = res?.data ?? ([] as Tables<'bots'>[]);
    return NextResponse.json({ data: bots }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
};