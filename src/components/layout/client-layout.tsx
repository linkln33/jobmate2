"use client";

import React from "react";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/contexts/AuthContext";
import type { User } from "@/models/user";
import { LayoutProvider } from "@/contexts/LayoutContext";
import { AssistantProvider } from "@/contexts/AssistantContext/AssistantContext";
import AIAdaptivePanel from "@/components/assistant/AIAdaptivePanel";
import { useAuth } from "@/contexts/AuthContext";

interface ClientLayoutProps {
  children: React.ReactNode;
  initialUser?: User | null;
  initialToken?: string | null;
}

export function ClientLayout({ children, initialUser = null, initialToken = null }: ClientLayoutProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AuthProvider initialUser={initialUser} initialToken={initialToken}>
        <LayoutProvider>
          <InnerLayout>{children}</InnerLayout>
          <Toaster />
        </LayoutProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

function InnerLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return (
      <AssistantProvider>
        {children}
        <AIAdaptivePanel />
      </AssistantProvider>
    );
  }

  return <>{children}</>;
}
