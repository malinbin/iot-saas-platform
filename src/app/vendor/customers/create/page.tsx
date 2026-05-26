'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

export default function CreateUserPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    validity_type: 'permanent',
    validity_days: '365',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.phone) {
      toast.error('请填写用户姓名和手机号');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/vendor/users/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          validity_days: formData.validity_type === 'permanent' ? null : parseInt(formData.validity_days),
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success(`用户账号创建成功！初始密码：${result.data.default_password}`);
        router.push('/vendor/customers');
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
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">创建用户账号</h1>
        <Button variant="outline" onClick={() => router.back()}>
          返回
        </Button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 md:grid-cols-2">
          {/* 基本信息 */}
          <Card>
            <CardHeader>
              <CardTitle>基本信息</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>用户姓名 *</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="请输入用户姓名"
                  className="mt-1"
                />
              </div>
              <div>
                <Label>手机号 *</Label>
                <Input
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="请输入手机号"
                  className="mt-1"
                />
              </div>
              <div>
                <Label>邮箱</Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="请输入邮箱（可选）"
                  className="mt-1"
                />
              </div>
            </CardContent>
          </Card>

          {/* 账号设置 */}
          <Card>
            <CardHeader>
              <CardTitle>账号设置</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>使用时长 *</Label>
                <Select
                  value={formData.validity_type}
                  onValueChange={(value) => setFormData({ ...formData, validity_type: value })}
                >
                  <SelectTrigger className="mt-1">
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
                  <Label>有效天数 *</Label>
                  <Input
                    type="number"
                    value={formData.validity_days}
                    onChange={(e) => setFormData({ ...formData, validity_days: e.target.value })}
                    placeholder="请输入有效天数"
                    className="mt-1"
                  />
                </div>
              )}
              <p className="text-sm text-muted-foreground">
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
          <Button type="submit" disabled={loading}>
            {loading ? '创建中...' : '创建用户'}
          </Button>
        </div>
      </form>
    </div>
  );
}
