import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      title,
      slug,
      excerpt,
      category,
      readingTime,
      coverImage,
      youtubeId,
      metaTitle,
      metaDescription,
      content,
      date,
    } = body;

    // Insert ke database Supabase
    const { data, error } = await supabase.from('articles').insert([
      {
        title,
        slug,
        excerpt,
        category,
        reading_time: readingTime,
        cover_image: coverImage,
        youtube_id: youtubeId,
        meta_title: metaTitle,
        meta_description: metaDescription,
        content,
        date,
      },
    ]);

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, data });
  } catch (err) {
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, data });
  } catch (err) {
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}