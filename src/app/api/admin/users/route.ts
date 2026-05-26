import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/storage/database/supabase-client';

const supabase = getSupabaseClient();

// GET - 获取用户列表
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const role = searchParams.get('role');
    const vendor_id = searchParams.get('vendor_id');

    let query = supabase
      .from('user_profiles')
      .select(`
        id,
        name,
        phone,
        email,
        role,
        is_active,
        expires_at,
        vendor_id,
        created_at,
        updated_at,
        vendors (
          id,
          name
        )
      `, { count: 'exact' });

    if (role) {
      query = query.eq('role', role);
    }
    if (vendor_id) {
      query = query.eq('vendor_id', vendor_id);
    }

    const { data: users, error, count } = await query
      .range((page - 1) * limit, page * limit - 1)
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const usersWithVendor = (users || []).map((user: any) => ({
      ...user,
      vendor_name: Array.isArray(user.vendors) ? user.vendors[0]?.name : user.vendors?.name,
      is_expired: user.expires_at && new Date(user.expires_at) < new Date(),
    }));

    return NextResponse.json({ 
      success: true, 
      data: usersWithVendor,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      }
    });
  } catch (error) {
    console.error('获取用户列表失败:', error);
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}

// PUT - 更新用户状态
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, is_active, expires_at } = body;

    const updateData: any = { updated_at: new Date().toISOString() };
    if (is_active !== undefined) updateData.is_active = is_active;
    if (expires_at !== undefined) updateData.expires_at = expires_at;

    const { data: user, error } = await supabase
      .from('user_profiles')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: user });
  } catch (error) {
    console.error('更新用户失败:', error);
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}

// DELETE - 删除用户
export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();

    const { error } = await supabase
      .from('user_profiles')
      .delete()
      .eq('id', id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('删除用户失败:', error);
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}
