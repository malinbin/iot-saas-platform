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
        id,
        template_id,
        vendor_id,
        can_view,
        can_create,
        can_edit,
        is_active,
        created_at,
        vendor:vendors(id, name, code)
      `)
      .eq('template_id', id);

    if (error) {
      console.error('获取权限失败:', error);
      return NextResponse.json({ error: '获取权限失败' }, { status: 500 });
    }

    // 格式化数据
    const formattedPermissions = (permissions || []).map((p: any) => ({
      id: p.id,
      vendor_id: p.vendor_id,
      vendor_name: p.vendor?.name || '',
      vendor_code: p.vendor?.code || '',
      can_view: p.can_view ?? true,
      can_create: p.can_create ?? true,
      can_edit: p.can_edit ?? false,
      is_active: p.is_active ?? true,
      granted_at: p.created_at,
    }));

    return NextResponse.json({ permissions: formattedPermissions });
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
    const body = await request.json();
    const { vendor_ids, can_view = true, can_create = true, can_edit = false } = body;

    if (!Array.isArray(vendor_ids) || vendor_ids.length === 0) {
      return NextResponse.json({ error: '请选择厂家' }, { status: 400 });
    }

    const permissionsToInsert = vendor_ids.map((vendorId: string) => ({
      template_id: id,
      vendor_id: vendorId,
      can_view,
      can_create,
      can_edit,
      is_active: true,
    }));

    const { data, error } = await supabaseClient
      .from('template_permissions')
      .insert(permissionsToInsert)
      .select();

    if (error) {
      console.error('添加权限失败:', error);
      return NextResponse.json({ error: '添加权限失败: ' + error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, permissions: data });
  } catch (error) {
    console.error('添加权限失败:', error);
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}

// PUT /api/admin/templates/[id]/permissions - 更新权限
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabaseClient = getSupabaseClient();
    const { permission_id, ...updates } = await request.json();

    if (!permission_id) {
      return NextResponse.json({ error: '缺少权限ID' }, { status: 400 });
    }

    const { data, error } = await supabaseClient
      .from('template_permissions')
      .update(updates)
      .eq('id', permission_id)
      .select();

    if (error) {
      console.error('更新权限失败:', error);
      return NextResponse.json({ error: '更新权限失败' }, { status: 500 });
    }

    return NextResponse.json({ success: true, permission: data[0] });
  } catch (error) {
    console.error('更新权限失败:', error);
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
    const { searchParams } = new URL(request.url);
    const permissionId = searchParams.get('permission_id');

    if (!permissionId) {
      return NextResponse.json({ error: '缺少权限ID' }, { status: 400 });
    }

    const { error } = await supabaseClient
      .from('template_permissions')
      .delete()
      .eq('id', permissionId);

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
