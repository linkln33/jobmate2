"use client";

import React from "react";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/contexts/AuthContext";
import { LayoutProvider } from "@/contexts/LayoutContext";
import { AssistantProvider } from "@/contexts/AssistantContext/AssistantContext";
import AIAdaptivePanel from "@/components/assistant/AIAdaptivePanel";

interface ClientLayoutProps {
  children: React.ReactNode;
}

export function ClientLayout({ children }: ClientLayoutProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AuthProvider>
        <LayoutProvider>
          <AssistantProvider>
            {children}
            <AIAdaptivePanel />
            <Toaster />
          </AssistantProvider>
        </LayoutProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
