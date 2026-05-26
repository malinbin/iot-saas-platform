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

// PUT /api/admin/templates/[id] - 更新模板
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabaseClient = getSupabaseClient();
    const body = await request.json();
    const { name, code, category, description, icon, dashboard_config, detail_config, is_active } = body;

    const { data, error } = await supabaseClient
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

    if (error) {
      console.error('更新模板失败:', error);
      return NextResponse.json({ error: '更新模板失败' }, { status: 500 });
    }

    return NextResponse.json({ template: data });
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

    // 再删除关联的权限
    await supabaseClient
      .from('template_permissions')
      .delete()
      .eq('template_id', id);

    // 最后删除模板
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
