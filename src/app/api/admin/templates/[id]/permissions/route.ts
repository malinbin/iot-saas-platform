import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/storage/database/supabase-client';

// GET /api/admin/templates/[id]/permissions - 获取模板权限
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabaseClient = getSupabaseClient();
    
    const { data: permissions, error } = await supabaseClient
      .from('template_permissions')
      .select(`
        *,
        vendor:vendors(id, name)
      `)
      .eq('template_id', id);

    if (error) {
      console.error('获取权限失败:', error);
      return NextResponse.json({ error: '获取权限失败' }, { status: 500 });
    }

    return NextResponse.json({ permissions });
  } catch (error) {
    console.error('获取权限失败:', error);
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}

// POST /api/admin/templates/[id]/permissions - 添加权限
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabaseClient = getSupabaseClient();
    const { vendor_ids } = await request.json();

    if (!Array.isArray(vendor_ids) || vendor_ids.length === 0) {
      return NextResponse.json({ error: '请选择厂家' }, { status: 400 });
    }

    const permissionsToInsert = vendor_ids.map((vendorId: string) => ({
      template_id: id,
      vendor_id: vendorId,
    }));

    const { data, error } = await supabaseClient
      .from('template_permissions')
      .insert(permissionsToInsert)
      .select();

    if (error) {
      console.error('添加权限失败:', error);
      return NextResponse.json({ error: '添加权限失败' }, { status: 500 });
    }

    return NextResponse.json({ permissions: data });
  } catch (error) {
    console.error('添加权限失败:', error);
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}

// DELETE /api/admin/templates/[id]/permissions - 删除权限
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabaseClient = getSupabaseClient();
    const { vendor_id } = await request.json();

    const { error } = await supabaseClient
      .from('template_permissions')
      .delete()
      .eq('template_id', id)
      .eq('vendor_id', vendor_id);

    if (error) {
      console.error('删除权限失败:', error);
      return NextResponse.json({ error: '删除权限失败' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('删除权限失败:', error);
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}
