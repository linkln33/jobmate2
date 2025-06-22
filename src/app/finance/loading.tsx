import { DashboardSkeleton } from "@/components/ui/loading-skeleton";
import { UnifiedDashboardLayout } from "@/components/layout/unified-dashboard-layout";

export default function FinanceLoading() {
  return (
    <UnifiedDashboardLayout title="Wallet" showSearch={true}>
      <DashboardSkeleton />
    </UnifiedDashboardLayout>
  );
}
