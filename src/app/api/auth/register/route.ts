import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/storage/database/supabase-client';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  try {
    const { phone, password, name } = await request.json();

    if (!phone || !password || !name) {
      return NextResponse.json(
        { error: '手机号、密码和姓名不能为空' },
        { status: 400 }
      );
    }

    const supabase = getSupabaseClient();

    // 检查手机号是否已注册
    const { data: existingUsers } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('phone', phone)
      .limit(1);

    if (existingUsers && existingUsers.length > 0) {
      return NextResponse.json(
        { error: '该手机号已注册' },
        { status: 400 }
      );
    }

    // 创建用户
    const userId = uuidv4();
    const { error: insertError } = await supabase
      .from('user_profiles')
      .insert({
        id: userId,
        email: `${phone}@temp.com`, // 临时邮箱
        name,
        phone,
        role: 'user',
        is_active: true,
        metadata: {
          password, // 实际项目应使用加密存储
        },
      });

    if (insertError) {
      throw new Error(`创建用户失败: ${insertError.message}`);
    }

    return NextResponse.json({
      success: true,
      message: '注册成功',
    });
  } catch (error) {
    console.error('注册失败:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '注册失败' },
      { status: 500 }
    );
  }
}
