import { DashboardSkeleton } from "@/components/ui/loading-skeleton";
import { UnifiedDashboardLayout } from "@/components/layout/unified-dashboard-layout";

export default function DashboardLoading() {
  return (
    <UnifiedDashboardLayout title="Dashboard" showSearch={true}>
      <DashboardSkeleton />
    </UnifiedDashboardLayout>
  );
}
