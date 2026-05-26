import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/storage/database/supabase-client';

// 获取单个告警详情
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = getSupabaseClient();

    const { data, error } = await supabase
      .from('alerts')
      .select(`
        *,
        devices:device_id (
          id,
          name,
          serial_number,
          device_type
        ),
        vendors:vendor_id (
          id,
          name,
          code
        )
      `)
      .eq('id', id)
      .single();

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      alert: {
        ...data,
        device_name: data.devices?.name,
        device_serial: data.devices?.serial_number,
        vendor_name: data.vendors?.name,
      },
    });
  } catch (error) {
    console.error('获取告警详情失败:', error);
    return NextResponse.json(
      { success: false, error: '获取告警详情失败' },
      { status: 500 }
    );
  }
}

// 更新告警状态
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status, resolved_note } = body;
    const supabase = getSupabaseClient();

    const updateData: Record<string, unknown> = { updated_at: new Date().toISOString() };

    if (status === 'acknowledged') {
      updateData.status = 'acknowledged';
      updateData.acknowledged_at = new Date().toISOString();
    } else if (status === 'resolved') {
      updateData.status = 'resolved';
      updateData.resolved_at = new Date().toISOString();
      if (resolved_note) {
        updateData.resolved_note = resolved_note;
      }
    } else if (status === 'active') {
      updateData.status = 'active';
      updateData.acknowledged_at = null;
    }

    const { data, error } = await supabase
      .from('alerts')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      alert: data,
    });
  } catch (error) {
    console.error('更新告警失败:', error);
    return NextResponse.json(
      { success: false, error: '更新告警失败' },
      { status: 500 }
    );
  }
}

// 删除告警
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = getSupabaseClient();

    const { error } = await supabase
      .from('alerts')
      .delete()
      .eq('id', id);

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: '告警已删除',
    });
  } catch (error) {
    console.error('删除告警失败:', error);
    return NextResponse.json(
      { success: false, error: '删除告警失败' },
      { status: 500 }
    );
  }
}
