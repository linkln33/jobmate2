"use client";

import React, { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import * as echarts from 'echarts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface WeeklyJobsChartProps {
  data: { day: string; jobs: number }[];
  title?: string;
  showProjection?: boolean;
}

export function WeeklyJobsChart({ 
  data, 
  title = "Weekly Job Distribution", 
  showProjection = true 
}: WeeklyJobsChartProps) {
  const [chartOptions, setChartOptions] = useState({});

  useEffect(() => {
    // Calculate average and projected values
    const calculateProjections = () => {
      // Calculate average jobs per day
      const totalJobs = data.reduce((sum, item) => sum + item.jobs, 0);
      const avgJobs = totalJobs / data.length;
      
      // Calculate trend (simple linear regression)
      let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;
      data.forEach((item, index) => {
        sumX += index;
        sumY += item.jobs;
        sumXY += index * item.jobs;
        sumX2 += index * index;
      });
      
      const n = data.length;
      const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
      const intercept = (sumY - slope * sumX) / n;
      
      // Generate projected values (next week)
      const projectedData = [];
      for (let i = 0; i < data.length; i++) {
        const projectedValue = Math.max(0, Math.round(intercept + slope * (i + data.length)));
        projectedData.push(projectedValue);
      }
      
      return {
        average: Array(data.length).fill(Math.round(avgJobs)),
        projected: projectedData
      };
    };
    
    const { average, projected } = calculateProjections();
    
    // Create options for ECharts
    const options = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        },
        formatter: function(params: any) {
          let tooltipContent = `<div style="font-weight: bold">${params[0].name}</div>`;
          
          params.forEach((param: any) => {
            if (param.seriesName !== 'Average' || param.dataIndex === 0) {
              tooltipContent += `<div style="display: flex; align-items: center;">
                <span style="display: inline-block; width: 10px; height: 10px; background: ${param.color}; border-radius: 50%; margin-right: 5px;"></span>
                <span>${param.seriesName}: ${param.value} jobs</span>
              </div>`;
            }
          });
          
          return tooltipContent;
        }
      },
      legend: {
        data: ['Current Week', 'Average', ...(showProjection ? ['Projected Next Week'] : [])],
        bottom: 0
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '15%',
        top: '8%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: data.map(item => item.day)
      },
      yAxis: {
        type: 'value',
        name: 'Number of Jobs',
        minInterval: 1
      },
      series: [
        {
          name: 'Current Week',
          type: 'bar',
          data: data.map(item => item.jobs),
          itemStyle: {
            color: '#3b82f6',
            borderRadius: [4, 4, 0, 0]
          },
          emphasis: {
            itemStyle: {
              color: '#2563eb'
            }
          },
          barWidth: '40%'
        },
        {
          name: 'Average',
          type: 'line',
          data: average,
          symbol: 'none',
          lineStyle: {
            type: 'dashed',
            color: '#6b7280'
          },
          itemStyle: {
            color: '#6b7280'
          }
        },
        ...(showProjection ? [{
          name: 'Projected Next Week',
          type: 'bar',
          data: data.map((_, index) => ({
            value: projected[index],
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: 'rgba(16, 185, 129, 0.8)' },
                { offset: 1, color: 'rgba(16, 185, 129, 0.3)' }
              ]),
              borderRadius: [4, 4, 0, 0]
            }
          })),
          barGap: '-100%',
          z: -1,
          barWidth: '40%'
        }] : [])
      ]
    };
    
    setChartOptions(options);
  }, [data, showProjection]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-medium">{title}</CardTitle>
      </CardHeader>
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
