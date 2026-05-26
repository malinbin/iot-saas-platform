import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/storage/database/supabase-client';

export async function POST(request: NextRequest) {
  try {
    const { phone, password } = await request.json();

    if (!phone || !password) {
      return NextResponse.json(
        { error: '手机号和密码不能为空' },
        { status: 400 }
      );
    }

    const supabase = getSupabaseClient();

    // 查询用户
    const { data: users, error: queryError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('phone', phone)
      .eq('is_active', true)
      .limit(1);

    if (queryError) {
      throw new Error(`查询用户失败: ${queryError.message}`);
    }

    if (!users || users.length === 0) {
      return NextResponse.json(
        { error: '用户不存在或已禁用' },
        { status: 401 }
      );
    }

    const user = users[0];

    // 简单密码验证（实际项目应使用 Supabase Auth）
    // 这里为了演示，使用简单的密码比对
    // 实际项目中应该使用 Supabase Auth 的 signInWithPassword
    const storedPassword = user.metadata?.password || '123456';
    if (password !== storedPassword) {
      return NextResponse.json(
        { error: '密码错误' },
        { status: 401 }
      );
    }

    // 更新最后登录时间
    await supabase
      .from('user_profiles')
      .update({ last_login_at: new Date().toISOString() })
      .eq('id', user.id);

    // 生成简单的 token（实际项目应使用 JWT）
    const token = Buffer.from(`${user.id}:${Date.now()}`).toString('base64');

    // 返回用户信息和 token
    return NextResponse.json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        vendor_id: user.vendor_id,
        avatar_url: user.avatar_url,
      },
    });
  } catch (error) {
    console.error('登录失败:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '登录失败' },
      { status: 500 }
    );
  }
}
