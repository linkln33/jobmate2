"use client";

import React, { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface MonthlyEarningsChartProps {
  data: { month: string; earnings: number }[];
  projectionMonths?: number;
  title?: string;
}

export function MonthlyEarningsChart({ 
  data, 
  projectionMonths = 3, 
  title = "Monthly Earnings" 
}: MonthlyEarningsChartProps) {
  const [chartOptions, setChartOptions] = useState({});

  useEffect(() => {
    // Calculate projected values based on existing data trend
    const calculateProjections = () => {
      if (data.length < 2) return [...data];
      
      const existingData = [...data];
      const projectedData = [...data];
      
      // Calculate average growth rate from the last 3 months (or available data)
      const sampleSize = Math.min(3, existingData.length);
      const recentData = existingData.slice(-sampleSize);
      
      let growthRates = [];
      for (let i = 1; i < recentData.length; i++) {
        const rate = (recentData[i].earnings - recentData[i-1].earnings) / recentData[i-1].earnings;
        growthRates.push(rate);
      }
      
      // Average growth rate
      const avgGrowthRate = growthRates.length > 0 
        ? growthRates.reduce((sum, rate) => sum + rate, 0) / growthRates.length 
        : 0.05; // Default 5% growth if not enough data
      
      // Generate future months
      const lastMonth = existingData[existingData.length - 1];
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      
      let lastMonthIndex = months.indexOf(lastMonth.month);
      let lastAmount = lastMonth.earnings;
      
      for (let i = 1; i <= projectionMonths; i++) {
        lastMonthIndex = (lastMonthIndex + 1) % 12;
        lastAmount = Math.round(lastAmount * (1 + avgGrowthRate));
        
        projectedData.push({
          month: months[lastMonthIndex],
          earnings: lastAmount
        });
      }
      
      return projectedData;
    };
    
    const projectedData = calculateProjections();
    
    // Split data into actual and projected
    const actualMonths = data.map(item => item.month);
    const actualValues = data.map(item => item.earnings);
    
    const projectedMonths = projectedData.map(item => item.month);
    // Make projected values start from the last actual data point to avoid the gap
    const projectedValues = projectedData.map((item, index) => {
      return index < data.length - 1 ? null : item.earnings;
    });
    
    // Create options for ECharts
    const options = {
      tooltip: {
        trigger: 'axis',
        formatter: function(params: any) {
          const dataIndex = params[0].dataIndex;
          const isProjected = dataIndex >= data.length;
          
          let tooltipContent = `<div style="font-weight: bold">${params[0].name}</div>`;
          
          params.forEach((param: any) => {
            if (param.value !== null) {
              tooltipContent += `<div>
                ${param.seriesName}: $${param.value}
                ${isProjected ? ' (Projected)' : ''}
              </div>`;
            }
          });
          
          return tooltipContent;
        }
      },
      legend: {
        data: ['Actual Earnings', 'Projected Earnings'],
        bottom: 0
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '15%',
        top: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: projectedMonths,
        axisLabel: {
          rotate: 45,
          margin: 10
        }
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          formatter: '${value}'
        }
      },
      series: [
        {
          name: 'Actual Earnings',
          type: 'line',
          smooth: true,
          lineStyle: {
            width: 3,
            color: '#3b82f6'
          },
          symbol: 'circle',
          symbolSize: 8,
          data: actualValues,
          itemStyle: {
            color: '#3b82f6'
          },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: 'rgba(59, 130, 246, 0.5)'
                },
                {
                  offset: 1,
                  color: 'rgba(59, 130, 246, 0.05)'
                }
              ]
            }
          }
        },
        {
          name: 'Projected Earnings',
          type: 'line',
          smooth: true,
          lineStyle: {
            width: 3,
            type: 'dashed',
            color: '#10b981'
          },
          symbol: 'circle',
          symbolSize: 8,
          data: projectedValues,
          itemStyle: {
            color: '#10b981'
          },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: 'rgba(16, 185, 129, 0.5)'
                },
                {
                  offset: 1,
                  color: 'rgba(16, 185, 129, 0.05)'
                }
              ]
            }
          }
        }
      ]
    };
    
    setChartOptions(options);
  }, [data, projectionMonths]);

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
