"use client";

import { ListingCreationWizard } from "@/components/marketplace/create-listing/listing-creation-wizard";
import { UnifiedDashboardLayout } from "@/components/layout/unified-dashboard-layout";

export default function CreateListingPage() {
  return (
    <UnifiedDashboardLayout title="Create Listing" showSearch={false}>
      <ListingCreationWizard />
    </UnifiedDashboardLayout>
  );
}
