'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Copy,
  Check,
  Radio,
  Server,
  Shield,
  Settings,
  Activity,
  Wifi,
  Zap,
  FileText,
  ExternalLink,
} from 'lucide-react';

export default function DTUConfigPage() {
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const configSections = [
    {
      id: 'mqtt',
      title: 'MQTT 接入配置',
      icon: Radio,
      description: '推荐方式，支持双向通信，实时性好',
      configs: [
        {
          label: '服务器地址',
          value: '您的服务器域名或IP',
          desc: '例如: iot.yourcompany.com',
        },
        {
          label: '服务器端口',
          value: '1883',
          desc: '非加密端口，TLS加密请使用 8883',
        },
        {
          label: 'ClientID',
          value: 'DTU_{设备编号}',
          desc: '建议使用设备唯一编号，如 DTU_001',
        },
        {
          label: '订阅主题',
          value: 'device/{设备编号}/command',
          desc: '接收平台下发的指令',
        },
        {
          label: '推送主题',
          value: 'device/{设备编号}/data',
          desc: '上报设备数据',
        },
        {
          label: '用户名',
          value: '设备编号或自定义',
          desc: '用于MQTT认证',
        },
        {
          label: '密码',
          value: '平台生成的密钥',
          desc: '在设备管理页面获取',
        },
        {
          label: 'QoS等级',
          value: '1',
          desc: '建议使用QoS 1，保证消息到达',
        },
      ],
    },
    {
      id: 'http',
      title: 'HTTP 接入配置',
      icon: Server,
      description: '简单易用，适合单向数据上报',
      configs: [
        {
          label: '上报URL',
          value: 'https://您的域名/api/dtu/data',
          desc: 'POST方式提交数据',
        },
        {
          label: '请求方式',
          value: 'POST',
          desc: 'Content-Type: application/json',
        },
      ],
      requestBody: `{
  "device_id": "DTU_001",
  "imei": "86758xxxxx",
  "data": {
    "temperature": 25.6,
    "humidity": 60
  },
  "type": "data"
}`,
    },
    {
      id: 'tcp',
      title: 'TCP 透传配置',
      icon: Wifi,
      description: '适合需要透传原始数据的场景',
      configs: [
        {
          label: '服务器地址',
          value: '您的服务器IP',
          desc: 'DTU作为TCP Client连接',
        },
        {
          label: '服务器端口',
          value: '自定义端口',
          desc: '如: 8000',
        },
      ],
    },
  ];

  const protocolRef = `// 数据上报格式 (JSON)
{
  "device_id": "DTU_001",    // 设备ID
  "imei": "86758xxxxx",      // IMEI号(可选)
  "iccid": "89860xxxxx",     // ICCID号(可选)
  "data": {                   // 业务数据
    "temperature": 25.6,
    "humidity": 60,
    "status": "normal"
  },
  "signal": 25,              // 信号强度(可选)
  "type": "data"             // 消息类型: data/heartbeat/register
}

// 心跳包格式
{
  "device_id": "DTU_001",
  "type": "heartbeat",
  "signal": 25
}

// 注册包格式 (首次上线)
{
  "device_id": "DTU_001",
  "imei": "86758xxxxx",
  "iccid": "89860xxxxx",
  "type": "register"
}`;

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50/30">
      {/* Header */}
      <div className="border-b border-blue-100 bg-white/80 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Link
              href="/vendor/devices"
              className="inline-flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              返回设备管理
            </Link>
            <div className="h-6 w-px bg-blue-200" />
            <h1 className="text-xl font-semibold text-slate-900">DTU 接入配置指南</h1>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* 设备信息 */}
        <div className="mb-8 p-6 rounded-2xl border border-blue-100 bg-white">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 text-white">
              <Radio className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-slate-900">TAS-LTE-892G 4G DTU</h2>
              <p className="mt-1 text-slate-600">
                杭州塔石物联网科技有限公司 | 4G全网通 | 支持 TCP/UDP/MQTT/HTTP/WebSocket
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 text-sm">
                  <Activity className="h-4 w-4" />
                  双向通信
                </div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-cyan-50 text-cyan-700 text-sm">
                  <Shield className="h-4 w-4" />
                  数据加密
                </div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-teal-50 text-teal-700 text-sm">
                  <Zap className="h-4 w-4" />
                  实时上报
                </div>
              </div>
            </div>
            <a
              href="http://www.tastek.cn"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-blue-200 text-blue-600 hover:bg-blue-50 transition-colors"
            >
              厂商官网
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </div>

        {/* 配置方式选择 */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">接入方式配置</h3>
          <div className="space-y-6">
            {configSections.map((section) => (
              <div
                key={section.id}
                className="p-6 rounded-2xl border border-blue-100 bg-white"
              >
                <div className="flex items-start gap-4 mb-6">
                  <div className="p-2.5 rounded-xl bg-blue-100 text-blue-600">
                    <section.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900">{section.title}</h4>
                    <p className="text-sm text-slate-600">{section.description}</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  {section.configs.map((config, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-slate-50 border border-slate-200"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-medium text-slate-700">
                          {config.label}
                        </label>
                        <button
                          onClick={() => copyToClipboard(config.value, `${section.id}-${idx}`)}
                          className="p-1.5 rounded-lg hover:bg-slate-200 transition-colors"
                        >
                          {copied === `${section.id}-${idx}` ? (
                            <Check className="h-4 w-4 text-green-600" />
                          ) : (
                            <Copy className="h-4 w-4 text-slate-400" />
                          )}
                        </button>
                      </div>
                      <code className="block text-sm text-blue-600 bg-blue-50 px-3 py-2 rounded-lg font-mono">
                        {config.value}
                      </code>
                      <p className="mt-2 text-xs text-slate-500">{config.desc}</p>
                    </div>
                  ))}
                </div>

                {section.requestBody && (
                  <div className="mt-4">
                    <label className="text-sm font-medium text-slate-700 mb-2 block">
                      请求体示例
                    </label>
                    <pre className="p-4 rounded-xl bg-slate-900 text-slate-100 text-sm overflow-x-auto">
                      {section.requestBody}
                    </pre>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 协议说明 */}
        <div className="mb-8 p-6 rounded-2xl border border-blue-100 bg-white">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 rounded-xl bg-blue-100 text-blue-600">
              <FileText className="h-5 w-5" />
            </div>
            <h3 className="font-semibold text-slate-900">数据协议说明</h3>
          </div>
          <pre className="p-4 rounded-xl bg-slate-900 text-slate-100 text-sm overflow-x-auto">
            {protocolRef}
          </pre>
        </div>

        {/* 配置步骤 */}
        <div className="p-6 rounded-2xl border border-blue-100 bg-white">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 rounded-xl bg-blue-100 text-blue-600">
              <Settings className="h-5 w-5" />
            </div>
            <h3 className="font-semibold text-slate-900">配置步骤</h3>
          </div>
          <div className="space-y-4">
            {[
              {
                step: 1,
                title: '添加 DTU 设备',
                desc: '在设备管理页面添加新的 DTU 设备，获取设备ID',
              },
              {
                step: 2,
                title: '配置 DTU 参数',
                desc: '使用上位机软件或AT指令配置服务器地址、端口、主题等参数',
              },
              {
                step: 3,
                title: '插入 SIM 卡',
                desc: '插入支持4G网络的SIM卡，确保信号正常',
              },
              {
                step: 4,
                title: '上电测试',
                desc: 'DTU上电后会自动连接服务器，平台将收到设备注册包',
              },
              {
                step: 5,
                title: '验证数据',
                desc: '查看设备状态是否在线，数据是否正常上报',
              },
            ].map((item) => (
              <div key={item.step} className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 text-white flex items-center justify-center text-sm font-semibold">
                  {item.step}
                </div>
                <div>
                  <h4 className="font-medium text-slate-900">{item.title}</h4>
                  <p className="text-sm text-slate-600">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
