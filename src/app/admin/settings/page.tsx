'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Settings, 
  Bell, 
  Shield, 
  Database,
  Globe,
  Save,
  Key,
  Loader2,
  Eye,
  EyeOff,
  Copy,
  RefreshCw,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface SystemSettings {
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

export default function AdminSettingsPage() {
  const { toast } = useToast();
  const [settings, setSettings] = useState<SystemSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [showApiSecret, setShowApiSecret] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState<{ open: boolean; action: () => void; title: string }>({
    open: false,
    action: () => {},
    title: '',
  });

  // 加载设置
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/settings');
      const data = await res.json();
      
      if (data.success && data.settings) {
        setSettings({ ...defaultSettings, ...data.settings });
      }
    } catch (error) {
      console.error('加载设置失败:', error);
      toast({
        title: '加载失败',
        description: '无法加载系统设置',
        variant: 'error' as const,
      });
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async (section: string, newSettings: Partial<SystemSettings>) => {
    try {
      setSaving(section);
      const updatedSettings = { ...settings, ...newSettings };
      
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedSettings),
      });
      
      const data = await res.json();
      
      if (data.success) {
        setSettings(updatedSettings);
        toast({
          title: '保存成功',
          description: `${section}设置已保存`,
        });
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('保存设置失败:', error);
      toast({
        title: '保存失败',
        description: '请稍后重试',
        variant: 'error' as const,
      });
    } finally {
      setSaving(null);
    }
  };

  const generateApiKey = () => {
    const key = 'sk_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const secret = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    return { apiKey: key, apiSecret: secret };
  };

  const handleGenerateApiKey = () => {
    setConfirmDialog({
      open: true,
      title: '重新生成API密钥',
      action: () => {
        const newKeys = generateApiKey();
        saveSettings('API密钥', newKeys);
      },
    });
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: '复制成功',
      description: `${label}已复制到剪贴板`,
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-[#2563EB]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">系统设置</h1>
          <p className="text-sm text-[#94A3B8]">配置平台全局参数</p>
        </div>
        <Button variant="outline" onClick={loadSettings} className="border-[#1E3A5F] text-white">
          <RefreshCw className="mr-2 h-4 w-4" />
          刷新
        </Button>
      </div>

      <div className="grid gap-6">
        {/* 平台信息 */}
        <Card className="border-[#1E3A5F] bg-[#1E3A5F]">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-[#2563EB]" />
              <div>
                <CardTitle className="text-lg text-white">平台信息</CardTitle>
                <CardDescription className="text-[#94A3B8]">设置平台基本信息</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-white">平台名称</label>
                <Input 
                  value={settings.platformName}
                  onChange={(e) => setSettings({ ...settings, platformName: e.target.value })}
                  className="mt-1 border-[#1E3A5F] bg-[#0A1628] text-white" 
                />
              </div>
              <div>
                <label className="text-sm font-medium text-white">平台域名</label>
                <Input 
                  value={settings.platformDomain}
                  onChange={(e) => setSettings({ ...settings, platformDomain: e.target.value })}
                  className="mt-1 border-[#1E3A5F] bg-[#0A1628] text-white" 
                />
              </div>
              <div>
                <label className="text-sm font-medium text-white">客服邮箱</label>
                <Input 
                  value={settings.supportEmail}
                  onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
                  className="mt-1 border-[#1E3A5F] bg-[#0A1628] text-white" 
                />
              </div>
              <div>
                <label className="text-sm font-medium text-white">客服电话</label>
                <Input 
                  value={settings.supportPhone}
                  onChange={(e) => setSettings({ ...settings, supportPhone: e.target.value })}
                  className="mt-1 border-[#1E3A5F] bg-[#0A1628] text-white" 
                />
              </div>
            </div>
            <Button 
              onClick={() => saveSettings('平台信息', {
                platformName: settings.platformName,
                platformDomain: settings.platformDomain,
                supportEmail: settings.supportEmail,
                supportPhone: settings.supportPhone,
              })}
              disabled={saving === '平台信息'}
              className="bg-[#2563EB] hover:bg-[#1D4ED8]"
            >
              {saving === '平台信息' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              保存修改
            </Button>
          </CardContent>
        </Card>

        {/* 告警规则 */}
        <Card className="border-[#1E3A5F] bg-[#1E3A5F]">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-[#2563EB]" />
              <div>
                <CardTitle className="text-lg text-white">告警规则</CardTitle>
                <CardDescription className="text-[#94A3B8]">配置全局告警触发规则</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-white">设备离线阈值</label>
                <Select 
                  value={String(settings.offlineThreshold)}
                  onValueChange={(v) => setSettings({ ...settings, offlineThreshold: Number(v) })}
                >
                  <SelectTrigger className="mt-1 border-[#1E3A5F] bg-[#0A1628] text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10分钟</SelectItem>
                    <SelectItem value="30">30分钟</SelectItem>
                    <SelectItem value="60">1小时</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-white">故障自动升级</label>
                <Select 
                  value={String(settings.faultAutoEscalate)}
                  onValueChange={(v) => setSettings({ ...settings, faultAutoEscalate: Number(v) })}
                >
                  <SelectTrigger className="mt-1 border-[#1E3A5F] bg-[#0A1628] text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30分钟</SelectItem>
                    <SelectItem value="60">1小时</SelectItem>
                    <SelectItem value="120">2小时</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-white">自动发送短信告警</div>
                <div className="text-sm text-[#94A3B8]">高优先级告警自动短信通知</div>
              </div>
              <Switch 
                checked={settings.autoSmsAlert}
                onCheckedChange={(checked) => setSettings({ ...settings, autoSmsAlert: checked })}
              />
            </div>
            <Button 
              onClick={() => saveSettings('告警规则', {
                offlineThreshold: settings.offlineThreshold,
                faultAutoEscalate: settings.faultAutoEscalate,
                autoSmsAlert: settings.autoSmsAlert,
              })}
              disabled={saving === '告警规则'}
              className="bg-[#2563EB] hover:bg-[#1D4ED8]"
            >
              {saving === '告警规则' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              保存修改
            </Button>
          </CardContent>
        </Card>

        {/* 安全配置 */}
        <Card className="border-[#1E3A5F] bg-[#1E3A5F]">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-[#2563EB]" />
              <div>
                <CardTitle className="text-lg text-white">安全配置</CardTitle>
                <CardDescription className="text-[#94A3B8]">配置平台安全策略</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-white">登录失败锁定</label>
                <Select 
                  value={String(settings.loginFailLock)}
                  onValueChange={(v) => setSettings({ ...settings, loginFailLock: Number(v) })}
                >
                  <SelectTrigger className="mt-1 border-[#1E3A5F] bg-[#0A1628] text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3">3次</SelectItem>
                    <SelectItem value="5">5次</SelectItem>
                    <SelectItem value="10">10次</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-white">会话超时</label>
                <Select 
                  value={String(settings.sessionTimeout)}
                  onValueChange={(v) => setSettings({ ...settings, sessionTimeout: Number(v) })}
                >
                  <SelectTrigger className="mt-1 border-[#1E3A5F] bg-[#0A1628] text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30分钟</SelectItem>
                    <SelectItem value="60">1小时</SelectItem>
                    <SelectItem value="120">2小时</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-white">强制双因素认证</div>
                <div className="text-sm text-[#94A3B8]">所有管理员必须开启双因素认证</div>
              </div>
              <Switch 
                checked={settings.forceTwoFactor}
                onCheckedChange={(checked) => setSettings({ ...settings, forceTwoFactor: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-white">IP白名单</div>
                <div className="text-sm text-[#94A3B8]">仅允许白名单IP访问管理后台</div>
              </div>
              <Switch 
                checked={settings.ipWhitelist}
                onCheckedChange={(checked) => setSettings({ ...settings, ipWhitelist: checked })}
              />
            </div>
            {settings.ipWhitelist && (
              <div>
                <label className="text-sm font-medium text-white">白名单IP列表</label>
                <Input 
                  value={settings.ipWhitelistValues}
                  onChange={(e) => setSettings({ ...settings, ipWhitelistValues: e.target.value })}
                  placeholder="多个IP用逗号分隔，如：192.168.1.1, 10.0.0.1"
                  className="mt-1 border-[#1E3A5F] bg-[#0A1628] text-white" 
                />
              </div>
            )}
            <Button 
              onClick={() => saveSettings('安全配置', {
                loginFailLock: settings.loginFailLock,
                sessionTimeout: settings.sessionTimeout,
                forceTwoFactor: settings.forceTwoFactor,
                ipWhitelist: settings.ipWhitelist,
                ipWhitelistValues: settings.ipWhitelistValues,
              })}
              disabled={saving === '安全配置'}
              className="bg-[#2563EB] hover:bg-[#1D4ED8]"
            >
              {saving === '安全配置' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              保存修改
            </Button>
          </CardContent>
        </Card>

        {/* 数据配置 */}
        <Card className="border-[#1E3A5F] bg-[#1E3A5F]">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Database className="h-5 w-5 text-[#2563EB]" />
              <div>
                <CardTitle className="text-lg text-white">数据配置</CardTitle>
                <CardDescription className="text-[#94A3B8]">配置数据采集和存储策略</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-white">默认采集间隔</label>
                <Select 
                  value={String(settings.collectInterval)}
                  onValueChange={(v) => setSettings({ ...settings, collectInterval: Number(v) })}
                >
                  <SelectTrigger className="mt-1 border-[#1E3A5F] bg-[#0A1628] text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10秒</SelectItem>
                    <SelectItem value="30">30秒</SelectItem>
                    <SelectItem value="60">1分钟</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-white">数据保留时长</label>
                <Select 
                  value={String(settings.dataRetention)}
                  onValueChange={(v) => setSettings({ ...settings, dataRetention: Number(v) })}
                >
                  <SelectTrigger className="mt-1 border-[#1E3A5F] bg-[#0A1628] text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="90">90天</SelectItem>
                    <SelectItem value="180">180天</SelectItem>
                    <SelectItem value="365">1年</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-white">自动数据归档</div>
                <div className="text-sm text-[#94A3B8]">自动归档90天前的数据</div>
              </div>
              <Switch 
                checked={settings.autoArchive}
                onCheckedChange={(checked) => setSettings({ ...settings, autoArchive: checked })}
              />
            </div>
            <Button 
              onClick={() => saveSettings('数据配置', {
                collectInterval: settings.collectInterval,
                dataRetention: settings.dataRetention,
                autoArchive: settings.autoArchive,
              })}
              disabled={saving === '数据配置'}
              className="bg-[#2563EB] hover:bg-[#1D4ED8]"
            >
              {saving === '数据配置' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              保存修改
            </Button>
          </CardContent>
        </Card>

        {/* API密钥 */}
        <Card className="border-[#1E3A5F] bg-[#1E3A5F]">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Key className="h-5 w-5 text-[#2563EB]" />
              <div>
                <CardTitle className="text-lg text-white">API密钥管理</CardTitle>
                <CardDescription className="text-[#94A3B8]">管理平台API访问密钥</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-white">API Key</label>
                <div className="flex gap-2 mt-1">
                  <Input 
                    value={settings.apiKey || '未生成'}
                    readOnly
                    className="flex-1 border-[#1E3A5F] bg-[#0A1628] text-white font-mono" 
                  />
                  {settings.apiKey && (
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => copyToClipboard(settings.apiKey, 'API Key')}
                      className="border-[#1E3A5F]"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-white">API Secret</label>
                <div className="flex gap-2 mt-1">
                  <Input 
                    type={showApiSecret ? 'text' : 'password'}
                    value={settings.apiSecret || '未生成'}
                    readOnly
                    className="flex-1 border-[#1E3A5F] bg-[#0A1628] text-white font-mono" 
                  />
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => setShowApiSecret(!showApiSecret)}
                    className="border-[#1E3A5F]"
                  >
                    {showApiSecret ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                  {settings.apiSecret && (
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => copyToClipboard(settings.apiSecret, 'API Secret')}
                      className="border-[#1E3A5F]"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={handleGenerateApiKey}
                disabled={saving === 'API密钥'}
                className="bg-[#2563EB] hover:bg-[#1D4ED8]"
              >
                {saving === 'API密钥' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Key className="mr-2 h-4 w-4" />}
                {settings.apiKey ? '重新生成密钥' : '生成密钥'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 确认弹窗 */}
      <Dialog open={confirmDialog.open} onOpenChange={(open) => setConfirmDialog({ ...confirmDialog, open })}>
        <DialogContent className="border-[#1E3A5F] bg-[#1E3A5F]">
          <DialogHeader>
            <DialogTitle className="text-white">{confirmDialog.title}</DialogTitle>
            <DialogDescription className="text-[#94A3B8]">
              此操作将使旧密钥失效，已使用旧密钥的应用需要更新配置。确定要继续吗？
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setConfirmDialog({ ...confirmDialog, open: false })}
              className="border-[#1E3A5F] text-white"
            >
              取消
            </Button>
            <Button 
              onClick={() => {
                confirmDialog.action();
                setConfirmDialog({ ...confirmDialog, open: false });
              }}
              className="bg-[#2563EB] hover:bg-[#1D4ED8]"
            >
              确定
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
