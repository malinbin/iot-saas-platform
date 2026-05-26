'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Search,
  MoreHorizontal,
  CheckCircle,
  XCircle,
  Plus,
  RefreshCw,
  Eye,
  Edit,
  Trash2,
  Key,
} from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';

interface Vendor {
  id: string;
  name: string;
  code: string;
  contact_name: string;
  contact_phone: string;
  contact_email: string;
  address: string | null;
  status: string;
  device_count: number;
  customer_count: number;
  monthly_revenue: number;
  created_at: string;
  expires_at: string | null;
  is_active: boolean;
}

export default function VendorManagementPage() {
  const { toast } = useToast();
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [detailOpen, setDetailOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ password: '', confirmPassword: '' });
  const [savingPassword, setSavingPassword] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [editForm, setEditForm] = useState({
    name: '',
    contact_name: '',
    contact_phone: '',
    contact_email: '',
    address: '',
    is_active: true,
  });

  const loadVendors = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/vendors');
      const data = await res.json();
      if (data.success) {
        setVendors(data.data || []);
      }
    } catch (error) {
      toast({ title: '加载失败', variant: 'error' });
    }
    setLoading(false);
  };

  useEffect(() => {
    loadVendors();
  }, []);

  const handleApprove = async (vendor: Vendor) => {
    try {
      const res = await fetch('/api/admin/vendors', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: vendor.id, status: 'approved' }),
      });
      if (res.ok) {
        toast({ title: '审核通过', description: `${vendor.name} 已通过审核` });
        loadVendors();
      }
    } catch (error) {
      toast({ title: '操作失败', variant: 'error' });
    }
  };

  const handleReject = async (vendor: Vendor) => {
    try {
      const res = await fetch('/api/admin/vendors', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: vendor.id, status: 'rejected' }),
      });
      if (res.ok) {
        toast({ title: '已拒绝', description: `${vendor.name} 入驻申请已拒绝` });
        loadVendors();
      }
    } catch (error) {
      toast({ title: '操作失败', variant: 'error' });
    }
  };

  const handleToggleActive = async (vendor: Vendor) => {
    try {
      const res = await fetch('/api/admin/vendors', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: vendor.id, is_active: !vendor.is_active }),
      });
      if (res.ok) {
        toast({ title: '状态已更新', description: `${vendor.name} ${!vendor.is_active ? '已启用' : '已禁用'}` });
        loadVendors();
      }
    } catch (error) {
      toast({ title: '操作失败', variant: 'error' });
    }
  };

  const handleDelete = async (vendor: Vendor) => {
    if (!confirm(`确定要删除厂家 "${vendor.name}" 吗？此操作不可恢复。`)) return;
    
    try {
      const res = await fetch(`/api/admin/vendors?id=${vendor.id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        toast({ title: '删除成功', description: `${vendor.name} 已删除` });
        loadVendors();
      }
    } catch (error) {
      toast({ title: '删除失败', variant: 'error' });
    }
  };

  const openDetail = (vendor: Vendor) => {
    setSelectedVendor(vendor);
    setDetailOpen(true);
  };

  const openEdit = (vendor: Vendor) => {
    setSelectedVendor(vendor);
    setEditForm({
      name: vendor.name,
      contact_name: vendor.contact_name,
      contact_phone: vendor.contact_phone,
      contact_email: vendor.contact_email,
      address: vendor.address || '',
      is_active: vendor.is_active,
    });
    setEditOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!selectedVendor) return;
    
    try {
      const res = await fetch('/api/admin/vendors', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedVendor.id,
          ...editForm,
        }),
      });
      if (res.ok) {
        toast({ title: '保存成功', description: '厂家信息已更新' });
        setEditOpen(false);
        loadVendors();
      }
    } catch (error) {
      toast({ title: '保存失败', variant: 'error' });
    }
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '永久有效';
    return new Date(dateStr).toLocaleDateString('zh-CN');
  };

  // 打开密码设置对话框
  const openPasswordDialog = (vendor: Vendor) => {
    setSelectedVendor(vendor);
    setPasswordForm({ password: '', confirmPassword: '' });
    setPasswordOpen(true);
  };

  // 设置密码
  const handleSetPassword = async () => {
    if (!selectedVendor) return;
    
    if (passwordForm.password.length < 6) {
      toast({ title: '密码长度至少6位', variant: 'error' });
      return;
    }
    
    if (passwordForm.password !== passwordForm.confirmPassword) {
      toast({ title: '两次输入的密码不一致', variant: 'error' });
      return;
    }

    setSavingPassword(true);
    try {
      const response = await fetch(`/api/admin/vendors/${selectedVendor.id}/password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: passwordForm.password })
      });

      const data = await response.json();
      if (data.success) {
        toast({ title: '密码设置成功', description: `厂家 ${selectedVendor.name} 的登录密码已更新` });
        setPasswordOpen(false);
      } else {
        toast({ title: data.error || '设置失败', variant: 'error' });
      }
    } catch (error) {
      toast({ title: '网络错误', variant: 'error' });
    } finally {
      setSavingPassword(false);
    }
  };

  // 筛选厂家
  const filteredVendors = vendors.filter((vendor) => {
    const matchesSearch = vendor.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === 'all' || vendor.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // 统计数据
  const totalVendors = vendors.length;
  const approvedVendors = vendors.filter((v) => v.status === 'approved').length;
  const pendingVendors = vendors.filter((v) => v.status === 'pending').length;

  const getStatusBadge = (status: string) => {
    const styles: Record<string, { bg: string; text: string; label: string }> = {
      pending: { bg: 'bg-[#F97316]/20', text: 'text-[#F97316]', label: '待审核' },
      approved: { bg: 'bg-[#22C55E]/20', text: 'text-[#22C55E]', label: '已通过' },
      rejected: { bg: 'bg-[#EF4444]/20', text: 'text-[#EF4444]', label: '已拒绝' },
    };
    const style = styles[status] || styles.pending;
    return (
      <Badge className={`${style.bg} ${style.text} border-0`}>
        {style.label}
      </Badge>
    );
  };

  return (
    <div className="space-y-6 p-6">
      {/* 头部统计 */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-[#1E3A5F] bg-[#0A1628]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-[#94A3B8]">
              厂家总数
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{totalVendors}</div>
          </CardContent>
        </Card>
        <Card className="border-[#1E3A5F] bg-[#0A1628]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-[#94A3B8]">
              已通过审核
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#22C55E]">
              {approvedVendors}
            </div>
          </CardContent>
        </Card>
        <Card className="border-[#1E3A5F] bg-[#0A1628]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-[#94A3B8]">
              待审核
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#F97316]">
              {pendingVendors}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 操作栏 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94A3B8]" />
            <Input
              placeholder="搜索厂家..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64 border-[#1E3A5F] bg-[#0A1628] pl-9 text-white placeholder:text-[#94A3B8]"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-md border border-[#1E3A5F] bg-[#0A1628] px-3 py-2 text-white"
          >
            <option value="all">全部状态</option>
            <option value="pending">待审核</option>
            <option value="approved">已通过</option>
            <option value="rejected">已拒绝</option>
          </select>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={loadVendors}
            className="border-[#1E3A5F] text-[#94A3B8] hover:bg-[#1E3A5F] hover:text-white"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            刷新
          </Button>
          <Link href="/admin/vendors/create">
            <Button className="bg-[#2563EB] hover:bg-[#2563EB]/90">
              <Plus className="mr-2 h-4 w-4" />
              创建厂家
            </Button>
          </Link>
        </div>
      </div>

      {/* 厂家列表 */}
      <Card className="border-[#1E3A5F] bg-[#0A1628]">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-[#1E3A5F] hover:bg-[#0A1628]">
                <TableHead className="text-[#94A3B8]">厂家名称</TableHead>
                <TableHead className="text-[#94A3B8]">编码</TableHead>
                <TableHead className="text-[#94A3B8]">联系人</TableHead>
                <TableHead className="text-[#94A3B8]">联系电话</TableHead>
                <TableHead className="text-[#94A3B8]">状态</TableHead>
                <TableHead className="text-[#94A3B8]">设备数</TableHead>
                <TableHead className="text-[#94A3B8]">到期时间</TableHead>
                <TableHead className="text-[#94A3B8]">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-[#94A3B8]">
                    加载中...
                  </TableCell>
                </TableRow>
              ) : filteredVendors.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-[#94A3B8]">
                    暂无厂家数据
                  </TableCell>
                </TableRow>
              ) : (
                filteredVendors.map((vendor) => (
                  <TableRow
                    key={vendor.id}
                    className="border-[#1E3A5F] hover:bg-[#1E3A5F]/50"
                  >
                    <TableCell className="font-medium text-white">
                      {vendor.name}
                      {!vendor.is_active && (
                        <Badge className="ml-2 bg-[#EF4444]/20 text-[#EF4444]">已禁用</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-[#94A3B8]">{vendor.code}</TableCell>
                    <TableCell className="text-[#94A3B8]">
                      {vendor.contact_name}
                    </TableCell>
                    <TableCell className="text-[#94A3B8]">
                      {vendor.contact_phone}
                    </TableCell>
                    <TableCell>{getStatusBadge(vendor.status)}</TableCell>
                    <TableCell className="text-[#94A3B8]">
                      {vendor.device_count}
                    </TableCell>
                    <TableCell className="text-[#94A3B8]">
                      {formatDate(vendor.expires_at)}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            className="h-8 w-8 p-0 text-[#94A3B8] hover:text-white"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="border-[#1E3A5F] bg-[#0A1628] text-white"
                        >
                          {vendor.status === 'pending' && (
                            <>
                              <DropdownMenuItem
                                className="focus:bg-[#1E3A5F]"
                                onClick={() => handleApprove(vendor)}
                              >
                                <CheckCircle className="mr-2 h-4 w-4 text-[#22C55E]" />
                                审核通过
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                className="focus:bg-[#1E3A5F]"
                                onClick={() => handleReject(vendor)}
                              >
                                <XCircle className="mr-2 h-4 w-4 text-[#EF4444]" />
                                拒绝申请
                              </DropdownMenuItem>
                            </>
                          )}
                          <DropdownMenuItem 
                            className="focus:bg-[#1E3A5F]"
                            onClick={() => openDetail(vendor)}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            查看详情
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="focus:bg-[#1E3A5F]"
                            onClick={() => openEdit(vendor)}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            编辑信息
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="focus:bg-[#1E3A5F]"
                            onClick={() => openPasswordDialog(vendor)}
                          >
                            <Key className="mr-2 h-4 w-4 text-[#2563EB]" />
                            设置密码
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="focus:bg-[#1E3A5F]"
                            onClick={() => handleToggleActive(vendor)}
                          >
                            <Switch checked={vendor.is_active} className="mr-2 h-4 w-4" />
                            {vendor.is_active ? '禁用账号' : '启用账号'}
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="focus:bg-[#1E3A5F] text-[#EF4444]"
                            onClick={() => handleDelete(vendor)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            删除厂家
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* 详情对话框 */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="border-[#1E3A5F] bg-[#0A1628] text-white max-w-lg">
          <DialogHeader>
            <DialogTitle>厂家详情</DialogTitle>
          </DialogHeader>
          {selectedVendor && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-[#94A3B8]">厂家名称</Label>
                  <p className="text-white">{selectedVendor.name}</p>
                </div>
                <div>
                  <Label className="text-[#94A3B8]">厂家编码</Label>
                  <p className="text-white">{selectedVendor.code}</p>
                </div>
                <div>
                  <Label className="text-[#94A3B8]">联系人</Label>
                  <p className="text-white">{selectedVendor.contact_name}</p>
                </div>
                <div>
                  <Label className="text-[#94A3B8]">联系电话</Label>
                  <p className="text-white">{selectedVendor.contact_phone}</p>
                </div>
                <div>
                  <Label className="text-[#94A3B8]">联系邮箱</Label>
                  <p className="text-white">{selectedVendor.contact_email}</p>
                </div>
                <div>
                  <Label className="text-[#94A3B8]">设备数量</Label>
                  <p className="text-white">{selectedVendor.device_count}</p>
                </div>
                <div>
                  <Label className="text-[#94A3B8]">客户数量</Label>
                  <p className="text-white">{selectedVendor.customer_count}</p>
                </div>
                <div>
                  <Label className="text-[#94A3B8]">到期时间</Label>
                  <p className="text-white">{formatDate(selectedVendor.expires_at)}</p>
                </div>
              </div>
              {selectedVendor.address && (
                <div>
                  <Label className="text-[#94A3B8]">地址</Label>
                  <p className="text-white">{selectedVendor.address}</p>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button
              onClick={() => setDetailOpen(false)}
              className="bg-[#2563EB] hover:bg-[#2563EB]/90"
            >
              关闭
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 编辑对话框 */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="border-[#1E3A5F] bg-[#0A1628] text-white max-w-lg">
          <DialogHeader>
            <DialogTitle>编辑厂家信息</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-[#94A3B8]">厂家名称</Label>
              <Input
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                className="border-[#1E3A5F] bg-[#0A1628] text-white"
              />
            </div>
            <div>
              <Label className="text-[#94A3B8]">联系人</Label>
              <Input
                value={editForm.contact_name}
                onChange={(e) => setEditForm({ ...editForm, contact_name: e.target.value })}
                className="border-[#1E3A5F] bg-[#0A1628] text-white"
              />
            </div>
            <div>
              <Label className="text-[#94A3B8]">联系电话</Label>
              <Input
                value={editForm.contact_phone}
                onChange={(e) => setEditForm({ ...editForm, contact_phone: e.target.value })}
                className="border-[#1E3A5F] bg-[#0A1628] text-white"
              />
            </div>
            <div>
              <Label className="text-[#94A3B8]">联系邮箱</Label>
              <Input
                value={editForm.contact_email}
                onChange={(e) => setEditForm({ ...editForm, contact_email: e.target.value })}
                className="border-[#1E3A5F] bg-[#0A1628] text-white"
              />
            </div>
            <div>
              <Label className="text-[#94A3B8]">地址</Label>
              <Input
                value={editForm.address}
                onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                className="border-[#1E3A5F] bg-[#0A1628] text-white"
              />
            </div>
            <div className="flex items-center justify-between">
              <Label className="text-[#94A3B8]">账号状态</Label>
              <Switch
                checked={editForm.is_active}
                onCheckedChange={(checked) => setEditForm({ ...editForm, is_active: checked })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditOpen(false)}
              className="border-[#1E3A5F] text-[#94A3B8] hover:bg-[#1E3A5F] hover:text-white"
            >
              取消
            </Button>
            <Button
              onClick={handleSaveEdit}
              className="bg-[#2563EB] hover:bg-[#2563EB]/90"
            >
              保存
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 密码设置对话框 */}
      <Dialog open={passwordOpen} onOpenChange={setPasswordOpen}>
        <DialogContent className="border-[#1E3A5F] bg-[#0A1628] text-white">
          <DialogHeader>
            <DialogTitle>设置登录密码</DialogTitle>
            <DialogDescription className="text-[#94A3B8]">
              为厂家 {selectedVendor?.name} 设置登录密码
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-[#94A3B8]">新密码</Label>
              <Input
                type="password"
                placeholder="请输入密码（至少6位）"
                value={passwordForm.password}
                onChange={(e) => setPasswordForm({ ...passwordForm, password: e.target.value })}
                className="border-[#1E3A5F] bg-[#0A1628] text-white"
              />
            </div>
            <div>
              <Label className="text-[#94A3B8]">确认密码</Label>
              <Input
                type="password"
                placeholder="请再次输入密码"
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                className="border-[#1E3A5F] bg-[#0A1628] text-white"
              />
            </div>
            <p className="text-xs text-[#94A3B8]">
              提示：厂家可使用编码 + 密码登录厂家后台
            </p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setPasswordOpen(false)}
              className="border-[#1E3A5F] text-[#94A3B8] hover:bg-[#1E3A5F] hover:text-white"
            >
              取消
            </Button>
            <Button
              onClick={handleSetPassword}
              disabled={savingPassword}
              className="bg-[#2563EB] hover:bg-[#2563EB]/90"
            >
              {savingPassword ? '保存中...' : '保存密码'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
