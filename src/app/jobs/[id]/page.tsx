"use client";

import { JobDetailsPage } from "@/components/pages/job-details-page";
import { useParams } from "next/navigation";

export default function JobDetailsRoute() {
  const params = useParams();
  const jobId = params.id as string;

  return <JobDetailsPage jobId={jobId} />;
}
