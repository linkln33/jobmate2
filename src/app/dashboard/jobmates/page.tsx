"use client";

import { useEffect, useState } from "react";
import { JobMateDashboard } from "@/components/jobmates/jobmate-dashboard";
import { useToast } from "@/components/ui/use-toast";

export default function JobMatesPage() {
  const [userId, setUserId] = useState<string>("");
  const { toast } = useToast();
  
  useEffect(() => {
    // In a real application, this would come from your auth system
    // For now, we'll use a mock user ID
    setUserId("user-123");
    
    // Welcome toast
    toast({
      title: "Welcome to JobMates",
      description: "Your AI-powered matching assistants are ready to help you find the perfect matches.",
    });
  }, [toast]);
  
  if (!userId) {
    return <div className="container mx-auto py-12 text-center">Loading...</div>;
  }
  
  return <JobMateDashboard userId={userId} />;
}
