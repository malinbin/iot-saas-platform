import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/storage/database/supabase-client';
import { v4 as uuidv4 } from 'uuid';

const supabase = getSupabaseClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      code,
      contact_name,
      contact_phone,
      contact_email,
      address,
      validity_days,
    } = body;

    // 验证必填字段
    if (!name || !code) {
      return NextResponse.json({ error: '厂家名称和编码不能为空' }, { status: 400 });
    }

    // 检查编码是否已存在
    const { data: existingVendor } = await supabase
      .from('vendors')
      .select('id')
      .eq('code', code)
      .single();

    if (existingVendor) {
      return NextResponse.json({ error: '厂家编码已存在' }, { status: 400 });
    }

    // 生成厂家ID
    const vendorId = uuidv4();

    // 计算到期时间
    let expiresAt = null;
    if (validity_days && validity_days > 0) {
      expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + validity_days);
    }

    // 创建厂家账号
    const { error: vendorError } = await supabase
      .from('vendors')
      .insert({
        id: vendorId,
        name,
        code,
        contact_name,
        contact_phone,
        contact_email,
        address,
        status: 'approved', // 管理员创建直接通过
        expires_at: expiresAt ? expiresAt.toISOString() : null,
        device_count: 0,
        customer_count: 0,
        monthly_revenue: '0',
      });

    if (vendorError) {
      console.error('Create vendor error:', vendorError);
      return NextResponse.json({ error: '创建厂家失败', details: vendorError.message }, { status: 500 });
    }

    // 创建关联的用户账号（厂家管理员）
    // 生成默认密码：厂家编码 + @2024
    const defaultPassword = `${code}@2024`;
    const userId = uuidv4();

    // 创建用户资料
    const { error: userError } = await supabase
      .from('user_profiles')
      .insert({
        id: userId,
        email: contact_email || `${code}@vendor.local`,
        name: contact_name || name,
        phone: contact_phone,
        role: 'vendor',
        vendor_id: vendorId,
        is_active: true,
        expires_at: expiresAt ? expiresAt.toISOString() : null,
      });

    if (userError) {
      console.error('Create user profile error:', userError);
      // 不影响厂家创建，只记录错误
    }

    return NextResponse.json({
      success: true,
      data: {
        vendor_id: vendorId,
        user_id: userId,
        default_email: contact_email || `${code}@vendor.local`,
        default_password: defaultPassword,
        expires_at: expiresAt ? expiresAt.toISOString() : null,
      },
      message: `商家账号创建成功！登录邮箱：${contact_email || `${code}@vendor.local`}，初始密码：${defaultPassword}`,
    });

  } catch (error) {
    console.error('Create vendor error:', error);
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}
