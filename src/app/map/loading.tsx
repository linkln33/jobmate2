"use client";

import { Spinner } from "@/components/ui/spinner";

export default function MapLoading() {
  return (
    <div className="h-[calc(100vh-120px)] flex items-center justify-center">
      <div className="text-center">
        <Spinner className="h-12 w-12 text-brand-500 mb-4" />
        <p className="text-lg font-medium">Loading map view...</p>
      </div>
    </div>
  );
}
