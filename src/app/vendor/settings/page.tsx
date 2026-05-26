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
  Building2, 
  Bell, 
  Shield, 
  Palette,
  Database,
  Save,
} from 'lucide-react';

export default function VendorSettingsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-[#1E293B]">系统设置</h1>
        <p className="text-sm text-[#64748B]">配置商家端系统参数</p>
      </div>

      <div className="grid gap-6">
        {/* 公司信息 */}
        <Card className="border-[#E2E8F0]">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-[#2563EB]" />
              <div>
                <CardTitle className="text-lg text-[#1E293B]">公司信息</CardTitle>
                <CardDescription>设置公司基本信息</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-[#1E293B]">公司名称</label>
                <Input defaultValue="智联科技有限公司" className="mt-1" />
              </div>
              <div>
                <label className="text-sm font-medium text-[#1E293B]">联系人</label>
                <Input defaultValue="张经理" className="mt-1" />
              </div>
              <div>
                <label className="text-sm font-medium text-[#1E293B]">联系电话</label>
                <Input defaultValue="138****5678" className="mt-1" />
              </div>
              <div>
                <label className="text-sm font-medium text-[#1E293B]">公司邮箱</label>
                <Input defaultValue="contact@zhilian.com" className="mt-1" />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-[#1E293B]">公司地址</label>
              <Input defaultValue="江苏省苏州市工业园区星湖街328号" className="mt-1" />
            </div>
            <Button className="bg-[#2563EB] hover:bg-[#1D4ED8]">
              <Save className="mr-2 h-4 w-4" />
              保存修改
            </Button>
          </CardContent>
        </Card>

        {/* 通知设置 */}
        <Card className="border-[#E2E8F0]">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-[#2563EB]" />
              <div>
                <CardTitle className="text-lg text-[#1E293B]">通知设置</CardTitle>
                <CardDescription>配置告警通知方式</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-[#1E293B]">设备故障告警</div>
                <div className="text-sm text-[#64748B]">设备发生故障时发送通知</div>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-[#1E293B]">设备离线告警</div>
                <div className="text-sm text-[#64748B]">设备离线超过30分钟时发送通知</div>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-[#1E293B]">性能预警</div>
                <div className="text-sm text-[#64748B]">设备性能低于阈值时发送通知</div>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-[#1E293B]">每日汇总报告</div>
                <div className="text-sm text-[#64748B]">每日发送设备运行汇总报告</div>
              </div>
              <Switch />
            </div>
            <div className="grid gap-4 md:grid-cols-2 pt-4">
              <div>
                <label className="text-sm font-medium text-[#1E293B]">通知方式</label>
                <Select defaultValue="sms">
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sms">短信通知</SelectItem>
                    <SelectItem value="email">邮件通知</SelectItem>
                    <SelectItem value="wechat">微信通知</SelectItem>
                    <SelectItem value="all">全部方式</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-[#1E293B]">告警级别</label>
                <Select defaultValue="all">
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部级别</SelectItem>
                    <SelectItem value="high">仅高优先级</SelectItem>
                    <SelectItem value="medium">中及以上</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 数据设置 */}
        <Card className="border-[#E2E8F0]">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Database className="h-5 w-5 text-[#2563EB]" />
              <div>
                <CardTitle className="text-lg text-[#1E293B]">数据设置</CardTitle>
                <CardDescription>配置数据采集和存储参数</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-[#1E293B]">数据采集间隔</label>
                <Select defaultValue="30">
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10秒</SelectItem>
                    <SelectItem value="30">30秒</SelectItem>
                    <SelectItem value="60">1分钟</SelectItem>
                    <SelectItem value="300">5分钟</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-[#1E293B]">数据保留时长</label>
                <Select defaultValue="90">
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30天</SelectItem>
                    <SelectItem value="90">90天</SelectItem>
                    <SelectItem value="180">180天</SelectItem>
                    <SelectItem value="365">1年</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 安全设置 */}
        <Card className="border-[#E2E8F0]">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-[#2563EB]" />
              <div>
                <CardTitle className="text-lg text-[#1E293B]">安全设置</CardTitle>
                <CardDescription>配置账户安全选项</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-[#1E293B]">双因素认证</div>
                <div className="text-sm text-[#64748B]">登录时需要二次验证</div>
              </div>
              <Switch />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-[#1E293B]">登录通知</div>
                <div className="text-sm text-[#64748B]">新设备登录时发送通知</div>
              </div>
              <Switch defaultChecked />
            </div>
            <Button variant="outline" className="border-[#E2E8F0]">
              修改密码
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
