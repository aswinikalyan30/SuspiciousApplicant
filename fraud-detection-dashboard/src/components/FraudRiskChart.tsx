import React from 'react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, Area, AreaChart } from 'recharts';
import { motion } from 'framer-motion';
import { format } from 'date-fns';

interface FraudRiskChartProps {
  data: { date: string; value: number }[];
  height?: number;
}

export function FraudRiskChart({ data, height = 200 }: FraudRiskChartProps) {
  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="glassmorphism p-3 rounded-lg border border-white/20 shadow-lg">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {format(new Date(label), 'MMM dd')}
          </p>
          <p className="text-lg font-semibold text-primary">
            {payload[0].value} flags
          </p>
        </div>
      );
    }
    return null;
  };

  // Custom dot component with glow effect
  const CustomDot = (props: any) => {
    const { cx, cy } = props;
    return (
      <circle
        cx={cx}
        cy={cy}
        r={4}
        fill="url(#dotGradient)"
        stroke="rgba(113, 0, 235, 0.5)"
        strokeWidth={2}
        className="animate-pulse-glow"
      />
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative"
    >
      {/* Neural network background pattern */}
      <div className="absolute inset-0 neural-bg opacity-10 rounded-lg"></div>
      
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#7100EB" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#7100EB" stopOpacity={0.05}/>
            </linearGradient>
            <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#7100EB"/>
              <stop offset="50%" stopColor="#95F4A0"/>
              <stop offset="100%" stopColor="#7100EB"/>
            </linearGradient>
            <linearGradient id="dotGradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#95F4A0"/>
              <stop offset="100%" stopColor="#7100EB"/>
            </linearGradient>
          </defs>
          
          <XAxis 
            dataKey="date" 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: '#6B7280' }}
            tickFormatter={(value) => format(new Date(value), 'dd')}
          />
          <YAxis 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: '#6B7280' }}
          />
          
          <Tooltip content={<CustomTooltip />} />
          
          <Area
            type="monotone"
            dataKey="value"
            stroke="url(#lineGradient)"
            strokeWidth={3}
            fill="url(#areaGradient)"
            dot={<CustomDot />}
            activeDot={{ 
              r: 6, 
              fill: "url(#dotGradient)",
              stroke: "rgba(113, 0, 235, 0.8)",
              strokeWidth: 2,
              className: "animate-pulse-glow"
            }}
          />
        </AreaChart>
      </ResponsiveContainer>

      {/* Sparkline overlay effect */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="w-full h-full bg-gradient-to-r from-transparent via-primary/5 to-transparent opacity-50"></div>
      </div>
    </motion.div>
  );
}