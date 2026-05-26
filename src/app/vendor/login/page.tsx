'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Factory, Lock, User, AlertCircle, Loader2 } from 'lucide-react';

export default function VendorLoginPage() {
  const router = useRouter();
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/vendor/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, password })
      });

      const data = await response.json();

      if (data.success) {
        // 保存登录信息到 localStorage
        localStorage.setItem('vendorInfo', JSON.stringify(data.vendor));
        localStorage.setItem('vendorLoggedIn', 'true');
        
        // 强制刷新页面，确保认证状态生效
        window.location.href = '/vendor';
      } else {
        setError(data.error || '登录失败');
      }
    } catch (err) {
      setError('网络错误，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#EFF6FF] via-white to-[#DBEAFE]">
      <div className="w-full max-w-md px-4">
        <Card className="shadow-xl border-0">
          <CardHeader className="space-y-1 pb-4">
            <div className="flex items-center justify-center mb-4">
              <div className="h-16 w-16 rounded-full bg-[#2563EB] flex items-center justify-center">
                <Factory className="h-8 w-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl text-center text-[#1E293B]">
              厂家后台登录
            </CardTitle>
            <CardDescription className="text-center text-[#64748B]">
              请输入厂家编码和密码登录系统
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="code" className="text-[#1E293B]">厂家编码</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#94A3B8]" />
                  <Input
                    id="code"
                    type="text"
                    placeholder="请输入厂家编码"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="pl-10 border-[#E2E8F0] focus:border-[#2563EB]"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-[#1E293B]">密码</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#94A3B8]" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="请输入密码"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 border-[#E2E8F0] focus:border-[#2563EB]"
                    required
                  />
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    登录中...
                  </>
                ) : '登 录'}
              </Button>
            </form>
            
            <div className="mt-6 pt-4 border-t border-[#E2E8F0]">
              <p className="text-center text-sm text-[#64748B]">
                忘记密码？请联系管理员重置
              </p>
            </div>
          </CardContent>
        </Card>
        
        <p className="mt-4 text-center text-xs text-[#94A3B8]">
          © 2024 工业物联网管理平台
        </p>
      </div>
    </div>
  );
}
