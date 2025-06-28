"use client";

import React, { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import * as echarts from 'echarts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface RevenueForecastChartProps {
  data: { month: string; revenue: number; expenses: number; profit: number }[];
  forecastPeriods?: number;
  title?: string;
}

export function RevenueForecastChart({ 
  data, 
  forecastPeriods = 3, 
  title = "Revenue Forecast" 
}: RevenueForecastChartProps) {
  const [chartOptions, setChartOptions] = useState({});

  useEffect(() => {
    // Calculate projections based on existing data
    const calculateProjections = () => {
      if (data.length < 2) return [...data];
      
      const existingData = [...data];
      const projectedData = [...existingData];
      
      // Calculate average growth rates for revenue and expenses
      const calculateGrowthRate = (metricName: keyof Omit<typeof data[0], 'month'>) => {
        const rates = [];
        for (let i = 1; i < existingData.length; i++) {
          const rate = (existingData[i][metricName] - existingData[i-1][metricName]) / existingData[i-1][metricName];
          rates.push(rate);
        }
        return rates.length > 0 
          ? rates.reduce((sum, rate) => sum + rate, 0) / rates.length 
          : 0.05; // Default 5% growth
      };
      
      const revenueGrowth = calculateGrowthRate('revenue');
      const expensesGrowth = calculateGrowthRate('expenses');
      const profitGrowth = calculateGrowthRate('profit');
      
      // Generate future months
      const lastMonth = existingData[existingData.length - 1];
      
      // Define months array
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const lastMonthIndex = months.indexOf(lastMonth.month.split(' ')[0]);
      const currentYear = parseInt(lastMonth.month.split(' ')[1] || new Date().getFullYear().toString());
      
      for (let i = 1; i <= forecastPeriods; i++) {
        // Calculate new month index and year
        const newMonthIndex = (lastMonthIndex + i) % 12;
        const yearIncrement = Math.floor((lastMonthIndex + i) / 12);
        const newMonth = `${months[newMonthIndex]} ${currentYear + yearIncrement}`;
        
        const lastMetrics = projectedData[projectedData.length - 1];
        
        // Calculate new metrics with growth rates
        const newRevenue = Math.round(lastMetrics.revenue * (1 + revenueGrowth));
        const newExpenses = Math.round(lastMetrics.expenses * (1 + expensesGrowth));
        const newProfit = Math.round(lastMetrics.profit * (1 + profitGrowth));
        
        projectedData.push({
          month: newMonth,
          revenue: newRevenue,
          expenses: newExpenses,
          profit: newProfit
        });
      }
      
      return projectedData;
    };
    
    const projectedData = calculateProjections();
    
    // Split data into actual and projected
    const allMonths = projectedData.map(item => item.month);
    
    const actualRevenue = data.map(item => item.revenue);
    const actualExpenses = data.map(item => item.expenses);
    const actualProfit = data.map(item => item.revenue - item.expenses);
    
    // Create projected data arrays with nulls for actual periods
    // Start from the last actual data point to avoid gaps
    const projectedRevenue = projectedData.map((item, index) => 
      index < data.length - 1 ? null : item.revenue
    );
    
    const projectedExpenses = projectedData.map((item, index) => 
      index < data.length - 1 ? null : item.expenses
    );
    
    const projectedProfit = projectedData.map((item, index) => 
      index < data.length - 1 ? null : item.revenue - item.expenses
    );
    
    // Create options for ECharts
    const options = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        },
        formatter: function(params: any) {
          const dataIndex = params[0].dataIndex;
          const isProjected = dataIndex >= data.length;
          
          let tooltipContent = `<div style="font-weight: bold">${params[0].name} ${isProjected ? '(Projected)' : ''}</div>`;
          
          let revenue = null;
          let expenses = null;
          
          params.forEach((param: any) => {
            if (param.seriesName.includes('Revenue')) {
              revenue = param.value;
            } else if (param.seriesName.includes('Expenses')) {
              expenses = param.value;
            }
            
            if (param.value !== null) {
              tooltipContent += `<div style="display: flex; align-items: center;">
                <span style="display: inline-block; width: 10px; height: 10px; background: ${param.color}; border-radius: 50%; margin-right: 5px;"></span>
                <span>${param.seriesName}: $${param.value}</span>
              </div>`;
            }
          });
          
          // Add profit calculation if we have both revenue and expenses
          if (revenue !== null && expenses !== null) {
            const profit = revenue - expenses;
            tooltipContent += `<div style="display: flex; align-items: center; margin-top: 5px;">
              <span style="display: inline-block; width: 10px; height: 10px; background: #10b981; border-radius: 50%; margin-right: 5px;"></span>
              <span>Profit: $${profit}</span>
            </div>`;
          }
          
          return tooltipContent;
        }
      },
      legend: {
        data: ['Revenue', 'Expenses', 'Profit', 'Projected Revenue', 'Projected Expenses', 'Projected Profit'],
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
        data: allMonths,
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
          name: 'Revenue',
          type: 'bar',
          stack: 'actual',
          emphasis: {
            focus: 'series'
          },
          data: actualRevenue,
          itemStyle: {
            color: '#3b82f6'
          },
          barWidth: '30%'
        },
        {
          name: 'Expenses',
          type: 'bar',
          stack: 'actual',
          emphasis: {
            focus: 'series'
          },
          data: actualExpenses,
          itemStyle: {
            color: '#ef4444'
          },
          barWidth: '30%'
        },
        {
          name: 'Profit',
          type: 'line',
          emphasis: {
            focus: 'series'
          },
          data: actualProfit,
          symbolSize: 10,
          lineStyle: {
            width: 3,
            color: '#10b981'
          },
          itemStyle: {
            color: '#10b981'
          }
        },
        {
          name: 'Projected Revenue',
          type: 'bar',
          stack: 'projected',
          emphasis: {
            focus: 'series'
          },
          data: projectedRevenue,
          itemStyle: {
            color: 'rgba(59, 130, 246, 0.5)',
            borderType: 'dashed',
            borderWidth: 2,
            borderColor: '#3b82f6'
          },
          barWidth: '30%'
        },
        {
          name: 'Projected Expenses',
          type: 'bar',
          stack: 'projected',
          emphasis: {
            focus: 'series'
          },
          data: projectedExpenses,
          itemStyle: {
            color: 'rgba(239, 68, 68, 0.5)',
            borderType: 'dashed',
            borderWidth: 2,
            borderColor: '#ef4444'
          },
          barWidth: '30%'
        },
        {
          name: 'Projected Profit',
          type: 'line',
          emphasis: {
            focus: 'series'
          },
          data: projectedProfit,
          symbolSize: 10,
          lineStyle: {
            width: 3,
            type: 'dashed',
            color: '#10b981'
          },
          itemStyle: {
            color: '#10b981'
          }
        }
      ]
    };
    
    setChartOptions(options);
  }, [data, forecastPeriods]);

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
