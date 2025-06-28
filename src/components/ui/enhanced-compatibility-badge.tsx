import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts/core';
import { GaugeChart } from 'echarts/charts';
import { TooltipComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import { Tooltip } from '@/components/ui/tooltip';
import { TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

// Register necessary ECharts components
echarts.use([GaugeChart, TooltipComponent, CanvasRenderer]);

interface EnhancedCompatibilityBadgeProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  primaryReason?: string;
  className?: string;
  onClick?: () => void;
}

export function EnhancedCompatibilityBadge({
  score,
  size = 'md',
  primaryReason,
  className = '',
  onClick
}: EnhancedCompatibilityBadgeProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);
  
  // Size mapping
  const sizeMap = {
    sm: { width: 40, height: 40, fontSize: 10 },
    md: { width: 60, height: 60, fontSize: 14 },
    lg: { width: 80, height: 80, fontSize: 18 }
  };
  
  // Color mapping based on score
  const getColor = (score: number) => {
    if (score >= 80) return ['#10b981', '#34d399']; // Green gradient
    if (score >= 60) return ['#34d399', '#6ee7b7']; // Light green gradient
    if (score >= 40) return ['#f59e0b', '#fbbf24']; // Amber gradient
    if (score >= 20) return ['#f97316', '#fb923c']; // Orange gradient
    return ['#ef4444', '#f87171']; // Red gradient
  };
  
  useEffect(() => {
    if (!chartRef.current) return;
    
    // Initialize chart
    if (!chartInstance.current) {
      chartInstance.current = echarts.init(chartRef.current);
    }
    
    const colors = getColor(score);
    // Make sure we have a valid size or fall back to medium
    const { fontSize } = sizeMap[size] || sizeMap['md'];
    
    // Set chart options
    const option = {
      series: [
        {
          type: 'gauge',
          startAngle: 90,
          endAngle: -270,
          pointer: { show: false },
          progress: {
            show: true,
            overlap: false,
            roundCap: true,
            clip: false,
            itemStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  { offset: 0, color: colors[0] },
                  { offset: 1, color: colors[1] }
                ]
              }
            }
          },
          axisLine: {
            lineStyle: {
              width: 8,
              color: [[1, 'rgba(0,0,0,0.05)']]
            }
          },
          splitLine: { show: false },
          axisTick: { show: false },
          axisLabel: { show: false },
          detail: {
            valueAnimation: true,
            fontSize,
            offsetCenter: [0, 0],
            formatter: '{value}%',
            color: '#333'
          },
          data: [{ value: score }]
        }
      ]
    };
    
    // Apply options
    chartInstance.current.setOption(option);
    
    // Resize handler
    const handleResize = () => {
      chartInstance.current?.resize();
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      chartInstance.current?.dispose();
      chartInstance.current = null;
    };
  }, [score, size]);
  
  // Make sure we have a valid size or fall back to medium
  const { width, height } = sizeMap[size] || sizeMap['md'];
  
  const badge = (
    <div 
      ref={chartRef} 
      className={`relative ${className} cursor-pointer`} 
      style={{ width, height }}
      onClick={onClick}
    />
  );
  
  // If there's a primary reason, wrap in tooltip
  if (primaryReason) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            {badge}
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-sm">{primaryReason}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }
  
  return badge;
}
