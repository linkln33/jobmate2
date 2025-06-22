import { DashboardSkeleton } from "@/components/ui/loading-skeleton";
import { UnifiedDashboardLayout } from "@/components/layout/unified-dashboard-layout";

export default function MessagesLoading() {
  return (
    <UnifiedDashboardLayout title="Messages" showSearch={true}>
      <DashboardSkeleton />
    </UnifiedDashboardLayout>
  );
}
