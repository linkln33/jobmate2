"use client";

import dynamic from 'next/dynamic';
import { Skeleton } from './loading-skeleton';

// Create a loading component for charts
const ChartLoading = () => <Skeleton className="h-64 w-full" />;

// Dynamically import Recharts components with loading fallbacks
export const DynamicResponsiveContainer = dynamic(
  () => import('recharts').then(mod => mod.ResponsiveContainer),
  { loading: () => <ChartLoading />, ssr: false }
);

export const DynamicBarChart = dynamic(
  () => import('recharts').then(mod => mod.BarChart),
  { loading: () => <ChartLoading />, ssr: false }
);

export const DynamicLineChart = dynamic(
  () => import('recharts').then(mod => mod.LineChart),
  { loading: () => <ChartLoading />, ssr: false }
);

export const DynamicPieChart = dynamic(
  () => import('recharts').then(mod => mod.PieChart),
  { loading: () => <ChartLoading />, ssr: false }
);

export const DynamicAreaChart = dynamic(
  () => import('recharts').then(mod => mod.AreaChart),
  { loading: () => <ChartLoading />, ssr: false }
);

// For smaller components, we don't need loading indicators
const dynamicImport = (componentName: string) => {
  return dynamic(
    () => import('recharts').then(mod => {
      // Type-safe way to access the component
      const Component = mod[componentName as keyof typeof mod];
      return Component;
    }),
    { ssr: false }
  );
};

export const DynamicXAxis = dynamicImport('XAxis');
export const DynamicYAxis = dynamicImport('YAxis');
export const DynamicTooltip = dynamicImport('Tooltip');
export const DynamicLegend = dynamicImport('Legend');
export const DynamicCartesianGrid = dynamicImport('CartesianGrid');
export const DynamicBar = dynamicImport('Bar');
export const DynamicLine = dynamicImport('Line');
export const DynamicPie = dynamicImport('Pie');
export const DynamicCell = dynamicImport('Cell');
export const DynamicArea = dynamicImport('Area');
