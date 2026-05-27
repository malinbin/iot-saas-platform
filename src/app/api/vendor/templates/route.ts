import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/storage/database/supabase-client';

// GET /api/vendor/templates - 获取厂家可用模板列表
export async function GET(request: NextRequest) {
  try {
    const supabaseClient = getSupabaseClient();
    // 从URL参数或请求头获取厂家ID
    const { searchParams } = new URL(request.url);
    const vendorId = searchParams.get('vendor_id') || request.headers.get('x-vendor-id') || '';

    if (!vendorId) {
      return NextResponse.json({ templates: [] });
    }

    // 查询厂家有权限的模板
    const { data: permissions, error } = await supabaseClient
      .from('template_permissions')
      .select(`
        template_id,
        template:device_templates(
          id,
          name,
          code,
          category,
          description,
          icon,
          is_active,
          field_count:template_fields(count)
        )
      `)
      .eq('vendor_id', vendorId);

    if (error) {
      console.error('获取模板列表失败:', error);
      return NextResponse.json({ error: '获取模板列表失败' }, { status: 500 });
    }

    // 格式化返回数据
    const templates = permissions?.map((p: any) => ({
      ...p.template,
      field_count: p.template?.field_count?.[0]?.count || 0,
    })).filter((t: any) => t.is_active);

    return NextResponse.json({ templates });
  } catch (error) {
    console.error('获取模板列表失败:', error);
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}
