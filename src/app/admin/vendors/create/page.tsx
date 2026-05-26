'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

export default function CreateVendorPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    contact_name: '',
    contact_phone: '',
    contact_email: '',
    address: '',
    validity_type: 'permanent', // permanent, custom
    validity_days: '365',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.code) {
      toast.error('请填写厂家名称和编码');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/admin/vendors/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          validity_days: formData.validity_type === 'permanent' ? null : parseInt(formData.validity_days),
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success('商家账号创建成功');
        router.push('/admin/vendors');
      } else {
        toast.error(result.error || '创建失败');
      }
    } catch (error) {
      toast.error('创建失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-white">创建商家账号</h1>
        <Button variant="outline" onClick={() => router.back()}>
          返回
        </Button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 md:grid-cols-2">
          {/* 基本信息 */}
          <Card className="bg-[#1E3A5F] border-none">
            <CardHeader>
              <CardTitle className="text-white">基本信息</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-gray-300">厂家名称 *</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="请输入厂家名称"
                  className="bg-[#0A1628] border-[#1E3A5F] text-white mt-1"
                />
              </div>
              <div>
                <Label className="text-gray-300">厂家编码 *</Label>
                <Input
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  placeholder="请输入唯一编码"
                  className="bg-[#0A1628] border-[#1E3A5F] text-white mt-1"
                />
              </div>
              <div>
                <Label className="text-gray-300">联系地址</Label>
                <Input
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="请输入联系地址"
                  className="bg-[#0A1628] border-[#1E3A5F] text-white mt-1"
                />
              </div>
            </CardContent>
          </Card>

          {/* 联系人信息 */}
          <Card className="bg-[#1E3A5F] border-none">
            <CardHeader>
              <CardTitle className="text-white">联系人信息</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-gray-300">联系人姓名</Label>
                <Input
                  value={formData.contact_name}
                  onChange={(e) => setFormData({ ...formData, contact_name: e.target.value })}
                  placeholder="请输入联系人姓名"
                  className="bg-[#0A1628] border-[#1E3A5F] text-white mt-1"
                />
              </div>
              <div>
                <Label className="text-gray-300">联系电话</Label>
                <Input
                  value={formData.contact_phone}
                  onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                  placeholder="请输入联系电话"
                  className="bg-[#0A1628] border-[#1E3A5F] text-white mt-1"
                />
              </div>
              <div>
                <Label className="text-gray-300">联系邮箱</Label>
                <Input
                  type="email"
                  value={formData.contact_email}
                  onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                  placeholder="请输入联系邮箱"
                  className="bg-[#0A1628] border-[#1E3A5F] text-white mt-1"
                />
              </div>
            </CardContent>
          </Card>

          {/* 账号设置 */}
          <Card className="bg-[#1E3A5F] border-none md:col-span-2">
            <CardHeader>
              <CardTitle className="text-white">账号设置</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-300">使用时长 *</Label>
                  <Select
                    value={formData.validity_type}
                    onValueChange={(value) => setFormData({ ...formData, validity_type: value })}
                  >
                    <SelectTrigger className="bg-[#0A1628] border-[#1E3A5F] text-white mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="permanent">永久有效</SelectItem>
                      <SelectItem value="custom">自定义时长</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {formData.validity_type === 'custom' && (
                  <div>
                    <Label className="text-gray-300">有效天数 *</Label>
                    <Input
                      type="number"
                      value={formData.validity_days}
                      onChange={(e) => setFormData({ ...formData, validity_days: e.target.value })}
                      placeholder="请输入有效天数"
                      className="bg-[#0A1628] border-[#1E3A5F] text-white mt-1"
                    />
                  </div>
                )}
              </div>
              <p className="text-sm text-gray-400">
                {formData.validity_type === 'permanent' 
                  ? '账号将永久有效，除非手动禁用'
                  : `账号将在创建后 ${formData.validity_days} 天自动过期`}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end gap-4 mt-6">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            取消
          </Button>
          <Button type="submit" disabled={loading} className="bg-[#2563EB] hover:bg-[#1D4ED8]">
            {loading ? '创建中...' : '创建商家'}
          </Button>
        </div>
      </form>
    </div>
  );
}
