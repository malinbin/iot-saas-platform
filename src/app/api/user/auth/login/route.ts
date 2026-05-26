import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/storage/database/supabase-client';

const supabase = getSupabaseClient();

// 用户登录
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { phone, password } = body;

    if (!phone || !password) {
      return NextResponse.json(
        { success: false, error: '手机号和密码不能为空' },
        { status: 400 }
      );
    }

    // 查询用户 - 从 user_profiles 表
    const { data: users, error: userError } = await supabase
      .from('user_profiles')
      .select('id, name, phone, password, role, vendor_id, is_active')
      .eq('phone', phone)
      .eq('role', 'user')
      .limit(1);

    if (userError) {
      console.error('查询用户错误:', userError);
      return NextResponse.json(
        { success: false, error: '服务器内部错误' },
        { status: 500 }
      );
    }

    if (!users || users.length === 0) {
      return NextResponse.json(
        { success: false, error: '手机号或密码错误' },
        { status: 401 }
      );
    }

    const user = users[0];

    // 验证密码
    if (user.password !== password) {
      return NextResponse.json(
        { success: false, error: '手机号或密码错误' },
        { status: 401 }
      );
    }

    // 检查账号状态
    if (!user.is_active) {
      return NextResponse.json(
        { success: false, error: '账号已被禁用，请联系所属厂家' },
        { status: 403 }
      );
    }

    // 获取厂家信息
    let vendorName = '';
    if (user.vendor_id) {
      const { data: vendor } = await supabase
        .from('vendors')
        .select('name')
        .eq('id', user.vendor_id)
        .single();
      vendorName = vendor?.name || '';
    }

    // 返回用户信息（不包含密码）
    const { password: _, ...userInfo } = user;

    return NextResponse.json({
      success: true,
      user: {
        ...userInfo,
        vendorName,
      },
      message: '登录成功',
    });
  } catch (error) {
    console.error('用户登录错误:', error);
    return NextResponse.json(
      { success: false, error: '服务器内部错误' },
      { status: 500 }
    );
  }
}
