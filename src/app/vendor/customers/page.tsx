'use client';

import { useEffect, useState } from 'react';
import { Users, Plus, RefreshCw, Link2 } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  isActive: boolean;
  expiresAt: string | null;
  createdAt: string;
  deviceCount: number;
}

export default function VendorCustomersPage() {
  const [loading, setLoading] = useState(true);
  const [customers, setCustomers] = useState<Customer[]>([]);

  const fetchCustomers = async () => {
    try {
      const response = await fetch('/api/vendor/customers');
      const result = await response.json();
      
      if (result.success) {
        setCustomers(result.data);
      }
    } catch (error) {
      console.error('Fetch customers error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const isExpired = (expiresAt: string | null) => {
    if (!expiresAt) return false;
    return new Date(expiresAt) < new Date();
  };

  const getExpiresText = (expiresAt: string | null) => {
    if (!expiresAt) return '永久有效';
    const date = new Date(expiresAt);
    if (date < new Date()) return '已过期';
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <RefreshCw className="h-8 w-8 animate-spin text-[#2563EB]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1E293B]">客户管理</h1>
          <p className="text-sm text-[#64748B]">
            共 {customers.length} 个客户
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={fetchCustomers} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            刷新
          </Button>
          <Link href="/vendor/customers/create">
            <Button className="bg-[#2563EB] hover:bg-[#2563EB]/90">
              <Plus className="h-4 w-4 mr-2" />
              添加客户
            </Button>
          </Link>
        </div>
      </div>

      {/* Customer Table */}
      <Card className="border-[#E2E8F0] bg-white">
        <CardHeader>
          <CardTitle className="text-lg text-[#1E293B]">客户列表</CardTitle>
        </CardHeader>
        <CardContent>
          {customers.length === 0 ? (
            <div className="text-center py-10 text-[#64748B]">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>暂无客户数据</p>
              <Link href="/vendor/customers/create">
                <Button className="mt-4" variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  添加第一个客户
                </Button>
              </Link>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>客户名称</TableHead>
                  <TableHead>联系电话</TableHead>
                  <TableHead>邮箱</TableHead>
                  <TableHead>设备数量</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead>到期时间</TableHead>
                  <TableHead>创建时间</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell className="font-medium">{customer.name}</TableCell>
                    <TableCell>{customer.phone || '-'}</TableCell>
                    <TableCell>{customer.email || '-'}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{customer.deviceCount} 台</Badge>
                    </TableCell>
                    <TableCell>
                      {customer.isActive && !isExpired(customer.expiresAt) ? (
                        <Badge className="bg-[#22C55E]">正常</Badge>
                      ) : (
                        <Badge variant="destructive">已禁用</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-sm">
                      <span className={isExpired(customer.expiresAt) ? 'text-[#EF4444]' : 'text-[#64748B]'}>
                        {getExpiresText(customer.expiresAt)}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm text-[#64748B]">
                      {new Date(customer.createdAt).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
