import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/storage/database/supabase-client';

const supabase = getSupabaseClient();

// 厂家登录
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code, password } = body;

    if (!code || !password) {
      return NextResponse.json(
        { success: false, error: '请输入厂家编码和密码' },
        { status: 400 }
      );
    }

    // 查询厂家
    const { data: vendor, error } = await supabase
      .from('vendors')
      .select('id, name, code, contact_name, contact_phone, contact_email, status, is_active, password, expires_at')
      .eq('code', code)
      .single();

    if (error || !vendor) {
      return NextResponse.json(
        { success: false, error: '厂家编码不存在' },
        { status: 401 }
      );
    }

    // 检查厂家状态
    if (vendor.status !== 'approved') {
      return NextResponse.json(
        { success: false, error: '厂家账号未审核通过' },
        { status: 403 }
      );
    }

    if (!vendor.is_active) {
      return NextResponse.json(
        { success: false, error: '厂家账号已被禁用' },
        { status: 403 }
      );
    }

    // 检查是否过期
    if (vendor.expires_at && new Date(vendor.expires_at) < new Date()) {
      return NextResponse.json(
        { success: false, error: '厂家账号已过期' },
        { status: 403 }
      );
    }

    // 验证密码
    if (vendor.password !== password) {
      return NextResponse.json(
        { success: false, error: '密码错误' },
        { status: 401 }
      );
    }

    // 更新最后登录时间
    await supabase
      .from('vendors')
      .update({ last_login_at: new Date().toISOString() })
      .eq('id', vendor.id);

    // 返回登录成功信息（不包含密码）
    const { password: _, ...vendorInfo } = vendor;

    return NextResponse.json({
      success: true,
      vendor: vendorInfo,
      message: '登录成功'
    });

  } catch (error) {
    console.error('厂家登录失败:', error);
    return NextResponse.json(
      { success: false, error: '登录失败，请稍后重试' },
      { status: 500 }
    );
  }
}

// 获取当前登录厂家信息
export async function GET(request: NextRequest) {
  try {
    const vendorId = request.headers.get('x-vendor-id');
    
    if (!vendorId) {
      return NextResponse.json(
        { success: false, error: '未登录' },
        { status: 401 }
      );
    }

    const { data: vendor, error } = await supabase
      .from('vendors')
      .select('id, name, code, contact_name, contact_phone, contact_email, status, is_active, expires_at')
      .eq('id', vendorId)
      .single();

    if (error || !vendor) {
      return NextResponse.json(
        { success: false, error: '厂家不存在' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      vendor
    });

  } catch (error) {
    console.error('获取厂家信息失败:', error);
    return NextResponse.json(
      { success: false, error: '获取信息失败' },
      { status: 500 }
    );
  }
}
