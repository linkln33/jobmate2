import { DashboardSkeleton } from "@/components/ui/loading-skeleton";
import { UnifiedDashboardLayout } from "@/components/layout/unified-dashboard-layout";

export default function InsightsLoading() {
  return (
    <UnifiedDashboardLayout title="Insights & Stats" showSearch={true}>
      <DashboardSkeleton />
    </UnifiedDashboardLayout>
  );
}
