import { createClient } from '@supabase/supabase-js';

const CONFIG_KEY = 'system_settings';

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

// 获取 Supabase admin client
function getAdminClient() {
  const url = process.env.COZE_SUPABASE_URL;
  const serviceKey = process.env.COZE_SUPABASE_SERVICE_ROLE_KEY;
  
  if (!url || !serviceKey) {
    return null;
  }
  
  return createClient(url, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

/**
 * 获取系统设置
 * @returns 系统设置对象
 */
export async function getSystemSettings(): Promise<SystemSettings> {
  try {
    const supabase = getAdminClient();
    if (!supabase) {
      return defaultSettings;
    }
    
    const { data, error } = await supabase
      .from('system_config')
      .select('config_value')
      .eq('config_key', CONFIG_KEY)
      .maybeSingle();
    
    if (error || !data) {
      return defaultSettings;
    }
    
    return { ...defaultSettings, ...data.config_value };
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
  const alertTime = new Date(alertCreatedAt).getTime();
  const now = Date.now();
  const escalateMs = config.faultAutoEscalate * 60 * 1000;
  
  return (now - alertTime) > escalateMs;
}

/**
 * 检查IP是否在白名单中
 * @param ip 要检查的IP地址
 * @param settings 系统设置（可选）
 * @returns 是否允许访问
 */
export async function isIpAllowed(
  ip: string,
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
    .map(s => s.trim())
    .filter(Boolean);
  
  return whitelist.includes(ip);
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
 * 是否启用自动短信告警
 */
export async function isAutoSmsAlertEnabled(): Promise<boolean> {
  const settings = await getSystemSettings();
  return settings.autoSmsAlert;
}

/**
 * 获取数据保留天数
 */
export async function getDataRetentionDays(): Promise<number> {
  const settings = await getSystemSettings();
  return settings.dataRetention;
}

/**
 * 是否启用自动归档
 */
export async function isAutoArchiveEnabled(): Promise<boolean> {
  const settings = await getSystemSettings();
  return settings.autoArchive;
}

/**
 * 获取数据采集间隔（毫秒）
 */
export async function getCollectIntervalMs(): Promise<number> {
  const settings = await getSystemSettings();
  return settings.collectInterval * 60 * 1000;
}
