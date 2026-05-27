import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/storage/database/supabase-client';

const supabase = getSupabaseClient();

// 获取DTU数据历史
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const deviceId = searchParams.get('device_id');
    const dtuId = searchParams.get('dtu_id');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    // 如果提供了device_id，先查找对应的dtu_id
    let actualDtuId = dtuId;
    if (deviceId && !dtuId) {
      const { data: device } = await supabase
        .from('dtu_devices')
        .select('id')
        .eq('device_id', deviceId)
        .single();
      
      if (device) {
        actualDtuId = device.id;
      }
    }

    let query = supabase
      .from('dtu_data')
      .select('*')
      .order('received_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (actualDtuId) {
      query = query.eq('dtu_id', actualDtuId);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '服务器错误' },
      { status: 500 }
    );
  }
}
