import { NextRequest, NextResponse } from 'next/server';

// GET /api/user/devices/[id] - 获取设备详情（含模板和字段）
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: deviceId } = await params;

  try {
    // 模拟返回设备详情
    // 实际应从数据库查询：
    // 1. 查询设备信息
    // 2. 根据设备的 template_id 查询模板
    // 3. 查询模板的所有字段
    // 4. 查询设备最新数据

    const mockDevice = {
      id: deviceId,
      name: '注塑机-01',
      serial_number: 'SN202401001',
      status: 'online',
      location: '华东机械-A车间',
      template_id: 'tpl_1',
      vendor_id: 'vendor_1',
    };

    const mockTemplate = {
      id: 'tpl_1',
      name: '注塑机',
      code: 'injection_molding',
      description: '塑料注塑成型设备',
      icon: ' Boxes',
    };

    const mockFields = [
      { 
        id: 'f1',
        template_id: 'tpl_1',
        field_key: 'temperature', 
        field_name: '温度', 
        field_type: 'number', 
        unit: '℃', 
        icon: 'Thermometer', 
        color: '#ef4444', 
        chart_type: 'line', 
        show_in_dashboard: true, 
        sort_order: 1,
        alert_max: 80,
        alert_min: 20,
      },
      { 
        id: 'f2',
        template_id: 'tpl_1',
        field_key: 'pressure', 
        field_name: '压力', 
        field_type: 'number', 
        unit: 'MPa', 
        icon: 'Activity', 
        color: '#ec4899', 
        chart_type: 'line', 
        show_in_dashboard: true, 
        sort_order: 2,
        alert_max: 15,
      },
      { 
        id: 'f3',
        template_id: 'tpl_1',
        field_key: 'speed', 
        field_name: '转速', 
        field_type: 'number', 
        unit: 'rpm', 
        icon: 'RotateCw', 
        color: '#8b5cf6', 
        chart_type: 'line', 
        show_in_dashboard: true, 
        sort_order: 3,
      },
      { 
        id: 'f4',
        template_id: 'tpl_1',
        field_key: 'power', 
        field_name: '功率', 
        field_type: 'number', 
        unit: 'kW', 
        icon: 'Zap', 
        color: '#f59e0b', 
        chart_type: 'bar', 
        show_in_dashboard: true, 
        sort_order: 4,
      },
      { 
        id: 'f5',
        template_id: 'tpl_1',
        field_key: 'efficiency', 
        field_name: '效率', 
        field_type: 'number', 
        unit: '%', 
        icon: 'Gauge', 
        color: '#22c55e', 
        chart_type: 'gauge', 
        show_in_dashboard: true, 
        sort_order: 5,
      },
      { 
        id: 'f6',
        template_id: 'tpl_1',
        field_key: 'output', 
        field_name: '产量', 
        field_type: 'number', 
        unit: '件/h', 
        icon: 'Boxes', 
        color: '#06b6d4', 
        chart_type: 'bar', 
        show_in_dashboard: true, 
        sort_order: 6,
      },
      { 
        id: 'f7',
        template_id: 'tpl_1',
        field_key: 'runtime', 
        field_name: '运行时长', 
        field_type: 'number', 
        unit: 'h', 
        icon: 'Timer', 
        color: '#84cc16', 
        chart_type: 'none', 
        show_in_dashboard: false, 
        sort_order: 7,
      },
    ];

    const mockRealtimeData = {
      temperature: 45.2 + Math.random() * 5,
      pressure: 5.8 + Math.random() * 0.5,
      speed: 3200 + Math.random() * 200,
      power: 45.6 + Math.random() * 10,
      efficiency: 92.3 + Math.random() * 5,
      output: 120 + Math.random() * 20,
      runtime: 1256,
    };

    return NextResponse.json({
      device: mockDevice,
      template: mockTemplate,
      fields: mockFields,
      realtime_data: mockRealtimeData,
    });
  } catch (error) {
    return NextResponse.json(
      { error: '获取设备详情失败' },
      { status: 500 }
    );
  }
}
