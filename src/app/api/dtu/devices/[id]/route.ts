import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/storage/database/supabase-client';

const supabase = getSupabaseClient();

// 获取单个DTU设备详情
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const { data: device, error } = await supabase
      .from('dtu_devices')
      .select(`
        *,
        vendor:vendors(id, name, code)
      `)
      .eq('id', id)
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!device) {
      return NextResponse.json({ error: '设备不存在' }, { status: 404 });
    }

    // 获取最近的数据记录
    const { data: recentData } = await supabase
      .from('dtu_data')
      .select('*')
      .eq('dtu_id', id)
      .order('received_at', { ascending: false })
      .limit(10);

    // 获取未处理的告警
    const { data: alerts } = await supabase
      .from('dtu_alerts')
      .select('*')
      .eq('dtu_id', id)
      .eq('resolved', false)
      .order('created_at', { ascending: false })
      .limit(5);

    return NextResponse.json({
      success: true,
      data: {
        ...device,
        recent_data: recentData || [],
        alerts: alerts || [],
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '服务器错误' },
      { status: 500 }
    );
  }
}

// 更新DTU设备
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const updateData: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    // 允许更新的字段
    const allowedFields = [
      'name',
      'vendor_id',
      'connection_mode',
      'server_address',
      'server_port',
      'mqtt_topic_subscribe',
      'mqtt_topic_publish',
      'mqtt_username',
      'mqtt_password',
      'serial_baudrate',
      'heartbeat_interval',
      'config',
    ];

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updateData[field] = body[field];
      }
    }

    const { data, error } = await supabase
      .from('dtu_devices')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

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

// 删除DTU设备
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // 删除相关数据
    await supabase.from('dtu_data').delete().eq('dtu_id', id);
    await supabase.from('dtu_alerts').delete().eq('dtu_id', id);

    // 删除设备
    const { error } = await supabase
      .from('dtu_devices')
      .delete()
      .eq('id', id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '服务器错误' },
      { status: 500 }
    );
  }
}
