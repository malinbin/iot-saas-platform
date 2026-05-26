'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { 
  Users, 
  Search, 
  Plus, 
  Phone, 
  Mail,
  Building2,
  MapPin,
} from 'lucide-react';

interface Customer {
  id: string;
  name: string;
  company: string;
  phone: string;
  email: string;
  address: string;
  devices: number;
  status: 'active' | 'inactive';
  createdAt: string;
}

const mockCustomers: Customer[] = [
  {
    id: '1',
    name: '张经理',
    company: '华东机械制造厂',
    phone: '138****5678',
    email: 'zhang@huadong.com',
    address: '江苏省苏州市工业园区',
    devices: 12,
    status: 'active',
    createdAt: '2024-01-10',
  },
  {
    id: '2',
    name: '李总',
    company: '南方精密加工',
    phone: '139****1234',
    email: 'li@nanfang.com',
    address: '广东省深圳市宝安区',
    devices: 8,
    status: 'active',
    createdAt: '2024-01-08',
  },
  {
    id: '3',
    name: '王厂长',
    company: '北方重工集团',
    phone: '137****9876',
    email: 'wang@north.com',
    address: '辽宁省沈阳市铁西区',
    devices: 25,
    status: 'active',
    createdAt: '2024-01-05',
  },
];

export default function VendorCustomersPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [customers] = useState<Customer[]>(mockCustomers);

  const filteredCustomers = customers.filter(c => {
    const matchSearch = c.name.includes(search) || c.company.includes(search);
    const matchStatus = statusFilter === 'all' || c.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[#1E293B]">客户管理</h1>
          <p className="text-sm text-[#64748B]">管理购买设备的客户信息</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-[#2563EB] hover:bg-[#1D4ED8]">
              <Plus className="mr-2 h-4 w-4" />
              添加客户
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>添加新客户</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">客户姓名</label>
                  <Input placeholder="请输入姓名" className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium">所属公司</label>
                  <Input placeholder="请输入公司名" className="mt-1" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">联系电话</label>
                  <Input placeholder="请输入电话" className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium">邮箱</label>
                  <Input placeholder="请输入邮箱" className="mt-1" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">地址</label>
                <Input placeholder="请输入地址" className="mt-1" />
              </div>
              <Button className="w-full bg-[#2563EB] hover:bg-[#1D4ED8]">
                保存
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-[#E2E8F0]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-[#64748B]">总客户数</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#1E293B]">{customers.length}</div>
          </CardContent>
        </Card>
        <Card className="border-[#E2E8F0]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-[#64748B]">活跃客户</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#22C55E]">
              {customers.filter(c => c.status === 'active').length}
            </div>
          </CardContent>
        </Card>
        <Card className="border-[#E2E8F0]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-[#64748B]">总设备数</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#2563EB]">
              {customers.reduce((sum, c) => sum + c.devices, 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter */}
      <Card className="border-[#E2E8F0]">
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94A3B8]" />
              <Input
                placeholder="搜索客户姓名或公司..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="状态筛选" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部状态</SelectItem>
                <SelectItem value="active">活跃</SelectItem>
                <SelectItem value="inactive">非活跃</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="border-[#E2E8F0]">
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>客户信息</TableHead>
                <TableHead>联系方式</TableHead>
                <TableHead>设备数量</TableHead>
                <TableHead>状态</TableHead>
                <TableHead>注册时间</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#DBEAFE]">
                        <Users className="h-5 w-5 text-[#2563EB]" />
                      </div>
                      <div>
                        <div className="font-medium text-[#1E293B]">{customer.name}</div>
                        <div className="flex items-center gap-1 text-sm text-[#64748B]">
                          <Building2 className="h-3 w-3" />
                          {customer.company}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center gap-1 text-[#64748B]">
                        <Phone className="h-3 w-3" />
                        {customer.phone}
                      </div>
                      <div className="flex items-center gap-1 text-[#64748B]">
                        <Mail className="h-3 w-3" />
                        {customer.email}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium text-[#2563EB]">{customer.devices}</span>
                    <span className="text-[#64748B]"> 台</span>
                  </TableCell>
                  <TableCell>
                    <Badge variant={customer.status === 'active' ? 'default' : 'secondary'}
                      className={customer.status === 'active' ? 'bg-[#DCFCE7] text-[#16A34A]' : ''}
                    >
                      {customer.status === 'active' ? '活跃' : '非活跃'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-[#64748B]">{customer.createdAt}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" className="text-[#2563EB]">
                      详情
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
