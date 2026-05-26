// 设备状态类型
export type DeviceStatus = 'online' | 'offline' | 'fault' | 'warning';

// 设备类型
export interface Device {
  id: string;
  name: string;
  model: string;
  status: DeviceStatus;
  vendorId: string;
  vendorName: string;
  userId?: string;
  userName?: string;
  location: string;
  lastOnline: Date;
  metrics: {
    temperature?: number;
    humidity?: number;
    pressure?: number;
    speed?: number;
    power?: number;
    efficiency?: number;
  };
}

// 厂家类型
export interface Vendor {
  id: string;
  name: string;
  contact: string;
  email: string;
  phone: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
  deviceCount: number;
  onlineCount: number;
}

// 用户类型
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'super_admin' | 'vendor' | 'user';
  vendorId?: string;
  createdAt: Date;
}

// 统计数据类型
export interface Statistics {
  totalDevices: number;
  onlineDevices: number;
  offlineDevices: number;
  faultDevices: number;
  warningDevices: number;
  totalVendors: number;
  pendingVendors: number;
  totalUsers: number;
  totalRevenue: number;
  monthlyRevenue: number;
}

// 设备趋势数据
export interface TrendData {
  date: string;
  devices: number;
  online: number;
  offline: number;
  fault: number;
}

// 收益趋势数据
export interface RevenueTrend {
  month: string;
  revenue: number;
  devices: number;
}

// 告警类型
export interface Alert {
  id: string;
  deviceId: string;
  deviceName: string;
  type: 'fault' | 'warning' | 'info';
  message: string;
  timestamp: Date;
  acknowledged: boolean;
  acknowledgedBy?: string;
}

// 生产数据类型
export interface ProductionData {
  id: string;
  deviceId: string;
  deviceName: string;
  output: number;
  efficiency: number;
  runtime: number;
  downtime: number;
  timestamp: Date;
}
