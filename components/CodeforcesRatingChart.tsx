"use client";

import { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';

interface RatingChange {
  contestId?: number;
  contestName?: string;
  handle?: string;
  rank?: number;
  ratingUpdateTimeSeconds?: number;
  oldRating?: number;
  newRating?: number;
}

interface CodeforcesRatingChartProps {
  ratingHistory: RatingChange[];
}

// Function to convert timestamp to formatted date
const formatDate = (timestamp?: number) => {
  if (!timestamp) return '';
  const date = new Date(timestamp * 1000);
  return `${date.toLocaleDateString()}`;
};

// Get color for a specific rating level
const getRatingColor = (rating: number): string => {
  if (rating < 1200) return '#cccccc';
  if (rating < 1400) return '#77ff77';
  if (rating < 1600) return '#77ddbb';
  if (rating < 1900) return '#aaaaff';
  if (rating < 2100) return '#ff88ff';
  if (rating < 2400) return '#ffcc88';
  if (rating < 2600) return '#ff7777';
  if (rating < 3000) return '#ff3333';
  return '#aa0000';
};

// Rating tier boundaries
const ratingBoundaries = [
  { rating: 3000, label: 'Legendary Grandmaster' },
  { rating: 2600, label: 'International Grandmaster' },
  { rating: 2400, label: 'Grandmaster' },
  { rating: 2100, label: 'Master' },
  { rating: 1900, label: 'Candidate Master' },
  { rating: 1600, label: 'Expert' },
  { rating: 1400, label: 'Specialist' },
  { rating: 1200, label: 'Pupil' },
  { rating: 0, label: 'Newbie' }
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    
    return (
      <div className="bg-background/95 backdrop-blur-sm p-3 rounded-lg border shadow-md">
        <p className="font-medium mb-1">{data.contestName}</p>
        <p className="text-sm text-muted-foreground mb-1">{formatDate(data.ratingUpdateTimeSeconds)}</p>
        <div className="flex items-center gap-2 mb-1">
          <span>Rank:</span>
          <span className="font-medium">{data.rank}</span>
        </div>
        <div className="flex items-center gap-2">
          <span>Rating:</span>
          <span className="font-medium">{data.oldRating} → {data.newRating}</span>
          <span className={data.newRating > data.oldRating ? 'text-green-500' : 'text-red-500'}>
            ({data.newRating > data.oldRating ? '+' : ''}{data.newRating - data.oldRating})
          </span>
        </div>
      </div>
    );
  }
  
  return null;
};

export default function CodeforcesRatingChart({ ratingHistory }: CodeforcesRatingChartProps) {
  const [chartData, setChartData] = useState<any[]>([]);
  const [minRating, setMinRating] = useState(1200);
  const [maxRating, setMaxRating] = useState(1800);
  
  useEffect(() => {
    if (ratingHistory && ratingHistory.length > 0) {
      // Sort by time
      const sortedHistory = [...ratingHistory].sort((a, b) => 
        (a.ratingUpdateTimeSeconds || 0) - (b.ratingUpdateTimeSeconds || 0)
      );
      
      // Convert to chart data format
      const formatted = sortedHistory.map((item, index) => ({
        ...item,
        index: index + 1,
        date: formatDate(item.ratingUpdateTimeSeconds),
      }));
      
      setChartData(formatted);
      
      // Calculate min and max for chart scale with padding
      const allRatings = sortedHistory.flatMap(item => [item.oldRating || 0, item.newRating || 0]);
      const min = Math.min(...allRatings);
      const max = Math.max(...allRatings);
      
      // Add some padding and ensure min is divisible by 100
      const paddedMin = Math.floor((min - 100) / 100) * 100;
      const paddedMax = Math.ceil((max + 100) / 100) * 100;
      
      setMinRating(paddedMin);
      setMaxRating(paddedMax);
    }
  }, [ratingHistory]);
  
  if (!ratingHistory || ratingHistory.length === 0) {
    return <div className="h-full flex items-center justify-center">No rating data available</div>;
  }
  
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={chartData}
        margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.3} />
        <XAxis
          dataKey="index"
          label={{ value: 'Contest #', position: 'insideBottomRight', offset: -5 }}
          padding={{ left: 20, right: 20 }}
        />
        <YAxis 
          domain={[minRating, maxRating]}
          padding={{ top: 20, bottom: 20 }}
          label={{ value: 'Rating', angle: -90, position: 'insideLeft' }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        
        {/* Rating tier boundaries */}
        {ratingBoundaries.map(tier => 
          tier.rating >= minRating && tier.rating <= maxRating && (
            <ReferenceLine 
              key={tier.rating}
              y={tier.rating} 
              stroke={getRatingColor(tier.rating)}
              strokeDasharray="3 3"
              label={{ 
                value: tier.label, 
                fill: getRatingColor(tier.rating),
                position: 'right'
              }} 
            />
          )
        )}
        
        <Line
          type="monotone"
          dataKey="newRating"
          name="Rating"
          stroke="#8884d8"
          strokeWidth={2}
          dot={{ fill: '#8884d8', r: 4 }}
          activeDot={{ r: 6 }}
          animationDuration={1000}
        />
      </LineChart>
    </ResponsiveContainer>
  );
} 