import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/storage/database/supabase-client';

// GET /api/admin/templates - 获取模板列表
export async function GET(request: NextRequest) {
  try {
    const supabaseClient = getSupabaseClient();
    const { data: templates, error } = await supabaseClient
      .from('device_templates')
      .select(`
        *,
        field_count:template_fields(count),
        vendor_count:template_permissions(count)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('获取模板失败:', error);
      return NextResponse.json({ error: '获取模板失败' }, { status: 500 });
    }

    // 转换count格式
    const formattedTemplates = templates?.map(t => ({
      ...t,
      field_count: t.field_count?.[0]?.count || 0,
      vendor_count: t.vendor_count?.[0]?.count || 0,
    }));

    return NextResponse.json({ templates: formattedTemplates });
  } catch (error) {
    console.error('获取模板失败:', error);
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}

// POST /api/admin/templates - 创建模板
export async function POST(request: NextRequest) {
  try {
    const supabaseClient = getSupabaseClient();
    const body = await request.json();
    const { name, code, category, description, icon, dashboard_config, detail_config } = body;

    if (!name || !code) {
      return NextResponse.json({ error: '模板名称和编码必填' }, { status: 400 });
    }

    const { data, error } = await supabaseClient
      .from('device_templates')
      .insert({
        name,
        code,
        category,
        description,
        icon,
        dashboard_config: dashboard_config || { layout: 'grid' },
        detail_config: detail_config || { tabs: ['overview', 'data', 'alerts'] },
      })
      .select()
      .single();

    if (error) {
      console.error('创建模板失败:', error);
      return NextResponse.json({ error: '创建模板失败' }, { status: 500 });
    }

    return NextResponse.json({ template: data });
  } catch (error) {
    console.error('创建模板失败:', error);
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}
