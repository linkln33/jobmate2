"use client";

import React, { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import * as echarts from 'echarts';
import { EChartsOption } from 'echarts';

interface GrowthChartProps {
  data?: {
    date: string;
    users: number;
  }[];
  height?: string;
  className?: string;
}

export const WaitlistGrowthChart: React.FC<GrowthChartProps> = ({ 
  data = [], 
  height = '300px',
  className = ''
}) => {
  const [chartOptions, setChartOptions] = useState<EChartsOption>({});
  const [isClient, setIsClient] = useState(false);
  const [mockData, setMockData] = useState<{date: string; users: number}[]>([]);

  // Generate mock data if no data is provided - only once
  useEffect(() => {
    if (data.length === 0 && mockData.length === 0) {
      const generateMockData = () => {
        const mockDataArray = [];
        const today = new Date();
        const startDate = new Date();
        startDate.setDate(today.getDate() - 30); // 30 days ago
        
        let userCount = 50; // Starting user count
        
        for (let i = 0; i <= 30; i++) {
          const currentDate = new Date(startDate);
          currentDate.setDate(startDate.getDate() + i);
          
          // Generate growth with a consistent seed
          // Using the date as part of the seed for deterministic but varied growth
          const dateValue = currentDate.getDate();
          const randomGrowth = 5 + ((dateValue * 7) % 15);
          userCount += randomGrowth;
          
          mockDataArray.push({
            date: currentDate.toISOString().split('T')[0],
            users: userCount
          });
        }
        
        return mockDataArray;
      };
      
      setMockData(generateMockData());
    }
  }, [data.length]);

  useEffect(() => {
    setIsClient(true);
    
    // Only update chart options when data or mockData changes
    if (!isClient || (data.length === 0 && mockData.length === 0)) return;
    
    const chartData = data.length > 0 ? data : mockData;
    
    const option: EChartsOption = {
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        borderColor: 'rgba(255, 255, 255, 0.3)',
        textStyle: {
          color: '#fff'
        },
        formatter: function(params: any) {
          const dataIndex = params[0].dataIndex;
          return `
            <div style="padding: 4px 8px;">
              <div style="font-weight: bold; margin-bottom: 4px;">${chartData[dataIndex].date}</div>
              <div>Users: <span style="font-weight: bold; color: #7DD3FC;">${chartData[dataIndex].users}</span></div>
              ${dataIndex > 0 ? 
                `<div>Growth: <span style="font-weight: bold; color: #86EFAC;">+${chartData[dataIndex].users - chartData[dataIndex-1].users}</span></div>` 
                : ''}
            </div>
          `;
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        top: '8%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: chartData.map(item => item.date),
        axisLine: {
          lineStyle: {
            color: '#94a3b8' // slate-400
          }
        },
        axisLabel: {
          color: '#94a3b8',
          formatter: function(value: string) {
            // Format date to show only month and day
            const date = new Date(value);
            return `${date.getMonth() + 1}/${date.getDate()}`;
          }
        }
      },
      yAxis: {
        type: 'value',
        axisLine: {
          lineStyle: {
            color: '#94a3b8' // slate-400
          }
        },
        axisLabel: {
          color: '#94a3b8'
        },
        splitLine: {
          lineStyle: {
            color: 'rgba(148, 163, 184, 0.2)' // slate-400 with opacity
          }
        }
      },
      series: [
        {
          name: 'Users',
          type: 'line',
          smooth: true,
          symbol: 'circle',
          symbolSize: 8,
          sampling: 'average',
          itemStyle: {
            color: '#3B82F6' // blue-500
          },
          lineStyle: {
            width: 3,
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: '#3B82F6' }, // blue-500
              { offset: 1, color: '#8B5CF6' }  // violet-500
            ])
          },
          areaStyle: {
            opacity: 0.5,
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(59, 130, 246, 0.5)' }, // blue-500 with opacity
              { offset: 0.5, color: 'rgba(139, 92, 246, 0.3)' }, // violet-500 with opacity
              { offset: 1, color: 'rgba(236, 72, 153, 0.1)' }  // pink-500 with opacity
            ])
          },
          data: chartData.map(item => item.users)
        }
      ]
    };
    
    setChartOptions(option);
  }, [data, mockData, isClient]);

  if (!isClient) {
    return <div className={`h-${height} w-full bg-gray-100 dark:bg-gray-800 animate-pulse rounded-lg`}></div>;
  }

  return (
    <div className={`${className} rounded-lg overflow-hidden`}>
      <ReactECharts
        option={chartOptions}
        style={{ height, width: '100%' }}
        className="bg-white dark:bg-gray-800 rounded-lg"
      />
    </div>
  );
};
