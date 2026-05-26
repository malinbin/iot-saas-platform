import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/storage/database/supabase-client';

// PUT /api/admin/templates/[id]/permissions/[permissionId] - 更新权限
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; permissionId: string }> }
) {
  try {
    const { id, permissionId } = await params;
    const supabaseClient = getSupabaseClient();
    const body = await request.json();
    const { can_view, can_create, can_edit, is_active } = body;

    const updateData: Record<string, unknown> = {};
    if (can_view !== undefined) updateData.can_view = can_view;
    if (can_create !== undefined) updateData.can_create = can_create;
    if (can_edit !== undefined) updateData.can_edit = can_edit;
    if (is_active !== undefined) updateData.is_active = is_active;

    const { data, error } = await supabaseClient
      .from('template_permissions')
      .update(updateData)
      .eq('id', permissionId)
      .eq('template_id', id)
      .select()
      .single();

    if (error) {
      console.error('更新权限失败:', error);
      return NextResponse.json({ error: '更新权限失败: ' + error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, permission: data });
  } catch (error) {
    console.error('更新权限失败:', error);
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}

// DELETE /api/admin/templates/[id]/permissions/[permissionId] - 删除权限
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; permissionId: string }> }
) {
  try {
    const { id, permissionId } = await params;
    const supabaseClient = getSupabaseClient();

    const { error } = await supabaseClient
      .from('template_permissions')
      .delete()
      .eq('id', permissionId)
      .eq('template_id', id);

    if (error) {
      console.error('删除权限失败:', error);
      return NextResponse.json({ error: '删除权限失败: ' + error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('删除权限失败:', error);
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}
