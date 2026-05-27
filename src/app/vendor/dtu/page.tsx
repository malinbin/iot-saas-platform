'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Radio,
  Plus,
  Search,
  Eye,
  Edit,
  Trash2,
  RefreshCw,
  Wifi,
  WifiOff,
  Signal,
  FileText,
  Copy,
  Check,
  X,
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
  const router = useRouter();
  const { toast } = useToast();
  const [devices, setDevices] = useState<DTUDevice[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [copied, setCopied] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState({
    device_id: '',
    name: '',
    imei: '',
    iccid: '',
    connection_mode: 'mqtt',
  });

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

  const handleAddDevice = async () => {
    if (!addForm.device_id) {
      toast({ title: '请填写设备ID', variant: 'error' });
      return;
    }

    try {
      const response = await fetch('/api/dtu/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          device_id: addForm.device_id,
          imei: addForm.imei || undefined,
          iccid: addForm.iccid || undefined,
          name: addForm.name || `DTU-${addForm.device_id}`,
          type: 'register',
        }),
      });
      const result = await response.json();
      if (result.success) {
        toast({ title: '添加成功', description: `设备 ${addForm.device_id} 已添加` });
        setShowAddModal(false);
        setAddForm({ device_id: '', name: '', imei: '', iccid: '', connection_mode: 'mqtt' });
        fetchDevices();
      } else {
        toast({ title: '添加失败', description: result.error, variant: 'error' });
      }
    } catch (error) {
      toast({ title: '添加失败', description: '网络错误', variant: 'error' });
    }
  };

  const handleDelete = async (device: DTUDevice) => {
    if (!confirm(`确定要删除设备 ${device.name} 吗？`)) return;

    try {
      const response = await fetch(`/api/dtu/devices/${device.id}`, {
        method: 'DELETE',
      });
      const result = await response.json();
      if (result.success) {
        toast({ title: '删除成功' });
        fetchDevices();
      } else {
        toast({ title: '删除失败', description: result.error, variant: 'error' });
      }
    } catch (error) {
      toast({ title: '删除失败', description: '网络错误', variant: 'error' });
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
                onClick={() => setShowAddModal(true)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600 transition-colors"
              >
                <Plus className="h-4 w-4" />
                添加设备
              </button>
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

        {/* Search */}
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
              点击"添加设备"手动添加，或配置DTU设备连接后自动注册
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setShowAddModal(true)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors"
              >
                <Plus className="h-4 w-4" />
                添加设备
              </button>
              <Link
                href="/vendor/dtu-config"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <FileText className="h-4 w-4" />
                查看配置指南
              </Link>
            </div>
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
                            onClick={() => router.push(`/vendor/dtu/${device.id}`)}
                            className="p-2 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors"
                            title="查看详情"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => router.push(`/vendor/dtu/${device.id}`)}
                            className="p-2 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors"
                            title="编辑"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(device)}
                            className="p-2 rounded-lg hover:bg-red-50 text-red-500 transition-colors"
                            title="删除"
                          >
                            <Trash2 className="h-4 w-4" />
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
      </div>

      {/* Add Device Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-slate-900">添加 DTU 设备</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 rounded-lg hover:bg-slate-100 text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  设备ID <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={addForm.device_id}
                  onChange={(e) => setAddForm({ ...addForm, device_id: e.target.value })}
                  placeholder="例如: DTU001"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">设备名称</label>
                <input
                  type="text"
                  value={addForm.name}
                  onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
                  placeholder="例如: 生产线1号DTU"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">IMEI</label>
                <input
                  type="text"
                  value={addForm.imei}
                  onChange={(e) => setAddForm({ ...addForm, imei: e.target.value })}
                  placeholder="15位IMEI号"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">ICCID</label>
                <input
                  type="text"
                  value={addForm.iccid}
                  onChange={(e) => setAddForm({ ...addForm, iccid: e.target.value })}
                  placeholder="SIM卡ICCID号"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleAddDevice}
                className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors"
              >
                添加
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
