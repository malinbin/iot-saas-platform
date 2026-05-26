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
  UserCog,
  Shield,
  Clock,
} from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'admin' | 'vendor' | 'user';
  vendorName?: string;
  status: 'active' | 'inactive' | 'pending';
  lastLogin: string;
  createdAt: string;
}

const mockUsers: User[] = [
  {
    id: '1',
    name: '超级管理员',
    email: 'admin@iot.com',
    phone: '138****0001',
    role: 'admin',
    status: 'active',
    lastLogin: '2024-01-15 14:30',
    createdAt: '2023-01-01',
  },
  {
    id: '2',
    name: '智联科技',
    email: 'vendor@zhilian.com',
    phone: '138****5678',
    role: 'vendor',
    vendorName: '智联科技有限公司',
    status: 'active',
    lastLogin: '2024-01-15 13:20',
    createdAt: '2024-01-10',
  },
  {
    id: '3',
    name: '华东机械',
    email: 'vendor@huadong.com',
    phone: '139****1234',
    role: 'vendor',
    vendorName: '华东机械制造厂',
    status: 'active',
    lastLogin: '2024-01-15 10:15',
    createdAt: '2024-01-08',
  },
  {
    id: '4',
    name: '张经理',
    email: 'zhang@huadong.com',
    phone: '137****5678',
    role: 'user',
    vendorName: '华东机械制造厂',
    status: 'active',
    lastLogin: '2024-01-15 09:30',
    createdAt: '2024-01-12',
  },
];

const roleColors = {
  admin: 'bg-[#FEE2E2] text-[#DC2626]',
  vendor: 'bg-[#DBEAFE] text-[#2563EB]',
  user: 'bg-[#DCFCE7] text-[#16A34A]',
};

const roleLabels = {
  admin: '超级管理员',
  vendor: '厂家',
  user: '终端用户',
};

export default function AdminUsersPage() {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [users] = useState<User[]>(mockUsers);

  const filteredUsers = users.filter(u => {
    const matchSearch = u.name.includes(search) || u.email.includes(search);
    const matchRole = roleFilter === 'all' || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  const stats = {
    total: users.length,
    admins: users.filter(u => u.role === 'admin').length,
    vendors: users.filter(u => u.role === 'vendor').length,
    users: users.filter(u => u.role === 'user').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">用户管理</h1>
          <p className="text-sm text-[#94A3B8]">管理平台所有用户账户</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-[#2563EB] hover:bg-[#1D4ED8]">
              <Plus className="mr-2 h-4 w-4" />
              添加用户
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>添加新用户</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div>
                <label className="text-sm font-medium">用户名</label>
                <Input placeholder="请输入用户名" className="mt-1" />
              </div>
              <div>
                <label className="text-sm font-medium">邮箱</label>
                <Input placeholder="请输入邮箱" className="mt-1" />
              </div>
              <div>
                <label className="text-sm font-medium">手机号</label>
                <Input placeholder="请输入手机号" className="mt-1" />
              </div>
              <div>
                <label className="text-sm font-medium">角色</label>
                <Select defaultValue="user">
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">超级管理员</SelectItem>
                    <SelectItem value="vendor">厂家</SelectItem>
                    <SelectItem value="user">终端用户</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button className="w-full bg-[#2563EB] hover:bg-[#1D4ED8]">
                创建用户
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-[#1E3A5F] bg-[#1E3A5F]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-[#94A3B8]">总用户数</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.total}</div>
          </CardContent>
        </Card>
        <Card className="border-[#1E3A5F] bg-[#1E3A5F]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-[#94A3B8]">管理员</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#EF4444]">{stats.admins}</div>
          </CardContent>
        </Card>
        <Card className="border-[#1E3A5F] bg-[#1E3A5F]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-[#94A3B8]">厂家</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#2563EB]">{stats.vendors}</div>
          </CardContent>
        </Card>
        <Card className="border-[#1E3A5F] bg-[#1E3A5F]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-[#94A3B8]">终端用户</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#22C55E]">{stats.users}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filter */}
      <Card className="border-[#1E3A5F] bg-[#1E3A5F]">
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#64748B]" />
              <Input
                placeholder="搜索用户名或邮箱..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border-[#1E3A5F] bg-[#0A1628] pl-10 text-white placeholder:text-[#64748B]"
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-[150px] border-[#1E3A5F] bg-[#0A1628] text-white">
                <SelectValue placeholder="角色筛选" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部角色</SelectItem>
                <SelectItem value="admin">管理员</SelectItem>
                <SelectItem value="vendor">厂家</SelectItem>
                <SelectItem value="user">终端用户</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="border-[#1E3A5F] bg-[#1E3A5F]">
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow className="border-[#1E3A5F] hover:bg-transparent">
                <TableHead className="text-[#94A3B8]">用户信息</TableHead>
                <TableHead className="text-[#94A3B8]">角色</TableHead>
                <TableHead className="text-[#94A3B8]">所属厂家</TableHead>
                <TableHead className="text-[#94A3B8]">状态</TableHead>
                <TableHead className="text-[#94A3B8]">最后登录</TableHead>
                <TableHead className="text-right text-[#94A3B8]">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id} className="border-[#1E3A5F]">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#2563EB]/20">
                        <Users className="h-5 w-5 text-[#2563EB]" />
                      </div>
                      <div>
                        <div className="font-medium text-white">{user.name}</div>
                        <div className="text-sm text-[#94A3B8]">{user.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={roleColors[user.role]}>
                      {roleLabels[user.role]}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-[#94A3B8]">
                    {user.vendorName || '-'}
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.status === 'active' ? 'default' : 'secondary'}
                      className={user.status === 'active' ? 'bg-[#DCFCE7] text-[#16A34A]' : ''}
                    >
                      {user.status === 'active' ? '正常' : '禁用'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm text-[#94A3B8]">
                      <Clock className="h-3 w-3" />
                      {user.lastLogin}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="sm" className="text-[#2563EB]">
                        <UserCog className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-[#2563EB]">
                        <Shield className="h-4 w-4" />
                      </Button>
                    </div>
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
