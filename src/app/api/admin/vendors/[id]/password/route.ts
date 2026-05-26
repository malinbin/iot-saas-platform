import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/storage/database/supabase-client';

const supabase = getSupabaseClient();

// 设置/重置厂家密码
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { password } = body;

    if (!password || password.length < 6) {
      return NextResponse.json(
        { success: false, error: '密码长度至少6位' },
        { status: 400 }
      );
    }

    // 更新密码
    const { error } = await supabase
      .from('vendors')
      .update({ password })
      .eq('id', id);

    if (error) {
      console.error('设置密码失败:', error);
      return NextResponse.json(
        { success: false, error: '设置密码失败' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: '密码设置成功'
    });

  } catch (error) {
    console.error('设置密码异常:', error);
    return NextResponse.json(
      { success: false, error: '服务器错误' },
      { status: 500 }
    );
  }
}
