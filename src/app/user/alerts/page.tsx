'use client';

import { AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { generateVendors, generateDevices, generateAlerts } from '@/lib/mock-data';

export default function UserAlertsPage() {
  const vendors = generateVendors();
  const devices = generateDevices(12, [vendors[0]]);
  const alerts = generateAlerts(devices);

  // 统计
  const faultAlerts = alerts.filter((a) => a.type === 'fault').length;
  const warningAlerts = alerts.filter((a) => a.type === 'warning').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#0F172A]">故障报警</h1>
        <p className="text-sm text-[#64748B]">查看设备故障和告警信息</p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card className="border-[#E0F2FE] bg-white shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-[#64748B]">故障告警</div>
                <div className="mt-1 text-3xl font-bold text-[#EF4444]">
                  {faultAlerts}
                </div>
              </div>
              <AlertTriangle className="h-8 w-8 text-[#EF4444]" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#E0F2FE] bg-white shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-[#64748B]">警告告警</div>
                <div className="mt-1 text-3xl font-bold text-[#F59E0B]">
                  {warningAlerts}
                </div>
              </div>
              <AlertTriangle className="h-8 w-8 text-[#F59E0B]" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#E0F2FE] bg-white shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-[#64748B]">已处理</div>
                <div className="mt-1 text-3xl font-bold text-[#22C55E]">
                  {alerts.filter((a) => a.acknowledged).length}
                </div>
              </div>
              <CheckCircle className="h-8 w-8 text-[#22C55E]" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts List */}
      <Card className="border-[#E0F2FE] bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg text-[#0F172A]">告警列表</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className="flex items-start gap-4 rounded-xl border border-[#E0F2FE] bg-[#F8FAFC] p-5"
              >
                <div
                  className={`mt-0.5 rounded-full p-2 ${
                    alert.type === 'fault'
                      ? 'bg-[#EF4444]/10'
                      : 'bg-[#F59E0B]/10'
                  }`}
                >
                  <AlertTriangle
                    className={`h-5 w-5 ${
                      alert.type === 'fault' ? 'text-[#EF4444]' : 'text-[#F59E0B]'
                    }`}
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-semibold text-[#0F172A]">
                      {alert.deviceName}
                    </span>
                    <Badge
                      className={`text-xs ${
                        alert.type === 'fault'
                          ? 'bg-[#EF4444]/10 text-[#EF4444]'
                          : 'bg-[#F59E0B]/10 text-[#F59E0B]'
                      }`}
                    >
                      {alert.type === 'fault' ? '故障' : '警告'}
                    </Badge>
                    {alert.acknowledged && (
                      <Badge className="bg-[#22C55E]/10 text-[#22C55E] text-xs">
                        已处理
                      </Badge>
                    )}
                  </div>
                  <div className="mt-2 text-sm text-[#64748B]">
                    {alert.message}
                  </div>
                  <div className="mt-2 flex items-center gap-2 text-xs text-[#94A3B8]">
                    <Clock className="h-3 w-3" />
                    {alert.timestamp.toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
