"use client";

import React, { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface MetricData {
  month: string;
  responseTime: number;
  completionRate: number;
  clientSatisfaction: number;
}

interface PerformanceMetricsChartProps {
  data: MetricData[];
  title?: string;
  projectionMonths?: number;
}

export function PerformanceMetricsChart({ 
  data, 
  title = "Performance Metrics", 
  projectionMonths = 2
}: PerformanceMetricsChartProps) {
  const [chartOptions, setChartOptions] = useState({});

  useEffect(() => {
    // Calculate projected values based on existing data trend
    const calculateProjections = () => {
      if (data.length < 2) return [...data];
      
      const existingData = [...data];
      const projectedData = [...existingData];
      
      // Calculate average growth rates for each metric
      const calculateGrowthRate = (metricName: keyof Omit<MetricData, 'month'>) => {
        const rates = [];
        for (let i = 1; i < existingData.length; i++) {
          const rate = (existingData[i][metricName] - existingData[i-1][metricName]) / existingData[i-1][metricName];
          rates.push(rate);
        }
        return rates.length > 0 
          ? rates.reduce((sum, rate) => sum + rate, 0) / rates.length 
          : 0.02; // Default 2% growth
      };
      
      const responseTimeGrowth = calculateGrowthRate('responseTime');
      const completionRateGrowth = calculateGrowthRate('completionRate');
      const satisfactionGrowth = calculateGrowthRate('clientSatisfaction');
      
      // Generate future months
      const lastMonth = existingData[existingData.length - 1].month;
      
      for (let i = 1; i <= projectionMonths; i++) {
        // Generate next month label
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const lastMonthIndex = months.indexOf(lastMonth);
        const newMonthIndex = (lastMonthIndex + i) % 12;
        
        const lastMetrics = projectedData[projectedData.length - 1];
        
        // Calculate new metrics with growth rates
        // For response time, lower is better so we want to decrease it
        const newResponseTime = Math.max(0.5, lastMetrics.responseTime * (1 - responseTimeGrowth));
        // For completion rate and satisfaction, higher is better (max 100%)
        const newCompletionRate = Math.min(100, lastMetrics.completionRate * (1 + completionRateGrowth));
        const newSatisfaction = Math.min(100, lastMetrics.clientSatisfaction * (1 + satisfactionGrowth));
        
        projectedData.push({
          month: months[newMonthIndex],
          responseTime: parseFloat(newResponseTime.toFixed(1)),
          completionRate: parseFloat(newCompletionRate.toFixed(1)),
          clientSatisfaction: parseFloat(newSatisfaction.toFixed(1))
        });
      }
      
      return projectedData;
    };
    
    const projectedData = calculateProjections();
    
    // Split data into actual and projected
    const actualMonths = data.map(item => item.month);
    const actualResponseTimes = data.map(item => item.responseTime);
    const actualCompletionRates = data.map(item => item.completionRate);
    const actualSatisfaction = data.map(item => item.clientSatisfaction);
    
    const allMonths = projectedData.map(item => item.month);
    
    // Create projected data arrays with nulls for actual dates
    // Start from the last actual data point to avoid gaps
    const projectedResponseTimes = projectedData.map((item, index) => 
      index < data.length - 1 ? null : item.responseTime
    );
    
    const projectedCompletionRates = projectedData.map((item, index) => 
      index < data.length - 1 ? null : item.completionRate
    );
    
    const projectedSatisfaction = projectedData.map((item, index) => 
      index < data.length - 1 ? null : item.clientSatisfaction
    );
    
    // Create options for ECharts
    const options = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross'
        }
      },
      legend: {
        data: [
          'Response Time (hours)', 
          'Completion Rate (%)', 
          'Client Satisfaction (%)',
          'Projected Response Time',
          'Projected Completion Rate',
          'Projected Satisfaction'
        ],
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
        boundaryGap: false,
        data: allMonths,
        axisLabel: {
          rotate: 45,
          margin: 10
        }
      },
      yAxis: [
        {
          type: 'value',
          name: 'Hours',
          position: 'left',
          axisLine: {
            show: true,
            lineStyle: {
              color: '#ff7e67'
            }
          },
          axisLabel: {
            formatter: '{value} h'
          }
        },
        {
          type: 'value',
          name: 'Percentage',
          min: 0,
          max: 100,
          position: 'right',
          axisLine: {
            show: true,
            lineStyle: {
              color: '#3b82f6'
            }
          },
          axisLabel: {
            formatter: '{value}%'
          }
        }
      ],
      series: [
        {
          name: 'Response Time (hours)',
          type: 'line',
          yAxisIndex: 0,
          data: actualResponseTimes,
          symbol: 'circle',
          symbolSize: 8,
          itemStyle: {
            color: '#ff7e67'
          },
          lineStyle: {
            width: 3,
            color: '#ff7e67'
          }
        },
        {
          name: 'Projected Response Time',
          type: 'line',
          yAxisIndex: 0,
          data: projectedResponseTimes,
          symbol: 'circle',
          symbolSize: 8,
          itemStyle: {
            color: '#ff7e67'
          },
          lineStyle: {
            width: 3,
            type: 'dashed',
            color: '#ff7e67'
          }
        },
        {
          name: 'Completion Rate (%)',
          type: 'line',
          yAxisIndex: 1,
          data: actualCompletionRates,
          symbol: 'circle',
          symbolSize: 8,
          itemStyle: {
            color: '#3b82f6'
          },
          lineStyle: {
            width: 3,
            color: '#3b82f6'
          }
        },
        {
          name: 'Projected Completion Rate',
          type: 'line',
          yAxisIndex: 1,
          data: projectedCompletionRates,
          symbol: 'circle',
          symbolSize: 8,
          itemStyle: {
            color: '#3b82f6'
          },
          lineStyle: {
            width: 3,
            type: 'dashed',
            color: '#3b82f6'
          }
        },
        {
          name: 'Client Satisfaction (%)',
          type: 'line',
          yAxisIndex: 1,
          data: actualSatisfaction,
          symbol: 'circle',
          symbolSize: 8,
          itemStyle: {
            color: '#10b981'
          },
          lineStyle: {
            width: 3,
            color: '#10b981'
          }
        },
        {
          name: 'Projected Satisfaction',
          type: 'line',
          yAxisIndex: 1,
          data: projectedSatisfaction,
          symbol: 'circle',
          symbolSize: 8,
          itemStyle: {
            color: '#10b981'
          },
          lineStyle: {
            width: 3,
            type: 'dashed',
            color: '#10b981'
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
