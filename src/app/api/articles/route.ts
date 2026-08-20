import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { isAdminRequest } from '@/lib/adminAuth';
import { revalidatePath, revalidateTag } from 'next/cache';

// 🛡️ Instance Supabase Admin Server-Side untuk Bypass RLS di API Route
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// 🔄 Helper function untuk membersihkan cache halaman terkait secara otomatis
function triggerRevalidation(slug?: string) {
  try {
    revalidatePath('/');                 // Refresh Homepage
    revalidatePath('/writing');           // Refresh List Artikel
    revalidateTag('articles', 'max');     // Refresh Tag Cache
    if (slug) {
      revalidatePath(`/writing/${slug}`); // Refresh Detail Artikel
    }
  } catch (err) {
    console.error('Revalidation error:', err);
  }
}

// POST: Tambah Artikel Baru
export async function POST(request: Request) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

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

    const { data, error } = await supabaseAdmin.from('articles').insert([
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

    // 🚀 PAKSA NEXT.JS REFRESH CACHE INSTAN
    triggerRevalidation(slug);

    return NextResponse.json({ success: true, data });
  } catch (err) {
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}

// GET: Ambil Daftar Artikel
export async function GET(request: Request) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { data, error } = await supabaseAdmin
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

// DELETE: Hapus Artikel
export async function DELETE(request: Request) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'ID artikel dibutuhkan' }, { status: 400 });
    }

    const { error } = await supabaseAdmin.from('articles').delete().eq('id', id);

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }

    // 🚀 REFRESH CACHE SETELAH HAPUS ARTIKEL
    triggerRevalidation();

    return NextResponse.json({ success: true, message: 'Artikel berhasil dihapus' });
  } catch (err) {
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}

// PUT: Update Artikel
export async function PUT(request: Request) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: 'ID artikel dibutuhkan' }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from('articles')
      .update({
        title: updateData.title,
        slug: updateData.slug,
        excerpt: updateData.excerpt,
        category: updateData.category,
        reading_time: updateData.readingTime,
        cover_image: updateData.coverImage,
        youtube_id: updateData.youtubeId,
        meta_title: updateData.metaTitle,
        meta_description: updateData.metaDescription,
        content: updateData.content,
      })
      .eq('id', id);

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }

    // 🚀 REFRESH CACHE SETELAH UPDATE ARTIKEL
    triggerRevalidation(updateData.slug);

    return NextResponse.json({ success: true, data });
  } catch (err) {
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}