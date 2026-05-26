'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface VendorInfo {
  id: string;
  name: string;
  code: string;
  contact_name: string | null;
  contact_phone: string | null;
  contact_email: string | null;
  status: string;
  is_active: boolean;
  expires_at: string | null;
}

interface VendorAuthContextType {
  vendor: VendorInfo | null;
  loading: boolean;
  isLoggedIn: boolean;
  logout: () => void;
  refreshVendor: () => Promise<void>;
}

const VendorAuthContext = createContext<VendorAuthContextType | undefined>(undefined);

export function VendorAuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [vendor, setVendor] = useState<VendorInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 检查登录状态
    const checkAuth = () => {
      try {
        const isLoggedIn = localStorage.getItem('vendorLoggedIn') === 'true';
        const vendorInfo = localStorage.getItem('vendorInfo');
        
        if (isLoggedIn && vendorInfo) {
          setVendor(JSON.parse(vendorInfo));
        }
      } catch (error) {
        console.error('检查登录状态失败:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const logout = () => {
    localStorage.removeItem('vendorLoggedIn');
    localStorage.removeItem('vendorInfo');
    setVendor(null);
    router.push('/vendor/login');
  };

  const refreshVendor = async () => {
    if (!vendor) return;
    
    try {
      const response = await fetch('/api/vendor/auth/login', {
        headers: { 'x-vendor-id': vendor.id }
      });
      
      const data = await response.json();
      if (data.success) {
        setVendor(data.vendor);
        localStorage.setItem('vendorInfo', JSON.stringify(data.vendor));
      }
    } catch (error) {
      console.error('刷新厂家信息失败:', error);
    }
  };

  return (
    <VendorAuthContext.Provider value={{ 
      vendor, 
      loading, 
      isLoggedIn: !!vendor,
      logout,
      refreshVendor
    }}>
      {children}
    </VendorAuthContext.Provider>
  );
}

export function useVendorAuth() {
  const context = useContext(VendorAuthContext);
  if (context === undefined) {
    throw new Error('useVendorAuth must be used within a VendorAuthProvider');
  }
  return context;
}
