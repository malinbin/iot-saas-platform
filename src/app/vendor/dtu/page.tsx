'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Radio,
  Plus,
  Search,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  RefreshCw,
  Wifi,
  WifiOff,
  Signal,
  Activity,
  Settings,
  FileText,
  Copy,
  Check,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface DTUDevice {
  id: string;
  device_id: string;
  name: string;
  imei: string;
  iccid: string;
  online: boolean;
  signal_strength: number;
  connection_mode: string;
  last_heartbeat_at: string;
  last_data_at: string;
  created_at: string;
}

export default function DTUManagementPage() {
  const { toast } = useToast();
  const [devices, setDevices] = useState<DTUDevice[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    fetchDevices();
  }, []);

  const fetchDevices = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/dtu/data');
      const data = await response.json();
      if (data.success) {
        setDevices(data.data || []);
      }
    } catch (error) {
      console.error('Fetch DTU devices error:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const filteredDevices = devices.filter(
    (d) =>
      d.device_id?.toLowerCase().includes(search.toLowerCase()) ||
      d.name?.toLowerCase().includes(search.toLowerCase()) ||
      d.imei?.toLowerCase().includes(search.toLowerCase())
  );

  const formatDate = (date: string) => {
    if (!date) return '-';
    return new Date(date).toLocaleString('zh-CN', {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getSignalLevel = (signal: number) => {
    if (!signal || signal === 99) return { text: '无信号', color: 'text-slate-400' };
    if (signal < 11) return { text: '弱', color: 'text-red-500' };
    if (signal < 18) return { text: '中', color: 'text-yellow-500' };
    return { text: '强', color: 'text-green-500' };
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50/30">
      {/* Header */}
      <div className="border-b border-blue-100 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 text-white">
                <Radio className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-slate-900">DTU 设备管理</h1>
                <p className="text-sm text-slate-600">TAS-LTE-892G 4G DTU 设备</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/vendor/dtu-config"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-blue-200 text-blue-600 hover:bg-blue-50 transition-colors"
              >
                <FileText className="h-4 w-4" />
                配置指南
              </Link>
              <button
                onClick={fetchDevices}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
              >
                <RefreshCw className="h-4 w-4" />
                刷新
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="p-4 rounded-xl border border-blue-100 bg-white">
            <div className="text-2xl font-bold text-slate-900">{devices.length}</div>
            <div className="text-sm text-slate-600">总设备数</div>
          </div>
          <div className="p-4 rounded-xl border border-blue-100 bg-white">
            <div className="text-2xl font-bold text-green-600">
              {devices.filter((d) => d.online).length}
            </div>
            <div className="text-sm text-slate-600">在线设备</div>
          </div>
          <div className="p-4 rounded-xl border border-blue-100 bg-white">
            <div className="text-2xl font-bold text-slate-400">
              {devices.filter((d) => !d.online).length}
            </div>
            <div className="text-sm text-slate-600">离线设备</div>
          </div>
          <div className="p-4 rounded-xl border border-blue-100 bg-white">
            <div className="text-2xl font-bold text-blue-600">
              {devices.filter((d) => d.connection_mode === 'mqtt').length}
            </div>
            <div className="text-sm text-slate-600">MQTT连接</div>
          </div>
        </div>

        {/* Search & Actions */}
        <div className="flex items-center justify-between mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="搜索设备ID、名称、IMEI..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-blue-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
            />
          </div>
        </div>

        {/* Device List */}
        {loading ? (
          <div className="p-12 text-center">
            <RefreshCw className="h-8 w-8 text-blue-500 animate-spin mx-auto mb-4" />
            <p className="text-slate-600">加载中...</p>
          </div>
        ) : filteredDevices.length === 0 ? (
          <div className="p-12 rounded-2xl border border-blue-100 bg-white text-center">
            <Radio className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">暂无 DTU 设备</h3>
            <p className="text-slate-600 mb-4">
              DTU 设备上线后将自动注册到平台
            </p>
            <Link
              href="/vendor/dtu-config"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors"
            >
              <FileText className="h-4 w-4" />
              查看配置指南
            </Link>
          </div>
        ) : (
          <div className="rounded-2xl border border-blue-100 bg-white overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-slate-600">设备</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-slate-600">IMEI</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-slate-600">状态</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-slate-600">信号</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-slate-600">最后心跳</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-slate-600">最后数据</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-slate-600">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredDevices.map((device) => {
                  const signal = getSignalLevel(device.signal_strength);
                  return (
                    <tr key={device.id} className="hover:bg-blue-50/50 transition-colors">
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`p-2 rounded-lg ${
                              device.online
                                ? 'bg-green-100 text-green-600'
                                : 'bg-slate-100 text-slate-400'
                            }`}
                          >
                            <Radio className="h-4 w-4" />
                          </div>
                          <div>
                            <div className="font-medium text-slate-900">{device.name}</div>
                            <div className="text-sm text-slate-500 flex items-center gap-2">
                              {device.device_id}
                              <button
                                onClick={() => copyToClipboard(device.device_id, device.id)}
                                className="p-0.5 hover:bg-slate-200 rounded"
                              >
                                {copied === device.id ? (
                                  <Check className="h-3 w-3 text-green-500" />
                                ) : (
                                  <Copy className="h-3 w-3 text-slate-400" />
                                )}
                              </button>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <code className="text-sm text-slate-600">{device.imei || '-'}</code>
                      </td>
                      <td className="px-4 py-4">
                        <div
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-sm font-medium ${
                            device.online
                              ? 'bg-green-100 text-green-700'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {device.online ? (
                            <>
                              <Wifi className="h-3.5 w-3.5" />
                              在线
                            </>
                          ) : (
                            <>
                              <WifiOff className="h-3.5 w-3.5" />
                              离线
                            </>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <Signal className={`h-4 w-4 ${signal.color}`} />
                          <span className="text-sm text-slate-600">
                            {device.signal_strength || '-'} ({signal.text})
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-slate-600">
                        {formatDate(device.last_heartbeat_at)}
                      </td>
                      <td className="px-4 py-4 text-sm text-slate-600">
                        {formatDate(device.last_data_at)}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => {
                              toast({
                                title: '查看设备详情',
                                description: `设备 ${device.name} 详情页面开发中`,
                              });
                            }}
                            className="p-2 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => {
                              toast({
                                title: '编辑设备',
                                description: `设备 ${device.name} 编辑功能开发中`,
                              });
                            }}
                            className="p-2 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Test Data Upload */}
        <div className="mt-8 p-6 rounded-2xl border border-blue-100 bg-white">
          <h3 className="font-semibold text-slate-900 mb-4">测试数据上报</h3>
          <p className="text-sm text-slate-600 mb-4">
            点击下方按钮发送测试数据，验证 API 是否正常工作
          </p>
          <button
            onClick={async () => {
              try {
                const response = await fetch('/api/dtu/data', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    device_id: 'TEST_DTU_001',
                    imei: '86758' + Date.now().toString().slice(-10),
                    data: {
                      temperature: 25 + Math.random() * 5,
                      humidity: 50 + Math.random() * 20,
                      status: 'normal',
                    },
                    signal: Math.floor(15 + Math.random() * 15),
                    type: 'data',
                  }),
                });
                const result = await response.json();
                toast({
                  title: result.success ? '测试成功' : '测试失败',
                  description: result.message || result.error,
                });
                if (result.success) {
                  fetchDevices();
                }
              } catch (error) {
                toast({
                  title: '测试失败',
                  description: '网络错误',
                });
              }
            }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors"
          >
            <Activity className="h-4 w-4" />
            发送测试数据
          </button>
        </div>
      </div>
    </div>
  );
}
