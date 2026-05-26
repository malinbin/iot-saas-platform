import type {
  Device,
  Vendor,
  Alert,
  Statistics,
  TrendData,
  RevenueTrend,
  ProductionData,
} from './types';

// 生成随机数
const random = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

// 生成随机状态
const randomStatus = (): Device['status'] => {
  const rand = Math.random();
  if (rand < 0.7) return 'online';
  if (rand < 0.85) return 'offline';
  if (rand < 0.95) return 'warning';
  return 'fault';
};

// 厂家名称列表
const vendorNames = [
  '智联科技',
  '工业物联网',
  '智能制造',
  '云端设备',
  '数字工厂',
  '科技装备',
  '智能机械',
  '物联传感',
];

// 设备型号列表
const deviceModels = [
  'ILT-2000',
  'ILT-3000',
  'ILT-5000',
  'SMC-100',
  'SMC-200',
  'IOT-Gateway',
  'Sensor-Pro',
  'Data-Hub',
];

// 地点列表
const locations = [
  '北京工厂',
  '上海工厂',
  '广州工厂',
  '深圳工厂',
  '成都工厂',
  '杭州工厂',
  '武汉工厂',
  '南京工厂',
];

// 生成厂家数据
export function generateVendors(): Vendor[] {
  return vendorNames.map((name, index) => ({
    id: `vendor-${index + 1}`,
    name,
    contact: `张${index + 1}`,
    email: `contact${index + 1}@${name.toLowerCase().replace(/\s+/g, '')}.com`,
    phone: `138${random(10000000, 99999999)}`,
    status: index < 6 ? 'approved' : 'pending',
    createdAt: new Date(Date.now() - random(1, 365) * 24 * 60 * 60 * 1000),
    deviceCount: random(50, 200),
    onlineCount: random(40, 150),
  }));
}

// 生成设备数据
export function generateDevices(count: number, vendors: Vendor[]): Device[] {
  const devices: Device[] = [];
  for (let i = 0; i < count; i++) {
    const vendor = vendors[random(0, vendors.length - 1)];
    const status = randomStatus();
    devices.push({
      id: `device-${i + 1}`,
      name: `设备-${String(i + 1).padStart(4, '0')}`,
      model: deviceModels[random(0, deviceModels.length - 1)],
      status,
      vendorId: vendor.id,
      vendorName: vendor.name,
      userId: `user-${random(1, 100)}`,
      userName: `用户${random(1, 100)}`,
      location: locations[random(0, locations.length - 1)],
      lastOnline: new Date(Date.now() - random(0, 7) * 24 * 60 * 60 * 1000),
      metrics: {
        temperature: random(20, 80),
        humidity: random(30, 90),
        pressure: random(1, 10),
        speed: random(100, 5000),
        power: random(100, 1000),
        efficiency: random(60, 100),
      },
    });
  }
  return devices;
}

// 生成告警数据
export function generateAlerts(devices: Device[]): Alert[] {
  const alerts: Alert[] = [];
  const faultDevices = devices.filter((d) => d.status === 'fault');
  const warningDevices = devices.filter((d) => d.status === 'warning');

  faultDevices.forEach((device, index) => {
    alerts.push({
      id: `alert-fault-${index}`,
      deviceId: device.id,
      deviceName: device.name,
      type: 'fault',
      message: '设备故障，需要立即维修',
      timestamp: new Date(Date.now() - random(0, 24) * 60 * 60 * 1000),
      acknowledged: Math.random() > 0.5,
      acknowledgedBy: Math.random() > 0.5 ? '管理员' : undefined,
    });
  });

  warningDevices.forEach((device, index) => {
    alerts.push({
      id: `alert-warning-${index}`,
      deviceId: device.id,
      deviceName: device.name,
      type: 'warning',
      message: '设备温度过高，请注意监控',
      timestamp: new Date(Date.now() - random(0, 24) * 60 * 60 * 1000),
      acknowledged: Math.random() > 0.5,
    });
  });

  return alerts.sort(
    (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
  );
}

// 生成统计数据
export function generateStatistics(
  devices: Device[],
  vendors: Vendor[]
): Statistics {
  const onlineDevices = devices.filter((d) => d.status === 'online').length;
  const offlineDevices = devices.filter((d) => d.status === 'offline').length;
  const faultDevices = devices.filter((d) => d.status === 'fault').length;
  const warningDevices = devices.filter((d) => d.status === 'warning').length;
  const pendingVendors = vendors.filter((v) => v.status === 'pending').length;

  return {
    totalDevices: devices.length,
    onlineDevices,
    offlineDevices,
    faultDevices,
    warningDevices,
    totalVendors: vendors.length,
    pendingVendors,
    totalUsers: random(500, 1000),
    totalRevenue: random(5000000, 10000000),
    monthlyRevenue: random(300000, 800000),
  };
}

// 生成趋势数据（最近30天）
export function generateTrendData(): Record<string, number | string>[] {
  const data: Record<string, number | string>[] = [];
  const now = new Date();

  for (let i = 29; i >= 0; i--) {
    const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    const devices = random(800, 1000);
    const online = Math.floor(devices * 0.7 + random(-50, 50));
    const offline = Math.floor(devices * 0.15 + random(-20, 20));
    const fault = devices - online - offline;

    data.push({
      date: `${date.getMonth() + 1}/${date.getDate()}`,
      devices,
      online,
      offline,
      fault,
    });
  }

  return data;
}

// 生成收益趋势数据（最近12个月）
export function generateRevenueTrend(): RevenueTrend[] {
  const data: RevenueTrend[] = [];
  const now = new Date();

  for (let i = 11; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    data.push({
      month: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`,
      revenue: random(300000, 800000),
      devices: random(50, 150),
    });
  }

  return data;
}

// 生成生产数据
export function generateProductionData(devices: Device[]): ProductionData[] {
  return devices.slice(0, 10).map((device, index) => ({
    id: `production-${index}`,
    deviceId: device.id,
    deviceName: device.name,
    output: random(100, 1000),
    efficiency: random(70, 100),
    runtime: random(100, 200),
    downtime: random(0, 20),
    timestamp: new Date(),
  }));
}

// 格式化货币
export function formatCurrency(value: number): string {
  if (value >= 10000) {
    return `¥${(value / 10000).toFixed(1)}万`;
  }
  return `¥${value.toLocaleString()}`;
}

// 格式化百分比
export function formatPercent(value: number, total: number): string {
  if (total === 0) return '0%';
  return `${((value / total) * 100).toFixed(1)}%`;
}
