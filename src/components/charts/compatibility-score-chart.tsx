"use client";

import React from 'react';
import ReactECharts from 'echarts-for-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CompatibilityResult, CompatibilityDimension } from '@/types/compatibility';

interface CompatibilityScoreChartProps {
  compatibilityResult: CompatibilityResult;
  showDetails?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function CompatibilityScoreChart({ 
  compatibilityResult, 
  showDetails = false,
  size = 'md',
  className = ''
}: CompatibilityScoreChartProps) {
  const { overallScore, dimensions, primaryMatchReason } = compatibilityResult;
  
  // Height based on size prop
  const chartHeight = size === 'sm' ? 120 : size === 'md' ? 200 : 300;
  
  // Gauge chart options for overall score
  const gaugeOptions = {
    series: [
      {
        type: 'gauge',
        startAngle: 90,
        endAngle: -270,
        pointer: {
          show: false
        },
        progress: {
          show: true,
          overlap: false,
          roundCap: true,
          clip: false,
          itemStyle: {
            color: getScoreColor(overallScore)
          }
        },
        axisLine: {
          lineStyle: {
            width: 15
          }
        },
        splitLine: {
          show: false,
        },
        axisTick: {
          show: false
        },
        axisLabel: {
          show: false
        },
        detail: {
          valueAnimation: true,
          fontSize: size === 'sm' ? 20 : 30,
          offsetCenter: [0, 0],
          formatter: '{value}%',
          color: 'inherit'
        },
        data: [
          {
            value: Math.round(overallScore * 100),
            name: 'Match'
          }
        ]
      }
    ]
  };

  // Radar chart options for dimensions
  const radarOptions = {
    radar: {
      indicator: dimensions.map(dim => ({
        name: dim.name,
        max: 1
      })),
      radius: '70%'
    },
    series: [
      {
        type: 'radar',
        data: [
          {
            value: dimensions.map(dim => dim.score),
            name: 'Compatibility',
            areaStyle: {
              color: 'rgba(64, 158, 255, 0.6)'
            }
          }
        ]
      }
    ]
  };

  // Helper function to determine color based on score
  function getScoreColor(score: number): string {
    if (score >= 0.8) return '#22c55e'; // Green for high match
    if (score >= 0.6) return '#3b82f6'; // Blue for good match
    if (score >= 0.4) return '#f59e0b'; // Yellow for moderate match
    return '#ef4444'; // Red for low match
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex justify-between items-center">
          <span>Compatibility Score</span>
          <span className="text-sm font-normal px-2 py-1 rounded-full" 
                style={{ backgroundColor: getScoreColor(overallScore) + '20', color: getScoreColor(overallScore) }}>
            {Math.round(overallScore * 100)}% Match
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex flex-col items-center">
          <div style={{ height: chartHeight, width: '100%' }}>
            <ReactECharts 
              option={gaugeOptions} 
              style={{ height: '100%', width: '100%' }}
            />
          </div>
          
          {primaryMatchReason && (
            <div className="text-sm text-center mt-2 text-muted-foreground">
              {primaryMatchReason}
            </div>
          )}
          
          {showDetails && dimensions.length > 0 && (
            <div className="mt-4 w-full">
              <h4 className="text-sm font-medium mb-2">Compatibility Dimensions</h4>
              <div style={{ height: 200, width: '100%' }}>
                <ReactECharts 
                  option={radarOptions} 
                  style={{ height: '100%', width: '100%' }}
                />
              </div>
              
              <div className="mt-4 space-y-2">
                {dimensions.map((dim, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-sm">{dim.name}</span>
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full" 
                        style={{ 
                          width: `${Math.round(dim.score * 100)}%`,
                          backgroundColor: getScoreColor(dim.score)
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
