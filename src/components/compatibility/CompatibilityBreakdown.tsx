import React from 'react';
import { motion } from 'framer-motion';
import { CompatibilityResult, CompatibilityDimension } from '@/types/compatibility';
import { Chart } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

interface CompatibilityBreakdownProps {
  result: CompatibilityResult;
  showSuggestions?: boolean;
  className?: string;
}

export const CompatibilityBreakdown: React.FC<CompatibilityBreakdownProps> = ({
  result,
  showSuggestions = true,
  className = ''
}) => {
  // Prepare data for radar chart
  const radarData = {
    labels: result.dimensions.map(dim => dim.name),
    datasets: [
      {
        label: 'Compatibility Score',
        data: result.dimensions.map(dim => dim.score),
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(54, 162, 235, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(54, 162, 235, 1)'
      }
    ]
  };

  // Chart options
  const radarOptions = {
    scales: {
      r: {
        angleLines: {
          display: true
        },
        suggestedMin: 0,
        suggestedMax: 100
      }
    },
    plugins: {
      legend: {
        display: false
      }
    }
  };

  // Get color based on score
  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-emerald-500';
    if (score >= 70) return 'text-blue-500';
    if (score >= 50) return 'text-amber-500';
    return 'text-red-500';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 ${className}`}
    >
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold mb-1">Compatibility Analysis</h3>
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            {result.primaryMatchReason}
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center">
          <span className="text-3xl font-bold mr-2 ${getScoreColor(result.overallScore)}">
            {result.overallScore}%
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400">match</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Radar Chart */}
        <div className="h-64">
          <Chart type="radar" data={radarData} options={radarOptions} />
        </div>

        {/* Dimensions Breakdown */}
        <div className="space-y-4">
          {result.dimensions.map((dimension, index) => (
            <DimensionItem key={index} dimension={dimension} />
          ))}
        </div>
      </div>

      {/* Improvement Suggestions */}
      {showSuggestions && result.improvementSuggestions.length > 0 && (
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <h4 className="font-semibold mb-3">Suggestions to Improve Match</h4>
          <ul className="space-y-2">
            {result.improvementSuggestions.map((suggestion, index) => (
              <li key={index} className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span className="text-sm">{suggestion}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </motion.div>
  );
};

// Helper component for individual dimension items
const DimensionItem: React.FC<{ dimension: CompatibilityDimension }> = ({ dimension }) => {
  const getScoreColor = (score: number) => {
    if (score >= 85) return 'bg-emerald-500';
    if (score >= 70) return 'bg-blue-500';
    if (score >= 50) return 'bg-amber-500';
    return 'bg-red-500';
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-medium">{dimension.name}</span>
        <span className="text-sm font-semibold">{dimension.score}%</span>
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
        <div
          className={`h-2 rounded-full ${getScoreColor(dimension.score)}`}
          style={{ width: `${dimension.score}%` }}
        ></div>
      </div>
      {dimension.description && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{dimension.description}</p>
      )}
    </div>
  );
};

export default CompatibilityBreakdown;
