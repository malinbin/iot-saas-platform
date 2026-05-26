import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/storage/database/supabase-client';
import { v4 as uuidv4 } from 'uuid';

const supabase = getSupabaseClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      phone,
      email,
      validity_days,
    } = body;

    // 验证必填字段
    if (!name || !phone) {
      return NextResponse.json({ error: '用户姓名和手机号不能为空' }, { status: 400 });
    }

    // 检查手机号是否已存在
    const { data: existingUser } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('phone', phone)
      .single();

    if (existingUser) {
      return NextResponse.json({ error: '该手机号已注册' }, { status: 400 });
    }

    // TODO: 从 session 获取当前厂家的 vendor_id
    // 这里临时使用模拟数据
    const vendorId = 'test-vendor-id';

    // 计算到期时间
    let expiresAt = null;
    if (validity_days && validity_days > 0) {
      expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + validity_days);
    }

    // 生成用户ID和默认密码
    const userId = uuidv4();
    const defaultPassword = `${phone.slice(-6)}`;

    // 创建用户资料
    const { error: userError } = await supabase
      .from('user_profiles')
      .insert({
        id: userId,
        email: email || `${phone}@user.local`,
        name,
        phone,
        role: 'user',
        vendor_id: vendorId,
        is_active: true,
        expires_at: expiresAt ? expiresAt.toISOString() : null,
      });

    if (userError) {
      console.error('Create user profile error:', userError);
      return NextResponse.json({ error: '创建用户失败' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      data: {
        user_id: userId,
        default_email: email || `${phone}@user.local`,
        default_password: defaultPassword,
        expires_at: expiresAt ? expiresAt.toISOString() : null,
      },
      message: `用户账号创建成功！登录手机号：${phone}，初始密码：${defaultPassword}`,
    });

  } catch (error) {
    console.error('Create user error:', error);
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}
