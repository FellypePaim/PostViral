"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { AuthProvider } from "@/components/providers/auth-provider";
import { ToastProvider } from "@/components/ui/toast";
import { Navbar } from "@/components/layout/navbar";

export default function AppLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isEditor = pathname.startsWith("/gerador");

  return (
    <AuthProvider>
      <ToastProvider>
        <Navbar />
        {isEditor ? (
          <>{children}</>
        ) : (
          <main className="flex-1 max-w-[1400px] mx-auto w-full px-4 py-6">
            {children}
          </main>
        )}
      </ToastProvider>
    </AuthProvider>
  );
}
