import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/storage/database/supabase-client';

// GET /api/admin/templates/[id] - 获取模板详情
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabaseClient = getSupabaseClient();
    
    const { data: template, error } = await supabaseClient
      .from('device_templates')
      .select(`
        *,
        fields:template_fields(*)
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error('获取模板详情失败:', error);
      return NextResponse.json({ error: '获取模板详情失败' }, { status: 500 });
    }

    return NextResponse.json({ template });
  } catch (error) {
    console.error('获取模板详情失败:', error);
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}

// PUT /api/admin/templates/[id] - 更新模板（含字段）
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabaseClient = getSupabaseClient();
    const body = await request.json();
    const { name, code, category, description, icon, dashboard_config, detail_config, is_active, fields } = body;

    // 更新模板基本信息
    const { data: template, error: templateError } = await supabaseClient
      .from('device_templates')
      .update({
        name,
        code,
        category,
        description,
        icon,
        dashboard_config,
        detail_config,
        is_active,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (templateError) {
      console.error('更新模板失败:', templateError);
      return NextResponse.json({ error: '更新模板失败: ' + templateError.message }, { status: 500 });
    }

    // 如果有字段数据，更新字段
    if (fields && Array.isArray(fields)) {
      // 先删除现有字段
      const { error: deleteError } = await supabaseClient
        .from('template_fields')
        .delete()
        .eq('template_id', id);

      if (deleteError) {
        console.error('删除旧字段失败:', deleteError);
      }

      // 插入新字段
      const fieldsToInsert = fields.map((field: Record<string, unknown>, index: number) => ({
        template_id: id,
        field_key: field.field_key || field.key || `field_${index}`,
        field_name: field.field_name || field.name || `字段${index + 1}`,
        field_type: field.field_type || field.type || 'number',
        unit: field.unit || '',
        icon: field.icon || '',
        color: field.color || '#3B82F6',
        chart_type: field.chart_type || field.chartType || 'line',
        show_in_list: field.show_in_list ?? field.showInList ?? true,
        show_in_dashboard: field.show_in_dashboard ?? field.showInDashboard ?? true,
        show_in_detail: true,
        alert_min: field.alert_min || field.minValue || null,
        alert_max: field.alert_max || field.maxValue || null,
        warning_min: field.warning_min || null,
        warning_max: field.warning_max || null,
        sort_order: index,
        card_width: field.card_width || field.width || 'half',
        created_at: new Date().toISOString(),
      }));

      if (fieldsToInsert.length > 0) {
        const { error: fieldsError } = await supabaseClient
          .from('template_fields')
          .insert(fieldsToInsert);

        if (fieldsError) {
          console.error('更新字段失败:', fieldsError);
          return NextResponse.json({ error: '更新字段失败: ' + fieldsError.message }, { status: 500 });
        }
      }
    }

    // 重新获取更新后的模板（含字段）
    const { data: updatedTemplate, error: fetchError } = await supabaseClient
      .from('device_templates')
      .select(`
        *,
        fields:template_fields(*)
      `)
      .eq('id', id)
      .single();

    if (fetchError) {
      return NextResponse.json({ template }); // 返回基本信息
    }

    return NextResponse.json({ template: updatedTemplate });
  } catch (error) {
    console.error('更新模板失败:', error);
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}

// DELETE /api/admin/templates/[id] - 删除模板
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabaseClient = getSupabaseClient();

    // 先删除关联的字段
    await supabaseClient
      .from('template_fields')
      .delete()
      .eq('template_id', id);

    // 再删除模板
    const { error } = await supabaseClient
      .from('device_templates')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('删除模板失败:', error);
      return NextResponse.json({ error: '删除模板失败' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('删除模板失败:', error);
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}
