import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/storage/database/supabase-client';
import { v4 as uuidv4 } from 'uuid';

const supabase = getSupabaseClient();

// GET - 获取商家设备列表
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const vendorId = searchParams.get('vendor_id') || 'vendor-001'; // 实际应从session获取
    
    const { data: devices, error } = await supabase
      .from('devices')
      .select(`
        id,
        name,
        serial_number,
        device_type,
        model,
        status,
        location,
        owner_id,
        template_id,
        vendor_id,
        last_heartbeat_at,
        created_at,
        updated_at,
        device_templates (
          id,
          name,
          code,
          category
        )
      `)
      .eq('vendor_id', vendorId)
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // 获取每个设备的告警数
    const devicesWithAlerts = await Promise.all(
      (devices || []).map(async (device: any) => {
        const { count } = await supabase
          .from('alerts')
          .select('*', { count: 'exact', head: true })
          .eq('device_id', device.id)
          .eq('status', 'active');
        
        return {
          ...device,
          template_name: device.device_templates?.name,
          alerts: count || 0,
          lastUpdate: device.updated_at || device.created_at,
        };
      })
    );

    return NextResponse.json({ success: true, data: devicesWithAlerts });
  } catch (error) {
    console.error('获取设备列表失败:', error);
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}

// POST - 创建新设备
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      name, 
      serial_number,
      device_type,
      model,
      template_id, 
      location, 
      owner_id,
      vendor_id = 'vendor-001' // 实际应从session获取
    } = body;

    // 验证模板权限
    const { data: permission } = await supabase
      .from('template_permissions')
      .select('*')
      .eq('template_id', template_id)
      .eq('vendor_id', vendor_id)
      .single();

    if (!permission) {
      return NextResponse.json({ error: '无权使用该模板' }, { status: 403 });
    }

    const { data: device, error } = await supabase
      .from('devices')
      .insert({
        id: uuidv4(),
        name,
        serial_number,
        device_type,
        model,
        template_id,
        location,
        owner_id,
        vendor_id,
        status: 'offline',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: device });
  } catch (error) {
    console.error('创建设备失败:', error);
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}
