'use client';

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
} from 'lucide-react';

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-white">系统设置</h1>
        <p className="text-sm text-[#94A3B8]">配置平台全局参数</p>
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
                  defaultValue="工业物联网管理平台" 
                  className="mt-1 border-[#1E3A5F] bg-[#0A1628] text-white" 
                />
              </div>
              <div>
                <label className="text-sm font-medium text-white">平台域名</label>
                <Input 
                  defaultValue="iot.example.com" 
                  className="mt-1 border-[#1E3A5F] bg-[#0A1628] text-white" 
                />
              </div>
              <div>
                <label className="text-sm font-medium text-white">客服邮箱</label>
                <Input 
                  defaultValue="support@iot.com" 
                  className="mt-1 border-[#1E3A5F] bg-[#0A1628] text-white" 
                />
              </div>
              <div>
                <label className="text-sm font-medium text-white">客服电话</label>
                <Input 
                  defaultValue="400-888-8888" 
                  className="mt-1 border-[#1E3A5F] bg-[#0A1628] text-white" 
                />
              </div>
            </div>
            <Button className="bg-[#2563EB] hover:bg-[#1D4ED8]">
              <Save className="mr-2 h-4 w-4" />
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
                <Select defaultValue="30">
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
                <Select defaultValue="60">
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
              <Switch defaultChecked />
            </div>
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
                <Select defaultValue="5">
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
                <Select defaultValue="120">
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
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-white">IP白名单</div>
                <div className="text-sm text-[#94A3B8]">仅允许白名单IP访问管理后台</div>
              </div>
              <Switch />
            </div>
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
                <Select defaultValue="30">
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
                <Select defaultValue="365">
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
              <Switch defaultChecked />
            </div>
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
            <div className="flex items-center justify-between rounded-lg border border-[#1E3A5F] bg-[#0A1628] p-4">
              <div>
                <div className="font-medium text-white">主API密钥</div>
                <div className="font-mono text-sm text-[#94A3B8]">sk-****-****-****-abcd1234</div>
              </div>
              <Button variant="outline" className="border-[#1E3A5F] text-white">
                重新生成
              </Button>
            </div>
            <Button className="bg-[#2563EB] hover:bg-[#1D4ED8]">
              生成新密钥
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
