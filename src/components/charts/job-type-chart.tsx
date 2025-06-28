"use client";

import React, { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface JobTypeChartProps {
  data: { type: string; value: number }[];
  title?: string;
}

export function JobTypeChart({ 
  data, 
  title = "" 
}: JobTypeChartProps) {
  const [chartOptions, setChartOptions] = useState({});

  useEffect(() => {
    // Create options for ECharts
    const options = {
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {c} jobs ({d}%)'
      },
      legend: {
        orient: 'vertical',
        right: 10,
        top: 'center',
        data: data.map(item => item.type)
      },
      series: [
        {
          name: 'Job Types',
          type: 'pie',
          radius: ['40%', '70%'],
          center: ['40%', '50%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2
          },
          label: {
            show: false,
            position: 'center'
          },
          emphasis: {
            label: {
              show: true,
              fontSize: '18',
              fontWeight: 'bold'
            }
          },
          labelLine: {
            show: false
          },
          data: data.map(item => ({
            value: item.value,
            name: item.type
          })),
          // Custom color palette
          color: [
            '#3b82f6', // blue
            '#10b981', // green
            '#f59e0b', // amber
            '#8b5cf6', // purple
            '#ec4899', // pink
            '#ef4444', // red
            '#06b6d4', // cyan
            '#14b8a6', // teal
          ]
        }
      ]
    };
    
    setChartOptions(options);
  }, [data]);

  return (
    <Card>
      {title && (
        <CardHeader>
          <CardTitle className="text-lg font-medium">{title}</CardTitle>
        </CardHeader>
      )}
      <CardContent>
        <div className="h-80">
          <ReactECharts 
            option={chartOptions} 
            style={{ height: '100%', width: '100%' }}
            opts={{ renderer: 'canvas' }}
          />
        </div>
      </CardContent>
    </Card>
  );
}
