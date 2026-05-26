'use client';

import { toast as sonnerToast } from 'sonner';

type ToastVariant = 'default' | 'success' | 'error' | 'warning' | 'info';

interface ToastOptions {
  title?: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
}

export function useToast() {
  const toast = (options: ToastOptions) => {
    const { title, description, variant = 'default', duration = 3000 } = options;
    
    const message = title || description || '';
    
    switch (variant) {
      case 'success':
        sonnerToast.success(message, { description: title ? description : undefined, duration });
        break;
      case 'error':
        sonnerToast.error(message, { description: title ? description : undefined, duration });
        break;
      case 'warning':
        sonnerToast.warning(message, { description: title ? description : undefined, duration });
        break;
      case 'info':
        sonnerToast.info(message, { description: title ? description : undefined, duration });
        break;
      default:
        sonnerToast(message, { description: title ? description : undefined, duration });
    }
  };

  return {
    toast,
    success: (message: string, description?: string) => 
      sonnerToast.success(message, { description }),
    error: (message: string, description?: string) => 
      sonnerToast.error(message, { description }),
    warning: (message: string, description?: string) => 
      sonnerToast.warning(message, { description }),
    info: (message: string, description?: string) => 
      sonnerToast.info(message, { description }),
  };
}

// 直接导出 toast 函数，方便在非 hook 场景使用
export const toast = {
  success: (message: string, description?: string) => 
    sonnerToast.success(message, { description }),
  error: (message: string, description?: string) => 
    sonnerToast.error(message, { description }),
  warning: (message: string, description?: string) => 
    sonnerToast.warning(message, { description }),
  info: (message: string, description?: string) => 
    sonnerToast.info(message, { description }),
  default: (message: string, description?: string) => 
    sonnerToast(message, { description }),
};
