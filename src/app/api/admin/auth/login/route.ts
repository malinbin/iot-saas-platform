import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/storage/database/supabase-client';

const supabase = getSupabaseClient();

// 管理员登录
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: '用户名和密码不能为空' },
        { status: 400 }
      );
    }

    // 查询管理员账号
    // 使用 system_config 表存储管理员信息
    const { data: configData, error: configError } = await supabase
      .from('system_config')
      .select('config_value')
      .eq('config_key', 'admin_accounts')
      .single();

    let adminAccounts = [];
    if (configData?.config_value) {
      adminAccounts = configData.config_value.accounts || [];
    }

    // 默认管理员账号
    if (adminAccounts.length === 0) {
      adminAccounts = [
        {
          id: 'admin-001',
          username: 'admin',
          password: 'admin123',
          name: '系统管理员',
          role: 'super_admin',
        }
      ];
    }

    // 查找匹配的管理员
    const admin = adminAccounts.find(
      (a: any) => a.username === username && a.password === password
    );

    if (!admin) {
      return NextResponse.json(
        { success: false, error: '用户名或密码错误' },
        { status: 401 }
      );
    }

    // 返回管理员信息（不包含密码）
    const { password: _, ...adminInfo } = admin;

    return NextResponse.json({
      success: true,
      admin: adminInfo,
      message: '登录成功',
    });
  } catch (error) {
    console.error('管理员登录错误:', error);
    return NextResponse.json(
      { success: false, error: '服务器内部错误' },
      { status: 500 }
    );
  }
}
