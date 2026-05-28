import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/storage/database/supabase-client';

/**
 * 数据解析和设备匹配 API
 * 
 * 匹配方式：
 * 1. 端口匹配 - 根据DTU端口号匹配设备
 * 2. 主题匹配 - 根据MQTT主题匹配设备
 * 3. 标识符匹配 - 根据数据中的标识符字段匹配
 */

// 获取解析规则
export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabaseClient();
    const { searchParams } = new URL(request.url);
    const dtuId = searchParams.get('dtu_id');
    const deviceId = searchParams.get('device_id');

    let query = supabase
      .from('dtu_parsing_rules')
      .select('*');

    if (dtuId) {
      query = query.eq('dtu_id', dtuId);
    }
    if (deviceId) {
      query = query.eq('target_device_id', deviceId);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: data || [] });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '获取解析规则失败' },
      { status: 500 }
    );
  }
}

// 创建/更新解析规则
export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabaseClient();
    const body = await request.json();

    const {
      dtu_id,
      name,
      description,
      match_type = 'port',
      match_port,
      match_topic_pattern,
      match_identifier_field,
      match_identifier_value,
      parsing_type = 'json',
      json_path,
      modbus_register,
      modbus_data_type,
      target_device_id,
      target_field,
      data_unit,
      data_scale,
      data_offset,
      is_active = true
    } = body;

    // 验证必填字段
    if (!dtu_id || !name) {
      return NextResponse.json(
        { error: 'DTU ID和规则名称为必填项' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('dtu_parsing_rules')
      .insert({
        dtu_id,
        name,
        description,
        match_type,
        match_port,
        match_topic_pattern,
        match_identifier_field,
        match_identifier_value,
        parsing_type,
        json_path,
        modbus_register,
        modbus_data_type,
        target_device_id,
        target_field,
        data_unit,
        data_scale,
        data_offset,
        is_active
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '创建解析规则失败' },
      { status: 500 }
    );
  }
}

// 更新解析规则
export async function PUT(request: NextRequest) {
  try {
    const supabase = getSupabaseClient();
    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json({ error: '规则ID为必填项' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('dtu_parsing_rules')
      .update({
        ...updateData,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '更新解析规则失败' },
      { status: 500 }
    );
  }
}

// 删除解析规则
export async function DELETE(request: NextRequest) {
  try {
    const supabase = getSupabaseClient();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: '规则ID为必填项' }, { status: 400 });
    }

    const { error } = await supabase
      .from('dtu_parsing_rules')
      .delete()
      .eq('id', id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: '删除成功' });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '删除解析规则失败' },
      { status: 500 }
    );
  }
}
