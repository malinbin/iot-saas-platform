import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/storage/database/supabase-client';

const supabase = getSupabaseClient();

// GET - 获取设备详情
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const { data: device, error } = await supabase
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
          category,
          icon,
          description
        ),
        vendors (
          id,
          name
        )
      `)
      .eq('id', id)
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!device) {
      return NextResponse.json({ error: '设备不存在' }, { status: 404 });
    }

    // 获取最新数据
    const { data: latestData } = await supabase
      .from('device_data')
      .select('*')
      .eq('device_id', id)
      .order('recorded_at', { ascending: false })
      .limit(1)
      .single();

    return NextResponse.json({ 
      success: true, 
      data: {
        ...device,
        template: device.device_templates,
        vendor: Array.isArray(device.vendors) ? device.vendors[0] : device.vendors,
        latest_data: latestData,
      }
    });
  } catch (error) {
    console.error('获取设备详情失败:', error);
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}

// PUT - 更新设备信息
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, location, customer_id, status } = body;

    const { data: device, error } = await supabase
      .from('devices')
      .update({
        name,
        location,
        customer_id,
        status,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: device });
  } catch (error) {
    console.error('更新设备失败:', error);
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}

// DELETE - 删除设备
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const { error } = await supabase
      .from('devices')
      .delete()
      .eq('id', id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('删除设备失败:', error);
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}
