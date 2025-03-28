'use client';

import { useEffect, useState } from 'react';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title, 
  Tooltip, 
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

// Initialize ChartJS within the component
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface RatingChange {
  contestId?: string;
  contestName?: string;
  handle?: string;
  rank?: number;
  ratingUpdateTimeSeconds?: number;
  oldRating?: number;
  newRating?: number;
}

interface ChartComponentProps {
  ratingHistory: RatingChange[];
}

// Rating band colors from Codeforces
const RATING_BANDS = [
  { min: -Infinity, max: 1200, color: 'rgba(204, 204, 204, 0.6)' },  // Gray
  { min: 1200, max: 1400, color: 'rgba(119, 255, 119, 0.6)' },      // Green
  { min: 1400, max: 1600, color: 'rgba(119, 221, 187, 0.6)' },      // Cyan
  { min: 1600, max: 1900, color: 'rgba(170, 170, 255, 0.6)' },      // Blue
  { min: 1900, max: 2100, color: 'rgba(255, 136, 255, 0.6)' },      // Purple
  { min: 2100, max: 2400, color: 'rgba(255, 204, 136, 0.6)' },      // Orange
  { min: 2400, max: Infinity, color: 'rgba(255, 136, 136, 0.6)' }   // Red
];

export function ChartComponent({ ratingHistory }: ChartComponentProps) {
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted || !ratingHistory || ratingHistory.length === 0) {
    return (
      <div className="h-full w-full bg-white rounded-lg shadow-inner flex items-center justify-center">
        <p className="text-gray-500">No rating data available</p>
      </div>
    );
  }

  // Sort the history by timestamp
  const sortedHistory = [...ratingHistory].sort((a, b) => 
    ((a.ratingUpdateTimeSeconds || 0) - (b.ratingUpdateTimeSeconds || 0))
  );

  // Format data for chart
  const labels = sortedHistory.map(entry => {
    const timestamp = entry.ratingUpdateTimeSeconds || 0;
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric'
    });
  });

  const ratings = sortedHistory.map(entry => entry.newRating || 0);
  const minRating = Math.floor((Math.min(...ratings) - 200) / 100) * 100;
  const maxRating = Math.ceil((Math.max(...ratings) + 200) / 100) * 100;

  const data = {
    labels,
    datasets: [
      {
        label: 'Rating',
        data: ratings,
        borderColor: '#FFA000',
        backgroundColor: 'rgba(255, 160, 0, 0.1)',
        tension: 0.2,
        pointRadius: 7,
        pointHoverRadius: 9,
        pointBackgroundColor: '#FFFFFF',
        pointBorderColor: '#FFA000',
        pointBorderWidth: 2.5,
        borderWidth: 3,
        fill: true
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 750,
      easing: 'easeInOutCubic' as const
    },
    interaction: {
      intersect: false,
      mode: 'index' as const
    },
    layout: {
      padding: {
        top: 10,
        right: 15,
        bottom: 10,
        left: 15
      }
    },
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(30, 41, 59, 0.95)',
        titleColor: '#fff',
        bodyColor: '#fff',
        padding: 12,
        cornerRadius: 4,
        titleFont: {
          size: 14,
          weight: 'bold' as const
        },
        bodyFont: {
          size: 13
        },
        callbacks: {
          title: function(tooltipItems: any) {
            const index = tooltipItems[0].dataIndex;
            return sortedHistory[index].contestName;
          },
          label: function(context: any) {
            const index = context.dataIndex;
            const rating = sortedHistory[index].newRating;
            const oldRating = sortedHistory[index].oldRating;
            const change = rating && oldRating ? rating - oldRating : 0;
            const sign = change >= 0 ? '+' : '';
            const date = new Date((sortedHistory[index].ratingUpdateTimeSeconds || 0) * 1000);
            return [
              `Date: ${date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`,
              `Rating: ${rating} (${sign}${change})`,
              `Rank: ${sortedHistory[index].rank || 'N/A'}`
            ];
          }
        }
      }
    },
    scales: {
      y: {
        type: 'linear' as const,
        min: minRating,
        max: maxRating,
        grid: {
          drawBorder: true,
          color: function(context: any) {
            const value = context.tick.value;
            if ([1200, 1400, 1600, 1900, 2100, 2400].includes(value)) {
              return 'rgba(0, 0, 0, 0.15)';
            }
            return 'rgba(0, 0, 0, 0.06)';
          },
          lineWidth: function(context: any) {
            const value = context.tick.value;
            if ([1200, 1400, 1600, 1900, 2100, 2400].includes(value)) {
              return 2;
            }
            return 1;
          }
        },
        ticks: {
          stepSize: 100,
          color: '#333',
          font: {
            size: 13,
            weight: 'bold' as const
          },
          padding: 10
        },
        afterDraw: (chart: any) => {
          const ctx = chart.ctx;
          const yAxis = chart.scales.y;
          const xAxis = chart.scales.x;
          
          // Draw rating band backgrounds
          RATING_BANDS.forEach(band => {
            const yTop = yAxis.getPixelForValue(Math.min(band.max, maxRating));
            const yBottom = yAxis.getPixelForValue(Math.max(band.min, minRating));
            
            ctx.fillStyle = band.color;
            ctx.fillRect(
              xAxis.left,
              yTop,
              xAxis.width,
              yBottom - yTop
            );
          });
        }
      },
      x: {
        type: 'category' as const,
        grid: {
          display: true,
          drawBorder: true,
          color: 'rgba(0, 0, 0, 0.06)',
          lineWidth: 1
        },
        ticks: {
          maxRotation: 45,
          minRotation: 45,
          autoSkip: true,
          maxTicksLimit: 15,
          color: '#333',
          font: {
            size: 13,
            weight: 'bold' as const
          },
          padding: 10
        }
      }
    }
  };

  return (
    <div className="relative h-full w-full bg-white p-2 rounded-lg shadow-inner">
      <div className="absolute top-2 left-3 text-xs text-gray-500">
        
      </div>
      <Line data={data} options={options} className="mt-2" />
    </div>
  );
} 
