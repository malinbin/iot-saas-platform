import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/storage/database/supabase-client';

const supabase = getSupabaseClient();

// GET - 获取所有设备列表（管理员）
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const status = searchParams.get('status');
    const vendor_id = searchParams.get('vendor_id');

    let query = supabase
      .from('devices')
      .select(`
        id,
        name,
        serial_number,
        device_type,
        model,
        status,
        location,
        template_id,
        vendor_id,
        owner_id,
        last_heartbeat_at,
        created_at,
        updated_at,
        device_templates (
          id,
          name,
          code
        ),
        vendors (
          id,
          name
        )
      `, { count: 'exact' });

    if (status) {
      query = query.eq('status', status);
    }
    if (vendor_id) {
      query = query.eq('vendor_id', vendor_id);
    }

    const { data: devices, error, count } = await query
      .range((page - 1) * limit, page * limit - 1)
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // 获取每个设备的告警数
    const devicesWithAlerts = await Promise.all(
      (devices || []).map(async (device: any) => {
        const { count: alertCount } = await supabase
          .from('alerts')
          .select('*', { count: 'exact', head: true })
          .eq('device_id', device.id)
          .eq('status', 'active');
        
        return {
          ...device,
          template_name: device.device_templates?.name,
          vendor_name: Array.isArray(device.vendors) ? device.vendors[0]?.name : device.vendors?.name,
          alerts: alertCount || 0,
        };
      })
    );

    return NextResponse.json({ 
      success: true, 
      data: devicesWithAlerts,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      }
    });
  } catch (error) {
    console.error('获取设备列表失败:', error);
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}
