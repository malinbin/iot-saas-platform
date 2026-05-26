import { NextResponse } from 'next/server';
import { getSupabaseClient } from '@/storage/database/supabase-client';

export async function GET() {
  try {
    const supabase = getSupabaseClient();
    
    // TODO: 从 session 获取当前登录厂家
    const { data: vendors } = await supabase
      .from('vendors')
      .select('*')
      .eq('status', 'approved')
      .limit(1)
      .single();
    
    if (!vendors) {
      return NextResponse.json({ success: true, data: [] });
    }
    
    // 获取客户列表
    const { data: customers, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('vendor_id', vendors.id)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Fetch customers error:', error);
      return NextResponse.json({ success: true, data: [] });
    }
    
    // 为每个客户统计设备数量
    const customersWithStats = await Promise.all(
      (customers || []).map(async (customer) => {
        const { count: deviceCount } = await supabase
          .from('devices')
          .select('*', { count: 'exact', head: true })
          .eq('owner_id', customer.id);
        
        return {
          id: customer.id,
          name: customer.name,
          phone: customer.phone,
          email: customer.email,
          isActive: customer.is_active,
          expiresAt: customer.expires_at,
          createdAt: customer.created_at,
          deviceCount: deviceCount || 0,
        };
      })
    );
    
    return NextResponse.json({
      success: true,
      data: customersWithStats,
    });
  } catch (error) {
    console.error('Vendor customers fetch error:', error);
    return NextResponse.json(
      { success: false, error: '获取客户列表失败' },
      { status: 500 }
    );
  }
}
