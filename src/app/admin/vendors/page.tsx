'use client';

import { useState } from 'react';
import {
  Search,
  Filter,
  MoreHorizontal,
  CheckCircle,
  XCircle,
  Clock,
  Building2,
} from 'lucide-react';
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { generateVendors } from '@/lib/mock-data';

export default function VendorsPage() {
  const vendors = generateVendors();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedVendor, setSelectedVendor] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

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

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">厂家管理</h1>
          <p className="text-sm text-[#64748B]">
            管理所有合作厂家，审核入驻申请
          </p>
        </div>
        <Button className="bg-[#2563EB] hover:bg-[#2563EB]/90">
          <Building2 className="mr-2 h-4 w-4" />
          邀请厂家
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card className="border-[#1E3A5F] bg-[#1E3A5F]/30">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-[#94A3B8]">总厂家数</div>
                <div className="text-2xl font-bold text-white">
                  {totalVendors}
                </div>
              </div>
              <Building2 className="h-8 w-8 text-[#2563EB]" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-[#1E3A5F] bg-[#1E3A5F]/30">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-[#94A3B8]">已审核通过</div>
                <div className="text-2xl font-bold text-[#22C55E]">
                  {approvedVendors}
                </div>
              </div>
              <CheckCircle className="h-8 w-8 text-[#22C55E]" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-[#1E3A5F] bg-[#1E3A5F]/30">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-[#94A3B8]">待审核</div>
                <div className="text-2xl font-bold text-[#F97316]">
                  {pendingVendors}
                </div>
              </div>
              <Clock className="h-8 w-8 text-[#F97316]" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter Bar */}
      <Card className="border-[#1E3A5F] bg-[#1E3A5F]/30">
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-1 gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#64748B]" />
                <Input
                  placeholder="搜索厂家名称..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border-[#1E3A5F] bg-[#0A1628] pl-10 text-white placeholder:text-[#64748B]"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40 border-[#1E3A5F] bg-[#0A1628] text-white">
                  <Filter className="mr-2 h-4 w-4 text-[#64748B]" />
                  <SelectValue placeholder="筛选状态" />
                </SelectTrigger>
                <SelectContent className="border-[#1E3A5F] bg-[#0A1628] text-white">
                  <SelectItem value="all">全部状态</SelectItem>
                  <SelectItem value="approved">已审核</SelectItem>
                  <SelectItem value="pending">待审核</SelectItem>
                  <SelectItem value="rejected">已拒绝</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="border-[#1E3A5F] text-[#94A3B8] hover:bg-[#1E3A5F] hover:text-white"
              >
                批量审核
              </Button>
              <Button
                variant="outline"
                className="border-[#1E3A5F] text-[#94A3B8] hover:bg-[#1E3A5F] hover:text-white"
              >
                导出数据
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Vendors Table */}
      <Card className="border-[#1E3A5F] bg-[#1E3A5F]/30">
        <CardHeader>
          <CardTitle className="text-white">
            厂家列表（共 {filteredVendors.length} 家）
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-[#1E3A5F] hover:bg-[#0A1628]">
                <TableHead className="text-[#64748B]">厂家名称</TableHead>
                <TableHead className="text-[#64748B]">联系人</TableHead>
                <TableHead className="text-[#64748B]">邮箱</TableHead>
                <TableHead className="text-[#64748B]">电话</TableHead>
                <TableHead className="text-[#64748B]">设备数</TableHead>
                <TableHead className="text-[#64748B]">状态</TableHead>
                <TableHead className="text-[#64748B]">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredVendors.map((vendor) => (
                <TableRow
                  key={vendor.id}
                  className="border-[#1E3A5F] hover:bg-[#0A1628]"
                >
                  <TableCell className="font-medium text-white">
                    {vendor.name}
                  </TableCell>
                  <TableCell className="text-[#94A3B8]">
                    {vendor.contact}
                  </TableCell>
                  <TableCell className="text-[#94A3B8]">
                    {vendor.email}
                  </TableCell>
                  <TableCell className="text-[#94A3B8]">
                    {vendor.phone}
                  </TableCell>
                  <TableCell className="text-white">
                    {vendor.deviceCount}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={`border-0 ${
                        vendor.status === 'approved'
                          ? 'bg-[#22C55E]/20 text-[#22C55E]'
                          : vendor.status === 'pending'
                            ? 'bg-[#F97316]/20 text-[#F97316]'
                            : 'bg-[#EF4444]/20 text-[#EF4444]'
                      }`}
                    >
                      {vendor.status === 'approved'
                        ? '已审核'
                        : vendor.status === 'pending'
                          ? '待审核'
                          : '已拒绝'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-[#94A3B8] hover:bg-[#1E3A5F] hover:text-white"
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
                              onClick={() => {
                                setSelectedVendor(vendor.id);
                                setDialogOpen(true);
                              }}
                            >
                              <CheckCircle className="mr-2 h-4 w-4 text-[#22C55E]" />
                              审核通过
                            </DropdownMenuItem>
                            <DropdownMenuItem className="focus:bg-[#1E3A5F]">
                              <XCircle className="mr-2 h-4 w-4 text-[#EF4444]" />
                              拒绝申请
                            </DropdownMenuItem>
                          </>
                        )}
                        <DropdownMenuItem className="focus:bg-[#1E3A5F]">
                          查看详情
                        </DropdownMenuItem>
                        <DropdownMenuItem className="focus:bg-[#1E3A5F]">
                          编辑信息
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Audit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="border-[#1E3A5F] bg-[#0A1628] text-white">
          <DialogHeader>
            <DialogTitle>确认审核通过？</DialogTitle>
            <DialogDescription className="text-[#94A3B8]">
              审核通过后，该厂家将可以接入平台并添加设备。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDialogOpen(false)}
              className="border-[#1E3A5F] text-[#94A3B8] hover:bg-[#1E3A5F] hover:text-white"
            >
              取消
            </Button>
            <Button
              onClick={() => setDialogOpen(false)}
              className="bg-[#22C55E] hover:bg-[#22C55E]/90"
            >
              确认通过
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
