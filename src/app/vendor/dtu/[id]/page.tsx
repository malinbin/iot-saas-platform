'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Radio,
  Wifi,
  WifiOff,
  Signal,
  Activity,
  Settings,
  Trash2,
  RefreshCw,
  Send,
  Clock,
  Database,
  AlertTriangle,
  Copy,
  Check,
  Edit,
  Save,
  X,
  Box,
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
  server_address: string;
  server_port: number;
  mqtt_topic_subscribe: string;
  mqtt_topic_publish: string;
  serial_baudrate: number;
  heartbeat_interval: number;
  last_heartbeat_at: string;
  last_data_at: string;
  firmware_version: string;
  created_at: string;
  config: Record<string, unknown>;
  metadata: Record<string, unknown>;
}

interface DTUData {
  id: string;
  raw_data: string;
  parsed_data: Record<string, unknown>;
  topic: string;
  direction: string;
  received_at: string;
}

interface ConnectedDevice {
  id: string;
  name: string;
  serial_number: string;
  device_type: string;
  status: string;
  dtu_port?: number;
  last_heartbeat_at?: string;
}

export default function DTUDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [device, setDevice] = useState<DTUDevice | null>(null);
  const [dataList, setDataList] = useState<DTUData[]>([]);
  const [connectedDevices, setConnectedDevices] = useState<ConnectedDevice[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    server_address: '',
    server_port: 1883,
    mqtt_topic_subscribe: '',
    mqtt_topic_publish: '',
    serial_baudrate: 9600,
    heartbeat_interval: 60,
  });
  const [copied, setCopied] = useState<string | null>(null);

  const deviceId = params.id as string;

  useEffect(() => {
    fetchDevice();
    fetchData();
    fetchConnectedDevices();
  }, [deviceId]);

  const fetchConnectedDevices = async () => {
    try {
      const response = await fetch(`/api/dtu/devices/${deviceId}/connected-devices`);
      const data = await response.json();
      if (data.success) {
        setConnectedDevices(data.data || []);
      }
    } catch (error) {
      console.error('获取关联设备失败:', error);
    }
  };

  const fetchDevice = async () => {
    try {
      const response = await fetch(`/api/dtu/devices/${deviceId}`);
      const data = await response.json();
      if (data.success) {
        setDevice(data.data);
        setEditForm({
          name: data.data.name || '',
          server_address: data.data.server_address || '',
          server_port: data.data.server_port || 1883,
          mqtt_topic_subscribe: data.data.mqtt_topic_subscribe || '',
          mqtt_topic_publish: data.data.mqtt_topic_publish || '',
          serial_baudrate: data.data.serial_baudrate || 9600,
          heartbeat_interval: data.data.heartbeat_interval || 60,
        });
      } else {
        toast({ title: '获取设备失败', description: data.error, variant: 'error' });
      }
    } catch (error) {
      console.error('Fetch device error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchData = async () => {
    try {
      const response = await fetch(`/api/dtu/data-history?device_id=${deviceId}`);
      const data = await response.json();
      if (data.success) {
        setDataList(data.data || []);
      }
    } catch (error) {
      console.error('Fetch data error:', error);
    }
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`/api/dtu/devices/${deviceId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      });
      const result = await response.json();
      if (result.success) {
        toast({ title: '保存成功', description: '设备信息已更新' });
        setEditing(false);
        fetchDevice();
      } else {
        toast({ title: '保存失败', description: result.error, variant: 'error' });
      }
    } catch (error) {
      toast({ title: '保存失败', description: '网络错误', variant: 'error' });
    }
  };

  const handleDelete = async () => {
    if (!confirm('确定要删除这个设备吗？此操作不可恢复。')) return;
    
    try {
      const response = await fetch(`/api/dtu/devices/${deviceId}`, {
        method: 'DELETE',
      });
      const result = await response.json();
      if (result.success) {
        toast({ title: '删除成功', description: '设备已删除' });
        router.push('/vendor/dtu');
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

  const formatDate = (date: string) => {
    if (!date) return '-';
    return new Date(date).toLocaleString('zh-CN');
  };

  const getSignalLevel = (signal: number) => {
    if (!signal || signal === 99) return { text: '无信号', color: 'text-slate-400' };
    if (signal < 11) return { text: '弱', color: 'text-red-500' };
    if (signal < 18) return { text: '中', color: 'text-yellow-500' };
    return { text: '强', color: 'text-green-500' };
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <RefreshCw className="h-8 w-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  if (!device) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Radio className="h-12 w-12 text-slate-300 mx-auto mb-4" />
          <h2 className="text-lg font-medium text-slate-900 mb-2">设备不存在</h2>
          <button
            onClick={() => router.push('/vendor/dtu')}
            className="text-blue-600 hover:underline"
          >
            返回设备列表
          </button>
        </div>
      </div>
    );
  }

  const signal = getSignalLevel(device.signal_strength);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50/30">
      {/* Header */}
      <div className="border-b border-blue-100 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/vendor/dtu')}
                className="p-2 rounded-lg hover:bg-slate-100 text-slate-600"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 text-white">
                <Radio className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-slate-900">{device.name}</h1>
                <p className="text-sm text-slate-600">{device.device_id}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => editing ? setEditing(false) : setEditing(true)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                  editing
                    ? 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    : 'border-blue-200 text-blue-600 hover:bg-blue-50'
                }`}
              >
                {editing ? <X className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
                {editing ? '取消' : '编辑'}
              </button>
              {editing && (
                <button
                  onClick={handleSave}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                >
                  <Save className="h-4 w-4" />
                  保存
                </button>
              )}
              <button
                onClick={handleDelete}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
              >
                <Trash2 className="h-4 w-4" />
                删除
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-3 gap-6">
          {/* 设备信息 */}
          <div className="col-span-2 space-y-6">
            {/* 基本信息 */}
            <div className="p-6 rounded-2xl border border-blue-100 bg-white">
              <h2 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <Radio className="h-5 w-5 text-blue-500" />
                基本信息
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-600 mb-1">设备ID</label>
                  <div className="flex items-center gap-2">
                    <code className="text-slate-900">{device.device_id}</code>
                    <button
                      onClick={() => copyToClipboard(device.device_id, 'device_id')}
                      className="p-0.5 hover:bg-slate-200 rounded"
                    >
                      {copied === 'device_id' ? (
                        <Check className="h-3 w-3 text-green-500" />
                      ) : (
                        <Copy className="h-3 w-3 text-slate-400" />
                      )}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-slate-600 mb-1">IMEI</label>
                  <code className="text-slate-900">{device.imei || '-'}</code>
                </div>
                <div>
                  <label className="block text-sm text-slate-600 mb-1">ICCID</label>
                  <code className="text-slate-900">{device.iccid || '-'}</code>
                </div>
                <div>
                  <label className="block text-sm text-slate-600 mb-1">固件版本</label>
                  <span className="text-slate-900">{device.firmware_version || '-'}</span>
                </div>
                {editing ? (
                  <>
                    <div className="col-span-2">
                      <label className="block text-sm text-slate-600 mb-1">设备名称</label>
                      <input
                        type="text"
                        value={editForm.name}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                      />
                    </div>
                  </>
                ) : (
                  <div className="col-span-2">
                    <label className="block text-sm text-slate-600 mb-1">设备名称</label>
                    <span className="text-slate-900">{device.name}</span>
                  </div>
                )}
              </div>
            </div>

            {/* 连接配置 */}
            <div className="p-6 rounded-2xl border border-blue-100 bg-white">
              <h2 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <Settings className="h-5 w-5 text-blue-500" />
                连接配置
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-600 mb-1">连接模式</label>
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700">
                    {device.connection_mode?.toUpperCase()}
                  </span>
                </div>
                <div>
                  <label className="block text-sm text-slate-600 mb-1">串口波特率</label>
                  {editing ? (
                    <select
                      value={editForm.serial_baudrate}
                      onChange={(e) => setEditForm({ ...editForm, serial_baudrate: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-blue-400"
                    >
                      {[1200, 2400, 4800, 9600, 19200, 38400, 57600, 115200].map((r) => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                  ) : (
                    <span className="text-slate-900">{device.serial_baudrate} bps</span>
                  )}
                </div>
                {editing ? (
                  <>
                    <div>
                      <label className="block text-sm text-slate-600 mb-1">服务器地址</label>
                      <input
                        type="text"
                        value={editForm.server_address}
                        onChange={(e) => setEditForm({ ...editForm, server_address: e.target.value })}
                        placeholder="例如: iot.example.com"
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-slate-600 mb-1">服务器端口</label>
                      <input
                        type="number"
                        value={editForm.server_port}
                        onChange={(e) => setEditForm({ ...editForm, server_port: parseInt(e.target.value) })}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-slate-600 mb-1">MQTT 订阅主题</label>
                      <input
                        type="text"
                        value={editForm.mqtt_topic_subscribe}
                        onChange={(e) => setEditForm({ ...editForm, mqtt_topic_subscribe: e.target.value })}
                        placeholder="device/{device_id}/command"
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-slate-600 mb-1">MQTT 推送主题</label>
                      <input
                        type="text"
                        value={editForm.mqtt_topic_publish}
                        onChange={(e) => setEditForm({ ...editForm, mqtt_topic_publish: e.target.value })}
                        placeholder="device/{device_id}/data"
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-slate-600 mb-1">心跳间隔 (秒)</label>
                      <input
                        type="number"
                        value={editForm.heartbeat_interval}
                        onChange={(e) => setEditForm({ ...editForm, heartbeat_interval: parseInt(e.target.value) })}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <label className="block text-sm text-slate-600 mb-1">服务器地址</label>
                      <span className="text-slate-900">{device.server_address || '-'}</span>
                    </div>
                    <div>
                      <label className="block text-sm text-slate-600 mb-1">服务器端口</label>
                      <span className="text-slate-900">{device.server_port || '-'}</span>
                    </div>
                    <div>
                      <label className="block text-sm text-slate-600 mb-1">MQTT 订阅主题</label>
                      <code className="text-slate-900">{device.mqtt_topic_subscribe || '-'}</code>
                    </div>
                    <div>
                      <label className="block text-sm text-slate-600 mb-1">MQTT 推送主题</label>
                      <code className="text-slate-900">{device.mqtt_topic_publish || '-'}</code>
                    </div>
                    <div>
                      <label className="block text-sm text-slate-600 mb-1">心跳间隔</label>
                      <span className="text-slate-900">{device.heartbeat_interval} 秒</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* 历史数据 */}
            <div className="p-6 rounded-2xl border border-blue-100 bg-white">
              <h2 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <Database className="h-5 w-5 text-blue-500" />
                历史数据
                <span className="text-sm font-normal text-slate-500">({dataList.length} 条)</span>
              </h2>
              {dataList.length === 0 ? (
                <p className="text-slate-500 text-center py-8">暂无历史数据</p>
              ) : (
                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {dataList.slice(0, 20).map((item) => (
                    <div
                      key={item.id}
                      className="p-3 rounded-lg bg-slate-50 border border-slate-100"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-slate-500">
                          {formatDate(item.received_at)}
                        </span>
                        <span className={`text-xs px-2 py-0.5 rounded ${
                          item.direction === 'up' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                        }`}>
                          {item.direction === 'up' ? '上行' : '下行'}
                        </span>
                      </div>
                      <pre className="text-sm text-slate-700 overflow-x-auto">
                        {JSON.stringify(item.parsed_data || item.raw_data, null, 2)}
                      </pre>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 关联设备 */}
            <div className="p-6 rounded-2xl border border-blue-100 bg-white">
              <h2 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <Box className="h-5 w-5 text-blue-500" />
                关联设备
                <span className="text-sm font-normal text-slate-500">({connectedDevices.length} 台)</span>
              </h2>
              {connectedDevices.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-slate-500 mb-2">暂无关联设备</p>
                  <p className="text-sm text-slate-400">在设备管理中将设备关联到此DTU</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {connectedDevices.map((dev) => (
                    <div
                      key={dev.id}
                      className="p-3 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
                          <Box className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="font-medium text-slate-900">{dev.name}</div>
                          <div className="text-xs text-slate-500">
                            {dev.device_type} · {dev.serial_number}
                            {dev.dtu_port && ` · 端口 ${dev.dtu_port}`}
                          </div>
                        </div>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        dev.status === 'online' 
                          ? 'bg-green-100 text-green-700' 
                          : dev.status === 'fault'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-slate-100 text-slate-600'
                      }`}>
                        {dev.status === 'online' ? '在线' : dev.status === 'fault' ? '故障' : '离线'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 状态面板 */}
          <div className="space-y-6">
            {/* 在线状态 */}
            <div className={`p-6 rounded-2xl border ${device.online ? 'border-green-200 bg-green-50' : 'border-slate-200 bg-slate-50'}`}>
              <div className="flex items-center justify-between mb-4">
                <span className="font-medium text-slate-900">在线状态</span>
                {device.online ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-green-100 text-green-700">
                    <Wifi className="h-4 w-4" />
                    在线
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-slate-100 text-slate-600">
                    <WifiOff className="h-4 w-4" />
                    离线
                  </span>
                )}
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">信号强度</span>
                  <div className="flex items-center gap-2">
                    <Signal className={`h-4 w-4 ${signal.color}`} />
                    <span className="text-sm text-slate-900">
                      {device.signal_strength || '-'} ({signal.text})
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">最后心跳</span>
                  <span className="text-sm text-slate-900">{formatDate(device.last_heartbeat_at)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">最后数据</span>
                  <span className="text-sm text-slate-900">{formatDate(device.last_data_at)}</span>
                </div>
              </div>
            </div>

            {/* 快捷操作 */}
            <div className="p-6 rounded-2xl border border-blue-100 bg-white">
              <h3 className="font-medium text-slate-900 mb-4">快捷操作</h3>
              <div className="space-y-3">
                <button
                  onClick={() => {
                    toast({ title: '发送指令', description: '此功能需要 MQTT 服务支持' });
                  }}
                  className="w-full flex items-center gap-2 px-4 py-2.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <Send className="h-4 w-4" />
                  发送指令
                </button>
                <button
                  onClick={fetchData}
                  className="w-full flex items-center gap-2 px-4 py-2.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <RefreshCw className="h-4 w-4" />
                  刷新数据
                </button>
              </div>
            </div>

            {/* 创建时间 */}
            <div className="p-6 rounded-2xl border border-blue-100 bg-white">
              <h3 className="font-medium text-slate-900 mb-4 flex items-center gap-2">
                <Clock className="h-4 w-4" />
                时间信息
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600">创建时间</span>
                  <span className="text-slate-900">{formatDate(device.created_at)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
