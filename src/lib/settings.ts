import { getSupabaseClient } from '@/storage/database/supabase-client';

export interface SystemSettings {
  // 平台信息
  platformName: string;
  platformDomain: string;
  supportEmail: string;
  supportPhone: string;
  
  // 告警规则
  offlineThreshold: number;
  faultAutoEscalate: number;
  autoSmsAlert: boolean;
  
  // 安全配置
  loginFailLock: number;
  sessionTimeout: number;
  forceTwoFactor: boolean;
  ipWhitelist: boolean;
  ipWhitelistValues: string;
  
  // 数据配置
  collectInterval: number;
  dataRetention: number;
  autoArchive: boolean;
  
  // API密钥
  apiKey: string;
  apiSecret: string;
}

const defaultSettings: SystemSettings = {
  platformName: '工业物联网管理平台',
  platformDomain: 'iot.example.com',
  supportEmail: 'support@iot.com',
  supportPhone: '400-888-8888',
  offlineThreshold: 30,
  faultAutoEscalate: 60,
  autoSmsAlert: true,
  loginFailLock: 5,
  sessionTimeout: 120,
  forceTwoFactor: true,
  ipWhitelist: false,
  ipWhitelistValues: '',
  collectInterval: 30,
  dataRetention: 365,
  autoArchive: true,
  apiKey: '',
  apiSecret: '',
};

/**
 * 获取系统设置
 * @returns 系统设置对象
 */
export async function getSystemSettings(): Promise<SystemSettings> {
  try {
    const supabase = getSupabaseClient();
    
    const { data, error } = await supabase
      .from('configurations')
      .select('data')
      .eq('business_type', 'system_settings')
      .eq('business_id', 'global')
      .single();
    
    if (error || !data) {
      return defaultSettings;
    }
    
    return { ...defaultSettings, ...data.data };
  } catch (error) {
    console.error('获取系统设置失败:', error);
    return defaultSettings;
  }
}

/**
 * 判断设备是否离线
 * @param lastHeartbeatAt 最后心跳时间
 * @param settings 系统设置（可选，不传则自动获取）
 * @returns 是否离线
 */
export async function isDeviceOffline(
  lastHeartbeatAt: string | null,
  settings?: SystemSettings
): Promise<boolean> {
  if (!lastHeartbeatAt) {
    return true;
  }
  
  const config = settings || await getSystemSettings();
  const lastHeartbeat = new Date(lastHeartbeatAt).getTime();
  const now = Date.now();
  const thresholdMs = config.offlineThreshold * 60 * 1000;
  
  return (now - lastHeartbeat) > thresholdMs;
}

/**
 * 判断告警是否需要自动升级
 * @param alertCreatedAt 告警创建时间
 * @param settings 系统设置（可选）
 * @returns 是否需要升级
 */
export async function shouldEscalateAlert(
  alertCreatedAt: string,
  settings?: SystemSettings
): Promise<boolean> {
  const config = settings || await getSystemSettings();
  const createdTime = new Date(alertCreatedAt).getTime();
  const now = Date.now();
  const escalateMs = config.faultAutoEscalate * 60 * 1000;
  
  return (now - createdTime) > escalateMs;
}

/**
 * 检查IP是否在白名单中
 * @param clientIp 客户端IP
 * @param settings 系统设置（可选）
 * @returns 是否允许访问
 */
export async function isIpAllowed(
  clientIp: string,
  settings?: SystemSettings
): Promise<boolean> {
  const config = settings || await getSystemSettings();
  
  // 如果未启用白名单，允许所有IP
  if (!config.ipWhitelist) {
    return true;
  }
  
  // 检查IP是否在白名单中
  const whitelist = config.ipWhitelistValues
    .split(',')
    .map(ip => ip.trim())
    .filter(ip => ip.length > 0);
  
  return whitelist.includes(clientIp);
}

/**
 * 获取会话超时时间（毫秒）
 */
export async function getSessionTimeoutMs(): Promise<number> {
  const settings = await getSystemSettings();
  return settings.sessionTimeout * 60 * 1000;
}

/**
 * 获取登录失败锁定次数
 */
export async function getLoginFailLockCount(): Promise<number> {
  const settings = await getSystemSettings();
  return settings.loginFailLock;
}

/**
 * 获取数据保留天数
 */
export async function getDataRetentionDays(): Promise<number> {
  const settings = await getSystemSettings();
  return settings.dataRetention;
}

/**
 * 获取数据采集间隔（秒）
 */
export async function getCollectInterval(): Promise<number> {
  const settings = await getSystemSettings();
  return settings.collectInterval;
}

/**
 * 是否启用自动短信告警
 */
export async function isAutoSmsAlertEnabled(): Promise<boolean> {
  const settings = await getSystemSettings();
  return settings.autoSmsAlert;
}

/**
 * 是否强制双因素认证
 */
export async function isForceTwoFactorEnabled(): Promise<boolean> {
  const settings = await getSystemSettings();
  return settings.forceTwoFactor;
}

/**
 * 是否自动归档
 */
export async function isAutoArchiveEnabled(): Promise<boolean> {
  const settings = await getSystemSettings();
  return settings.autoArchive;
}
