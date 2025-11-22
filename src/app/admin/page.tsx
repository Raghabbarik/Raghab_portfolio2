"use client";

import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';

const LoginForm = dynamic(() => import('@/components/admin/login-form').then(mod => mod.LoginForm), { 
  ssr: false,
  loading: () => (
    <div className="w-full max-w-sm">
      <Skeleton className="h-[450px] w-full" />
    </div>
  )
});

export default function AdminLoginPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </main>
  );
}
