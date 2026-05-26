import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/storage/database/supabase-client';

const supabase = getSupabaseClient();

// GET - 获取所有告警列表（管理员）
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const status = searchParams.get('status');
    const level = searchParams.get('level');
    const vendor_id = searchParams.get('vendor_id');

    let query = supabase
      .from('alerts')
      .select(`
        id,
        device_id,
        vendor_id,
        type,
        level,
        title,
        message,
        status,
        value,
        threshold,
        acknowledged_by,
        acknowledged_at,
        resolved_at,
        created_at,
        devices (
          id,
          name,
          serial_number,
          device_type
        ),
        vendors (
          id,
          name,
          code
        )
      `, { count: 'exact' });

    if (status) {
      query = query.eq('status', status);
    }
    if (level) {
      query = query.eq('level', level);
    }
    if (vendor_id) {
      query = query.eq('vendor_id', vendor_id);
    }

    const { data: alerts, error, count } = await query
      .range((page - 1) * limit, page * limit - 1)
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // 格式化数据
    const formattedAlerts = (alerts || []).map((alert: any) => ({
      ...alert,
      device_name: Array.isArray(alert.devices) ? alert.devices[0]?.name : alert.devices?.name,
      device_serial: Array.isArray(alert.devices) ? alert.devices[0]?.serial_number : alert.devices?.serial_number,
      vendor_name: Array.isArray(alert.vendors) ? alert.vendors[0]?.name : alert.vendors?.name,
    }));

    return NextResponse.json({ 
      success: true, 
      data: formattedAlerts,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      }
    });
  } catch (error) {
    console.error('获取告警列表失败:', error);
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}

// POST - 创建告警（用于测试或手动添加）
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      device_id, 
      vendor_id, 
      type, 
      level, 
      title, 
      message, 
      value, 
      threshold 
    } = body;

    const { data: alert, error } = await supabase
      .from('alerts')
      .insert({
        id: crypto.randomUUID(),
        device_id,
        vendor_id,
        type,
        level,
        title,
        message,
        value,
        threshold,
        status: 'active',
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: alert });
  } catch (error) {
    console.error('创建告警失败:', error);
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}
