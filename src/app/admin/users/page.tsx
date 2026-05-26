'use client';

import { useEffect, useState } from 'react';
import { Users, RefreshCw, Search, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface User {
  id: string;
  name: string;
  phone: string;
  email: string;
  role: string;
  isActive: boolean;
  expiresAt: string | null;
  createdAt: string;
  vendor?: {
    name: string;
  };
}

export default function AdminUsersPage() {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState('');

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin/users');
      const result = await response.json();
      
      if (result.success) {
        setUsers(result.data);
      }
    } catch (error) {
      console.error('Fetch users error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
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

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(search.toLowerCase()) ||
    user.phone?.includes(search) ||
    user.email?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <RefreshCw className="h-8 w-8 animate-spin text-[#22C55E]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">用户管理</h1>
          <p className="text-sm text-[#94A3B8]">
            共 {users.length} 个用户
          </p>
        </div>
        <Button 
          onClick={fetchUsers}
          className="bg-[#1E3A5F] hover:bg-[#1E3A5F]/80 text-white"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          刷新
        </Button>
      </div>

      {/* User Table */}
      <Card className="bg-[#1E3A5F] border-[#2D4A6F]">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg text-white">用户列表</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#94A3B8]" />
              <Input
                placeholder="搜索用户..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 bg-[#0A1628] border-[#2D4A6F] text-white"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredUsers.length === 0 ? (
            <div className="text-center py-10 text-[#94A3B8]">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>{search ? '未找到匹配的用户' : '暂无用户数据'}</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-[#2D4A6F] hover:bg-[#2D4A6F]/50">
                  <TableHead className="text-[#94A3B8]">用户名称</TableHead>
                  <TableHead className="text-[#94A3B8]">联系电话</TableHead>
                  <TableHead className="text-[#94A3B8]">邮箱</TableHead>
                  <TableHead className="text-[#94A3B8]">所属厂家</TableHead>
                  <TableHead className="text-[#94A3B8]">状态</TableHead>
                  <TableHead className="text-[#94A3B8]">到期时间</TableHead>
                  <TableHead className="text-[#94A3B8]">创建时间</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id} className="border-[#2D4A6F] hover:bg-[#2D4A6F]/50">
                    <TableCell className="font-medium text-white">{user.name}</TableCell>
                    <TableCell className="text-[#94A3B8]">{user.phone || '-'}</TableCell>
                    <TableCell className="text-[#94A3B8]">{user.email || '-'}</TableCell>
                    <TableCell className="text-[#94A3B8]">{user.vendor?.name || '-'}</TableCell>
                    <TableCell>
                      {user.isActive && !isExpired(user.expiresAt) ? (
                        <Badge className="bg-[#22C55E]">正常</Badge>
                      ) : (
                        <Badge className="bg-[#EF4444]">已禁用</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-sm">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span className={isExpired(user.expiresAt) ? 'text-[#EF4444]' : 'text-[#94A3B8]'}>
                          {getExpiresText(user.expiresAt)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-[#94A3B8]">
                      {new Date(user.createdAt).toLocaleDateString()}
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
