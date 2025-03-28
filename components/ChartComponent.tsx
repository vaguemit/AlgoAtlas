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
  Legend 
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
  Legend
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

export function ChartComponent({ ratingHistory }: ChartComponentProps) {
  // Make sure the component is rendered only on client side
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted || !ratingHistory || ratingHistory.length === 0) {
    return <div className="h-64 w-full bg-navy-800/50 rounded-lg flex items-center justify-center">No rating data available</div>;
  }

  // Format data for chart
  const labels = ratingHistory.map(entry => {
    // Format the contest name to be shorter for display
    const contestName = entry.contestName || '';
    return contestName.length > 20 ? contestName.substring(0, 20) + '...' : contestName;
  });

  const data = {
    labels,
    datasets: [
      {
        label: 'Rating',
        data: ratingHistory.map(entry => entry.newRating),
        borderColor: 'rgb(126, 34, 206)', // Purple-700
        backgroundColor: 'rgba(126, 34, 206, 0.5)',
        tension: 0.2
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const index = context.dataIndex;
            const rating = ratingHistory[index].newRating;
            const oldRating = ratingHistory[index].oldRating;
            const change = rating && oldRating ? rating - oldRating : 0;
            const sign = change >= 0 ? '+' : '';
            return `Rating: ${rating} (${sign}${change})`;
          },
          title: function(context: any) {
            const index = context[0].dataIndex;
            return ratingHistory[index].contestName;
          },
          afterTitle: function(context: any) {
            const index = context[0].dataIndex;
            return `Rank: ${ratingHistory[index].rank}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: false,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)'
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)',
          maxRotation: 45,
          minRotation: 45
        }
      }
    }
  };

  return (
    <div className="h-64 w-full">
      <Line data={data} options={options} />
    </div>
  );
} 