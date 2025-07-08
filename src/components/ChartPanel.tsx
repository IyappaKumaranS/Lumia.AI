import React from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  AreaChart,
  Area,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { ChartConfig } from '../types';
import { X } from 'lucide-react';

interface ChartPanelProps {
  config: ChartConfig;
  onRemove: (id: string) => void;
}

const ChartPanel: React.FC<ChartPanelProps> = ({ config, onRemove }) => {
  const colors = [
    '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
    '#06B6D4', '#F97316', '#84CC16', '#EC4899', '#6B7280'
  ];

  // Handle empty or invalid data
  if (!config.data || config.data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 relative">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">{config.title}</h3>
          <button
            onClick={() => onRemove(config.id)}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-4 w-4 text-gray-500" />
          </button>
        </div>
        <div className="h-80 flex items-center justify-center text-gray-500">
          No data available for this chart
        </div>
      </div>
    );
  }

  const renderChart = () => {
    try {
      switch (config.type) {
        case 'bar':
          return (
            <BarChart data={config.data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey={config.config.xKey} 
                angle={-45}
                textAnchor="end"
                height={80}
                interval={0}
              />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey={config.config.yKey} fill={colors[0]} />
            </BarChart>
          );
          
        case 'line':
          return (
            <LineChart data={config.data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey={config.config.xKey}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey={config.config.yKey} 
                stroke={colors[1]} 
                strokeWidth={2}
                dot={{ r: 4 }}
              />
            </LineChart>
          );
          
        case 'pie':
          return (
            <PieChart>
              <Pie
                data={config.data}
                dataKey={config.config.valueKey || 'value'}
                nameKey={config.config.nameKey || 'name'}
                cx="50%"
                cy="50%"
                outerRadius={80}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {config.data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          );
          
        case 'area':
          return (
            <AreaChart data={config.data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey={config.config.xKey}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis />
              <Tooltip />
              <Legend />
              {Object.keys(config.data[0] || {})
                .filter(key => key !== config.config.xKey)
                .map((key, index) => (
                <Area
                  key={key}
                  type="monotone"
                  dataKey={key}
                  stackId="1"
                  stroke={colors[index % colors.length]}
                  fill={colors[index % colors.length]}
                  fillOpacity={0.6}
                />
              ))}
            </AreaChart>
          );
          
        case 'scatter':
          return (
            <ScatterChart data={config.data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="x" type="number" />
              <YAxis dataKey="y" type="number" />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} />
              <Scatter fill={colors[4]} />
            </ScatterChart>
          );
          
        default:
          return (
            <div className="h-full flex items-center justify-center text-gray-500">
              Unsupported chart type: {config.type}
            </div>
          );
      }
    } catch (error) {
      console.error('Error rendering chart:', error);
      return (
        <div className="h-full flex items-center justify-center text-red-500">
          Error rendering chart
        </div>
      );
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 relative">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{config.title}</h3>
        <button
          onClick={() => onRemove(config.id)}
          className="p-1 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X className="h-4 w-4 text-gray-500" />
        </button>
      </div>
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ChartPanel;