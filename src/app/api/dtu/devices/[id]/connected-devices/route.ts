import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/storage/database/supabase-client';

const supabase = getSupabaseClient();

// GET - 获取DTU关联的设备列表
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const { data: devices, error } = await supabase
      .from('devices')
      .select(`
        id,
        name,
        serial_number,
        device_type,
        status,
        dtu_port,
        last_heartbeat_at
      `)
      .eq('dtu_id', id)
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: devices || [] });
  } catch (error) {
    console.error('获取关联设备失败:', error);
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}
