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
      .limit(1);

    if (queryError) {
      throw new Error(`查询用户失败: ${queryError.message}`);
    }

    if (!users || users.length === 0) {
      return NextResponse.json(
        { error: '用户不存在' },
        { status: 401 }
      );
    }

    const user = users[0];

    // 检查账号是否被禁用
    if (!user.is_active) {
      return NextResponse.json(
        { error: '账号已被禁用，请联系管理员' },
        { status: 403 }
      );
    }

    // 检查账号是否已过期
    if (user.expires_at) {
      const expiresAt = new Date(user.expires_at);
      const now = new Date();
      if (now > expiresAt) {
        return NextResponse.json(
          { error: `账号已于 ${expiresAt.toLocaleDateString()} 过期，请联系管理员续期` },
          { status: 403 }
        );
      }
    }

    // 如果是厂家用户，检查厂家账号是否过期
    if (user.role === 'vendor' && user.vendor_id) {
      const { data: vendor } = await supabase
        .from('vendors')
        .select('expires_at, status')
        .eq('id', user.vendor_id)
        .single();

      if (vendor) {
        if (vendor.status !== 'approved') {
          return NextResponse.json(
            { error: '所属厂家账号未通过审核' },
            { status: 403 }
          );
        }
        if (vendor.expires_at) {
          const vendorExpiresAt = new Date(vendor.expires_at);
          const now = new Date();
          if (now > vendorExpiresAt) {
            return NextResponse.json(
              { error: `所属厂家账号已于 ${vendorExpiresAt.toLocaleDateString()} 过期` },
              { status: 403 }
            );
          }
        }
      }
    }

    // 简单密码验证（实际项目应使用 Supabase Auth）
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

    // 生成简单的 token
    const token = Buffer.from(`${user.id}:${Date.now()}`).toString('base64');

    // 计算剩余天数
    let remainingDays = null;
    if (user.expires_at) {
      const diff = new Date(user.expires_at).getTime() - Date.now();
      remainingDays = Math.ceil(diff / (1000 * 60 * 60 * 24));
    }

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
        expires_at: user.expires_at,
        remaining_days: remainingDays,
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
