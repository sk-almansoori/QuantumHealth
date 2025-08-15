import React from 'react';

interface MetricCardProps {
  title: string;
  value: string;
  unit: string;
  icon: React.ReactNode;
  trend: string;
  color: string;
}

export function MetricCard({ title, value, unit, icon, trend, color }: MetricCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">{title}</h3>
        <span className={`${color}`}>{icon}</span>
      </div>
      <div className="flex items-baseline">
        <p className="text-2xl font-semibold text-gray-900 dark:text-white">{value}</p>
        <p className="ml-2 text-sm text-gray-500 dark:text-gray-400">{unit}</p>
      </div>
      <div className="mt-4">
        <span className={`text-sm ${trend.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
          {trend}
        </span>
        <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">vs last week</span>
      </div>
    </div>
  );
}