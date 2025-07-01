/**
 * Chart components for the waitlist dashboard using ECharts
 */
import React from 'react';
import ReactECharts from 'echarts-for-react';
import * as echarts from 'echarts';
import { motion } from 'framer-motion';

interface ReferralChartProps {
  data: {
    name: string;
    referrals: number;
    points: number;
  }[];
}

export const ReferralBarChart: React.FC<ReferralChartProps> = ({ data }) => {
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: [
      {
        type: 'category',
        data: data.map(item => item.name),
        axisTick: {
          alignWithLabel: true
        },
        axisLabel: {
          color: 'rgba(255, 255, 255, 0.7)'
        },
        axisLine: {
          lineStyle: {
            color: 'rgba(255, 255, 255, 0.3)'
          }
        }
      }
    ],
    yAxis: [
      {
        type: 'value',
        axisLabel: {
          color: 'rgba(255, 255, 255, 0.7)'
        },
        axisLine: {
          lineStyle: {
            color: 'rgba(255, 255, 255, 0.3)'
          }
        },
        splitLine: {
          lineStyle: {
            color: 'rgba(255, 255, 255, 0.1)'
          }
        }
      }
    ],
    series: [
      {
        name: 'Referrals',
        type: 'bar',
        barWidth: '60%',
        data: data.map(item => item.referrals),
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#8364e2' },
            { offset: 1, color: '#5c4ba9' }
          ])
        }
      }
    ]
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="w-full h-full"
    >
      <ReactECharts option={option} style={{ height: '100%', width: '100%' }} />
    </motion.div>
  );
};

interface PointsChartProps {
  data: {
    name: string;
    points: number;
  }[];
}

export const PointsPieChart: React.FC<PointsChartProps> = ({ data }) => {
  const option = {
    tooltip: {
      trigger: 'item'
    },
    legend: {
      top: '5%',
      left: 'center',
      textStyle: {
        color: 'rgba(255, 255, 255, 0.7)'
      }
    },
    series: [
      {
        name: 'Points',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: 'rgba(0, 0, 0, 0.1)',
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
            fontWeight: 'bold',
            color: 'rgba(255, 255, 255, 0.9)'
          }
        },
        labelLine: {
          show: false
        },
        data: data.map(item => ({
          value: item.points,
          name: item.name
        }))
      }
    ]
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="w-full h-full"
    >
      <ReactECharts option={option} style={{ height: '100%', width: '100%' }} />
    </motion.div>
  );
};

interface GrowthChartProps {
  data: {
    date: string;
    users: number;
  }[];
}

export const GrowthLineChart: React.FC<GrowthChartProps> = ({ data }) => {
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: '#6a7985'
        }
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: [
      {
        type: 'category',
        boundaryGap: false,
        data: data.map(item => item.date),
        axisLabel: {
          color: 'rgba(255, 255, 255, 0.7)'
        },
        axisLine: {
          lineStyle: {
            color: 'rgba(255, 255, 255, 0.3)'
          }
        }
      }
    ],
    yAxis: [
      {
        type: 'value',
        axisLabel: {
          color: 'rgba(255, 255, 255, 0.7)'
        },
        axisLine: {
          lineStyle: {
            color: 'rgba(255, 255, 255, 0.3)'
          }
        },
        splitLine: {
          lineStyle: {
            color: 'rgba(255, 255, 255, 0.1)'
          }
        }
      }
    ],
    series: [
      {
        name: 'Users',
        type: 'line',
        stack: 'Total',
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: 'rgba(128, 108, 245, 0.8)'
            },
            {
              offset: 1,
              color: 'rgba(128, 108, 245, 0.1)'
            }
          ])
        },
        emphasis: {
          focus: 'series'
        },
        lineStyle: {
          width: 3,
          color: '#806cf5'
        },
        symbol: 'circle',
        symbolSize: 8,
        data: data.map(item => item.users)
      }
    ]
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.3 }}
      className="w-full h-full"
    >
      <ReactECharts option={option} style={{ height: '100%', width: '100%' }} />
    </motion.div>
  );
};

interface LeaderboardChartProps {
  data: {
    name: string;
    points: number;
    rank: number;
  }[];
}

export const LeaderboardChart: React.FC<LeaderboardChartProps> = ({ data }) => {
  // Sort data by points in descending order
  const sortedData = [...data].sort((a, b) => b.points - a.points);
  
  return (
    <div className="w-full">
      {sortedData.map((item, index) => (
        <motion.div
          key={item.name}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 * index }}
          className="flex items-center mb-4"
        >
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold mr-3">
            {item.rank}
          </div>
          <div className="flex-1">
            <div className="flex justify-between mb-1">
              <span className="font-medium">{item.name}</span>
              <span className="font-bold">{item.points} pts</span>
            </div>
            <div className="w-full bg-gray-200 bg-opacity-20 rounded-full h-2.5">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(item.points / sortedData[0].points) * 100}%` }}
                transition={{ duration: 0.8, delay: 0.1 * index + 0.3 }}
                className="h-2.5 rounded-full bg-gradient-to-r from-purple-500 to-blue-500"
              />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};
