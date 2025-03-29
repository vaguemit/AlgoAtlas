'use client';

import { useState, useEffect, useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
  ChartData
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { getRatingColor } from '../../lib/codeforces-utils';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Interface for rating history points
export interface RatingHistoryPoint {
  contestId: number;
  contestName: string;
  rank: number;
  ratingUpdateTimeSeconds: number;
  oldRating: number;
  newRating: number;
}

// Component props
interface ChartComponentProps {
  ratingHistory: RatingHistoryPoint[];
}

// Export the chart component
export function ChartComponent({ ratingHistory }: ChartComponentProps) {
  const chartRef = useRef<ChartJS<'line'>>(null);
  const [tooltipData, setTooltipData] = useState<RatingHistoryPoint | null>(null);
  
  // Process dates and ratings for the chart
  const dates = ratingHistory.map(item => {
    const date = new Date(item.ratingUpdateTimeSeconds * 1000);
    return `${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
  });
  
  const ratings = ratingHistory.map(item => item.newRating);
  
  // Get color for the current rating
  const currentRating = ratings[ratings.length - 1] || 0;
  const ratingColor = getRatingColor(currentRating);
  
  // Chart data
  const data: ChartData<'line'> = {
    labels: dates,
    datasets: [
      {
        label: 'Rating',
        data: ratings,
        borderColor: ratingColor,
        backgroundColor: `${ratingColor}33`, // Add transparency
        borderWidth: 2,
        fill: true,
        tension: 0.1,
        pointBackgroundColor: ratings.map(rating => getRatingColor(rating)),
        pointBorderColor: 'rgba(255, 255, 255, 0.8)',
        pointBorderWidth: 1,
        pointRadius: 4,
        pointHoverRadius: 6,
      }
    ]
  };
  
  // Chart options
  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: ratingColor,
        borderWidth: 1,
        padding: 10,
        displayColors: false,
        callbacks: {
          title: (tooltipItems) => {
            const idx = tooltipItems[0].dataIndex;
            return ratingHistory[idx].contestName;
          },
          label: (tooltipItem) => {
            const idx = tooltipItem.dataIndex;
            const item = ratingHistory[idx];
            const ratingChange = item.newRating - item.oldRating;
            const sign = ratingChange >= 0 ? '+' : '';
            
            setTooltipData(item);
            
            return [
              `Rating: ${item.newRating}`,
              `Change: ${sign}${ratingChange}`,
              `Rank: ${item.rank}`,
            ];
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.05)',
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)',
          font: {
            size: 10,
          },
          maxRotation: 45,
          minRotation: 45,
        },
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.05)',
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)',
          font: {
            size: 10,
          },
        },
      },
    },
    animation: {
      duration: 1000,
    },
  };
  
  return (
    <div className="h-full w-full">
      <Line ref={chartRef} data={data} options={options} />
    </div>
  );
} 