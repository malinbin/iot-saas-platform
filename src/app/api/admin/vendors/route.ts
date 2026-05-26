import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/storage/database/supabase-client';

const supabase = getSupabaseClient();

// GET - 获取厂家列表
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const status = searchParams.get('status');

    let query = supabase
      .from('vendors')
      .select(`
        id,
        name,
        code,
        contact_name,
        contact_phone,
        contact_email,
        status,
        is_active,
        expires_at,
        created_at,
        updated_at
      `, { count: 'exact' });

    if (status) {
      query = query.eq('status', status);
    }

    const { data: vendors, error, count } = await query
      .range((page - 1) * limit, page * limit - 1)
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // 获取每个厂家的设备数和用户数
    const vendorsWithStats = await Promise.all(
      (vendors || []).map(async (vendor: any) => {
        const { count: deviceCount } = await supabase
          .from('devices')
          .select('*', { count: 'exact', head: true })
          .eq('vendor_id', vendor.id);
        
        const { count: userCount } = await supabase
          .from('user_profiles')
          .select('*', { count: 'exact', head: true })
          .eq('vendor_id', vendor.id);

        // 检查是否过期
        const isExpired = vendor.expires_at && new Date(vendor.expires_at) < new Date();
        
        return {
          ...vendor,
          device_count: deviceCount || 0,
          user_count: userCount || 0,
          is_expired: isExpired,
        };
      })
    );

    return NextResponse.json({ 
      success: true, 
      data: vendorsWithStats,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      }
    });
  } catch (error) {
    console.error('获取厂家列表失败:', error);
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}

// PUT - 更新厂家状态（审核）
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status, is_active, expires_at } = body;

    const updateData: any = { updated_at: new Date().toISOString() };
    if (status) updateData.status = status;
    if (is_active !== undefined) updateData.is_active = is_active;
    if (expires_at !== undefined) updateData.expires_at = expires_at;

    const { data: vendor, error } = await supabase
      .from('vendors')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: vendor });
  } catch (error) {
    console.error('更新厂家失败:', error);
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}
