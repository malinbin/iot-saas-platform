import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/storage/database/supabase-client';

// GET /api/admin/templates/[id]/fields - 获取模板字段
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabaseClient = getSupabaseClient();
    
    const { data: fields, error } = await supabaseClient
      .from('template_fields')
      .select('*')
      .eq('template_id', id)
      .order('sort_order', { ascending: true });

    if (error) {
      console.error('获取字段失败:', error);
      return NextResponse.json({ error: '获取字段失败' }, { status: 500 });
    }

    return NextResponse.json({ fields });
  } catch (error) {
    console.error('获取字段失败:', error);
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}

// POST /api/admin/templates/[id]/fields - 添加字段
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabaseClient = getSupabaseClient();
    const body = await request.json();
    const fields = Array.isArray(body) ? body : [body];

    // 获取当前最大sort_order
    const { data: existingFields } = await supabaseClient
      .from('template_fields')
      .select('sort_order')
      .eq('template_id', id)
      .order('sort_order', { ascending: false })
      .limit(1);

    let nextOrder = existingFields && existingFields.length > 0 
      ? (existingFields[0].sort_order || 0) + 1 
      : 1;

    const fieldsToInsert = fields.map((field: any) => ({
      template_id: id,
      field_key: field.field_key,
      field_name: field.field_name,
      field_type: field.field_type || 'number',
      unit: field.unit,
      icon: field.icon,
      color: field.color,
      chart_type: field.chart_type || 'line',
      show_in_dashboard: field.show_in_dashboard ?? true,
      alert_min: field.alert_min,
      alert_max: field.alert_max,
      sort_order: nextOrder++,
    }));

    const { data, error } = await supabaseClient
      .from('template_fields')
      .insert(fieldsToInsert)
      .select();

    if (error) {
      console.error('添加字段失败:', error);
      return NextResponse.json({ error: '添加字段失败' }, { status: 500 });
    }

    return NextResponse.json({ fields: data });
  } catch (error) {
    console.error('添加字段失败:', error);
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}

// PUT /api/admin/templates/[id]/fields - 更新字段（批量）
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabaseClient = getSupabaseClient();
    const fields = await request.json();

    // 逐个更新
    for (const field of fields) {
      await supabaseClient
        .from('template_fields')
        .update({
          field_key: field.field_key,
          field_name: field.field_name,
          field_type: field.field_type,
          unit: field.unit,
          icon: field.icon,
          color: field.color,
          chart_type: field.chart_type,
          show_in_dashboard: field.show_in_dashboard,
          alert_min: field.alert_min,
          alert_max: field.alert_max,
          sort_order: field.sort_order,
        })
        .eq('id', field.id);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('更新字段失败:', error);
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}

// DELETE /api/admin/templates/[id]/fields - 删除字段
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabaseClient = getSupabaseClient();
    const { fieldId } = await request.json();

    const { error } = await supabaseClient
      .from('template_fields')
      .delete()
      .eq('id', fieldId);

    if (error) {
      console.error('删除字段失败:', error);
      return NextResponse.json({ error: '删除字段失败' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('删除字段失败:', error);
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}
