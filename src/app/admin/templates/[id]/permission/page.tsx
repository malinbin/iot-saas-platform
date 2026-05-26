'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import {
  ArrowLeft,
  Search,
  UserPlus,
  Shield,
  Check,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

interface Vendor {
  id: string;
  name: string;
  code: string;
  status: string;
  device_count: number;
}

interface Permission {
  id: string;
  vendor_id: string;
  vendor_name: string;
  vendor_code: string;
  can_view: boolean;
  can_create: boolean;
  can_edit: boolean;
  is_active: boolean;
  granted_at: string;
}

export default function TemplatePermissionPage() {
  const params = useParams();
  const templateId = params.id as string;
  
  const [template, setTemplate] = useState<any>(null);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [selectedVendors, setSelectedVendors] = useState<string[]>([]);

  useEffect(() => {
    loadData();
  }, [templateId]);

  const loadData = async () => {
    setLoading(true);
    try {
      // 加载模板信息
      const templateRes = await fetch(`/api/admin/templates/${templateId}`);
      if (templateRes.ok) {
        setTemplate(await templateRes.json());
      }
      
      // 加载授权列表
      const permRes = await fetch(`/api/admin/templates/${templateId}/permissions`);
      if (permRes.ok) {
        const data = await permRes.json();
        setPermissions(data.permissions || []);
      }
      
      // 加载厂家列表
      const vendorsRes = await fetch('/api/admin/vendors?status=approved');
      if (vendorsRes.ok) {
        const data = await vendorsRes.json();
        setVendors(data.vendors || []);
      }
    } catch (error) {
      console.error('加载数据失败:', error);
      // 模拟数据
      setTemplate({
        id: templateId,
        name: '注塑机',
        code: 'injection_molding',
        category: '生产设备',
      });
      setPermissions([
        {
          id: 'perm_1',
          vendor_id: 'v1',
          vendor_name: '华为科技',
          vendor_code: 'HUAWEI',
          can_view: true,
          can_create: true,
          can_edit: false,
          is_active: true,
          granted_at: '2024-01-10T10:00:00Z',
        },
        {
          id: 'perm_2',
          vendor_id: 'v2',
          vendor_name: '小米设备',
          vendor_code: 'XIAOMI',
          can_view: true,
          can_create: true,
          can_edit: false,
          is_active: true,
          granted_at: '2024-01-12T14:30:00Z',
        },
      ]);
      setVendors([
        { id: 'v1', name: '华为科技', code: 'HUAWEI', status: 'approved', device_count: 120 },
        { id: 'v2', name: '小米设备', code: 'XIAOMI', status: 'approved', device_count: 85 },
        { id: 'v3', name: '宁德时代', code: 'CATL', status: 'approved', device_count: 200 },
        { id: 'v4', name: '大疆创新', code: 'DJI', status: 'approved', device_count: 50 },
      ]);
    }
    setLoading(false);
  };

  const handleGrantPermission = async () => {
    if (selectedVendors.length === 0) {
      toast.error('请选择要授权的厂家');
      return;
    }
    
    try {
      const res = await fetch(`/api/admin/templates/${templateId}/permissions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vendor_ids: selectedVendors,
          can_view: true,
          can_create: true,
          can_edit: false,
        }),
      });
      
      if (res.ok) {
        toast.success(`已授权 ${selectedVendors.length} 个厂家`);
        setAddDialogOpen(false);
        setSelectedVendors([]);
        loadData();
      } else {
        toast.error('授权失败');
      }
    } catch (error) {
      toast.error('授权失败');
    }
  };

  const handleUpdatePermission = async (permissionId: string, updates: Partial<Permission>) => {
    try {
      const res = await fetch(`/api/admin/templates/${templateId}/permissions/${permissionId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      
      if (res.ok) {
        toast.success('权限已更新');
        loadData();
      } else {
        toast.error('更新失败');
      }
    } catch (error) {
      toast.error('更新失败');
    }
  };

  const handleRevokePermission = async (permissionId: string) => {
    if (!confirm('确定要撤销该厂家的模板使用权限吗？')) return;
    
    try {
      const res = await fetch(`/api/admin/templates/${templateId}/permissions/${permissionId}`, {
        method: 'DELETE',
      });
      
      if (res.ok) {
        toast.success('权限已撤销');
        loadData();
      } else {
        toast.error('撤销失败');
      }
    } catch (error) {
      toast.error('撤销失败');
    }
  };

  const filteredPermissions = permissions.filter(p => 
    p.vendor_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.vendor_code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const availableVendors = vendors.filter(v => 
    !permissions.some(p => p.vendor_id === v.id)
  );

  return (
    <div className="space-y-6">
      {/* 返回和标题 */}
      <div className="flex items-center gap-4">
        <Link href="/admin/templates">
          <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
            <ArrowLeft className="h-4 w-4 mr-2" />
            返回
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-white">
            {template?.name || '加载中...'} - 授权管理
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            管理可使用该模板的厂家
          </p>
        </div>
        <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <UserPlus className="h-4 w-4 mr-2" />
              授权厂家
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-2xl">
            <DialogHeader>
              <DialogTitle>授权厂家使用模板</DialogTitle>
              <DialogDescription className="text-slate-400">
                选择要授权的厂家，授权后厂家可以基于此模板创建设备
              </DialogDescription>
            </DialogHeader>
            
            <div className="py-4 space-y-4">
              {/* 权限选项 */}
              <div className="flex gap-6">
                <label className="flex items-center gap-2">
                  <Checkbox defaultChecked />
                  <span className="text-sm">可查看模板</span>
                </label>
                <label className="flex items-center gap-2">
                  <Checkbox defaultChecked />
                  <span className="text-sm">可创建设备</span>
                </label>
                <label className="flex items-center gap-2">
                  <Checkbox />
                  <span className="text-sm">可编辑模板</span>
                </label>
              </div>
              
              {/* 厂家列表 */}
              <div className="border rounded-lg border-slate-700 divide-y divide-slate-700">
                {availableVendors.length === 0 ? (
                  <div className="p-4 text-center text-slate-500">
                    所有已审核厂家均已授权
                  </div>
                ) : (
                  availableVendors.map((vendor) => (
                    <div key={vendor.id} className="p-3 flex items-center gap-3 hover:bg-slate-700/50">
                      <Checkbox
                        checked={selectedVendors.includes(vendor.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedVendors([...selectedVendors, vendor.id]);
                          } else {
                            setSelectedVendors(selectedVendors.filter(id => id !== vendor.id));
                          }
                        }}
                      />
                      <div className="flex-1">
                        <div className="font-medium text-white">{vendor.name}</div>
                        <div className="text-xs text-slate-500">{vendor.code}</div>
                      </div>
                      <div className="text-sm text-slate-400">
                        {vendor.device_count} 台设备
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setAddDialogOpen(false)} className="border-slate-600">
                取消
              </Button>
              <Button onClick={handleGrantPermission} className="bg-blue-600 hover:bg-blue-700">
                确认授权 ({selectedVendors.length})
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* 模板信息卡片 */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="p-4">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-400" />
              <span className="text-slate-400">模板：</span>
              <span className="text-white font-medium">{template?.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-400">分类：</span>
              <Badge className="bg-blue-500/20 text-blue-400">{template?.category}</Badge>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-400">已授权：</span>
              <span className="text-white font-medium">{permissions.length}</span>
              <span className="text-slate-500">家</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 授权列表 */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white">已授权厂家</CardTitle>
              <CardDescription className="text-slate-400">
                这些厂家可以使用此模板创建设备
              </CardDescription>
            </div>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="搜索厂家..."
                className="pl-9 bg-slate-900 border-slate-600"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-slate-700 hover:bg-slate-700/50">
                <TableHead className="text-slate-400">厂家信息</TableHead>
                <TableHead className="text-slate-400">查看</TableHead>
                <TableHead className="text-slate-400">创建设备</TableHead>
                <TableHead className="text-slate-400">编辑模板</TableHead>
                <TableHead className="text-slate-400">状态</TableHead>
                <TableHead className="text-slate-400">授权时间</TableHead>
                <TableHead className="text-slate-400 text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPermissions.map((perm) => (
                <TableRow key={perm.id} className="border-slate-700 hover:bg-slate-700/50">
                  <TableCell>
                    <div>
                      <div className="font-medium text-white">{perm.vendor_name}</div>
                      <div className="text-xs text-slate-500">{perm.vendor_code}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {perm.can_view ? (
                      <Check className="h-4 w-4 text-green-400" />
                    ) : (
                      <X className="h-4 w-4 text-slate-600" />
                    )}
                  </TableCell>
                  <TableCell>
                    {perm.can_create ? (
                      <Check className="h-4 w-4 text-green-400" />
                    ) : (
                      <X className="h-4 w-4 text-slate-600" />
                    )}
                  </TableCell>
                  <TableCell>
                    {perm.can_edit ? (
                      <Check className="h-4 w-4 text-green-400" />
                    ) : (
                      <X className="h-4 w-4 text-slate-600" />
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={perm.is_active ? "default" : "secondary"}
                      className={perm.is_active ? "bg-green-500/20 text-green-400" : "bg-slate-600 text-slate-400"}
                    >
                      {perm.is_active ? '有效' : '已禁用'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-slate-400">
                    {new Date(perm.granted_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-slate-400 hover:text-white"
                        onClick={() => handleUpdatePermission(perm.id, { is_active: !perm.is_active })}
                      >
                        {perm.is_active ? '禁用' : '启用'}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-red-400 hover:text-red-300"
                        onClick={() => handleRevokePermission(perm.id)}
                      >
                        撤销
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {filteredPermissions.length === 0 && (
            <div className="text-center py-8 text-slate-500">
              暂无授权记录，点击右上角"授权厂家"添加
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
