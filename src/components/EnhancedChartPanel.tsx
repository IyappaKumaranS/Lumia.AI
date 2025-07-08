import React, { useState } from 'react';
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
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar as RadarComponent,
  Treemap,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  FunnelChart,
  Funnel,
  LabelList,
  ComposedChart,
  ReferenceLine
} from 'recharts';
import { ChartConfig, DashboardTheme } from '../types';
import { X, Download, Maximize2, RefreshCw, Palette, ChevronDown } from 'lucide-react';
import ChartTypeSelector from './ChartTypeSelector';

interface EnhancedChartPanelProps {
  config: ChartConfig;
  theme: DashboardTheme;
  onRemove: (id: string) => void;
  onUpdate: (id: string, newConfig: ChartConfig) => void;
}

const EnhancedChartPanel: React.FC<EnhancedChartPanelProps> = ({ 
  config, 
  theme, 
  onRemove, 
  onUpdate 
}) => {
  const [showSettings, setShowSettings] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const availableTypes = [
    'bar', 'line', 'pie', 'donut', 'area', 'scatter', 'radar', 'funnel', 
    'treemap', 'heatmap', 'waterfall', 'gauge', 'bubble', 'candlestick', 'violin'
  ];

  const handleTypeChange = (newType: string) => {
    const updatedConfig = { ...config, type: newType as any };
    onUpdate(config.id, updatedConfig);
    setShowSettings(false);
  };

  const handleDownload = () => {
    // Simulate chart download
    alert('Chart download functionality would be implemented here');
  };

  const handleRefresh = () => {
    // Trigger chart refresh
    onUpdate(config.id, { ...config });
  };

  // Handle empty or invalid data
  if (!config.data || config.data.length === 0) {
    return (
      <div className={`${theme.cardBackground} rounded-lg shadow-md p-6 relative border ${theme.borderColor} h-96`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className={`text-lg font-semibold ${theme.textColor}`}>{config.title}</h3>
          <button
            onClick={() => onRemove(config.id)}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-4 w-4 text-gray-500" />
          </button>
        </div>
        <div className={`h-80 flex items-center justify-center ${theme.textColor} opacity-60`}>
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
              <CartesianGrid strokeDasharray="3 3" stroke={theme.borderColor.includes('gray-200') ? '#e5e7eb' : '#374151'} />
              <XAxis 
                dataKey={config.config.xKey} 
                angle={-45}
                textAnchor="end"
                height={80}
                interval={0}
                tick={{ fill: theme.textColor.includes('white') ? '#fff' : '#374151' }}
              />
              <YAxis tick={{ fill: theme.textColor.includes('white') ? '#fff' : '#374151' }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: theme.cardBackground.includes('gray-800') ? '#1f2937' : '#fff',
                  border: `1px solid ${theme.borderColor.includes('gray-700') ? '#374151' : '#e5e7eb'}`,
                  color: theme.textColor.includes('white') ? '#fff' : '#374151'
                }}
              />
              <Legend />
              <Bar dataKey={config.config.yKey} fill={theme.chartColors[0]} radius={[4, 4, 0, 0]} />
            </BarChart>
          );
          
        case 'line':
          return (
            <LineChart data={config.data}>
              <CartesianGrid strokeDasharray="3 3" stroke={theme.borderColor.includes('gray-200') ? '#e5e7eb' : '#374151'} />
              <XAxis 
                dataKey={config.config.xKey}
                angle={-45}
                textAnchor="end"
                height={80}
                tick={{ fill: theme.textColor.includes('white') ? '#fff' : '#374151' }}
              />
              <YAxis tick={{ fill: theme.textColor.includes('white') ? '#fff' : '#374151' }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: theme.cardBackground.includes('gray-800') ? '#1f2937' : '#fff',
                  border: `1px solid ${theme.borderColor.includes('gray-700') ? '#374151' : '#e5e7eb'}`,
                  color: theme.textColor.includes('white') ? '#fff' : '#374151'
                }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey={config.config.yKey} 
                stroke={theme.chartColors[1]} 
                strokeWidth={3}
                dot={{ r: 5, fill: theme.chartColors[1] }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          );
          
        case 'pie':
        case 'donut':
          return (
            <PieChart>
              <Pie
                data={config.data}
                dataKey={config.config.valueKey || 'value'}
                nameKey={config.config.nameKey || 'name'}
                cx="50%"
                cy="50%"
                outerRadius={80}
                innerRadius={config.type === 'donut' ? 40 : 0}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {config.data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={theme.chartColors[index % theme.chartColors.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: theme.cardBackground.includes('gray-800') ? '#1f2937' : '#fff',
                  border: `1px solid ${theme.borderColor.includes('gray-700') ? '#374151' : '#e5e7eb'}`,
                  color: theme.textColor.includes('white') ? '#fff' : '#374151'
                }}
              />
              <Legend />
            </PieChart>
          );
          
        case 'area':
          return (
            <AreaChart data={config.data}>
              <CartesianGrid strokeDasharray="3 3" stroke={theme.borderColor.includes('gray-200') ? '#e5e7eb' : '#374151'} />
              <XAxis 
                dataKey={config.config.xKey}
                angle={-45}
                textAnchor="end"
                height={80}
                tick={{ fill: theme.textColor.includes('white') ? '#fff' : '#374151' }}
              />
              <YAxis tick={{ fill: theme.textColor.includes('white') ? '#fff' : '#374151' }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: theme.cardBackground.includes('gray-800') ? '#1f2937' : '#fff',
                  border: `1px solid ${theme.borderColor.includes('gray-700') ? '#374151' : '#e5e7eb'}`,
                  color: theme.textColor.includes('white') ? '#fff' : '#374151'
                }}
              />
              <Legend />
              {Object.keys(config.data[0] || {})
                .filter(key => key !== config.config.xKey)
                .map((key, index) => (
                <Area
                  key={key}
                  type="monotone"
                  dataKey={key}
                  stackId="1"
                  stroke={theme.chartColors[index % theme.chartColors.length]}
                  fill={theme.chartColors[index % theme.chartColors.length]}
                  fillOpacity={0.7}
                />
              ))}
            </AreaChart>
          );
          
        case 'scatter':
          return (
            <ScatterChart data={config.data}>
              <CartesianGrid strokeDasharray="3 3" stroke={theme.borderColor.includes('gray-200') ? '#e5e7eb' : '#374151'} />
              <XAxis dataKey="x" type="number" tick={{ fill: theme.textColor.includes('white') ? '#fff' : '#374151' }} />
              <YAxis dataKey="y" type="number" tick={{ fill: theme.textColor.includes('white') ? '#fff' : '#374151' }} />
              <Tooltip 
                cursor={{ strokeDasharray: '3 3' }}
                contentStyle={{ 
                  backgroundColor: theme.cardBackground.includes('gray-800') ? '#1f2937' : '#fff',
                  border: `1px solid ${theme.borderColor.includes('gray-700') ? '#374151' : '#e5e7eb'}`,
                  color: theme.textColor.includes('white') ? '#fff' : '#374151'
                }}
              />
              <Scatter fill={theme.chartColors[4]} />
            </ScatterChart>
          );

        case 'bubble': {
          // Enhanced bubble chart with proper data handling
          const bubbleData = config.data.map((item, index) => {
            const keys = Object.keys(item);
            return {
              x: parseFloat(item[keys[0]]) || index,
              y: parseFloat(item[keys[1]]) || 0,
              z: parseFloat(item[keys[2]]) || 10,
              name: item[keys[0]] || `Point ${index + 1}`
            };
          });

          return (
            <ScatterChart data={bubbleData}>
              <CartesianGrid strokeDasharray="3 3" stroke={theme.borderColor.includes('gray-200') ? '#e5e7eb' : '#374151'} />
              <XAxis 
                dataKey="x" 
                type="number" 
                tick={{ fill: theme.textColor.includes('white') ? '#fff' : '#374151' }}
                name={config.config.xKey || 'X Axis'}
              />
              <YAxis 
                dataKey="y" 
                type="number" 
                tick={{ fill: theme.textColor.includes('white') ? '#fff' : '#374151' }}
                name={config.config.yKey || 'Y Axis'}
              />
              <Tooltip 
                cursor={{ strokeDasharray: '3 3' }}
                contentStyle={{ 
                  backgroundColor: theme.cardBackground.includes('gray-800') ? '#1f2937' : '#fff',
                  border: `1px solid ${theme.borderColor.includes('gray-700') ? '#374151' : '#e5e7eb'}`,
                  color: theme.textColor.includes('white') ? '#fff' : '#374151'
                }}
                formatter={(value, name) => [value, name]}
                labelFormatter={(label) => `Point: ${label}`}
              />
              <Scatter 
                dataKey="z" 
                fill={theme.chartColors[0]}
                fillOpacity={0.7}
              />
            </ScatterChart>
          );
        }

        case 'radar': {
          // Enhanced radar chart with proper data transformation
          const radarData = config.data.slice(0, 6).map((item, index) => {
            const transformedItem: any = { subject: item[config.config.xKey || Object.keys(item)[0]] || `Item ${index + 1}` };
            
            // Add numeric values for radar
            Object.keys(item).forEach(key => {
              if (typeof item[key] === 'number' || !isNaN(parseFloat(item[key]))) {
                transformedItem[key] = parseFloat(item[key]) || 0;
              }
            });
            
            return transformedItem;
          });

          const radarKeys = Object.keys(radarData[0] || {}).filter(key => key !== 'subject');

          return (
            <RadarChart data={radarData}>
              <PolarGrid stroke={theme.borderColor.includes('gray-200') ? '#e5e7eb' : '#374151'} />
              <PolarAngleAxis 
                dataKey="subject" 
                tick={{ fill: theme.textColor.includes('white') ? '#fff' : '#374151', fontSize: 12 }}
              />
              <PolarRadiusAxis 
                tick={{ fill: theme.textColor.includes('white') ? '#fff' : '#374151', fontSize: 10 }}
                tickCount={5}
              />
              {radarKeys.slice(0, 3).map((key, index) => (
                <RadarComponent
                  key={key}
                  name={key}
                  dataKey={key}
                  stroke={theme.chartColors[index % theme.chartColors.length]}
                  fill={theme.chartColors[index % theme.chartColors.length]}
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
              ))}
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: theme.cardBackground.includes('gray-800') ? '#1f2937' : '#fff',
                  border: `1px solid ${theme.borderColor.includes('gray-700') ? '#374151' : '#e5e7eb'}`,
                  color: theme.textColor.includes('white') ? '#fff' : '#374151'
                }}
              />
              <Legend />
            </RadarChart>
          );
        }

        case 'funnel':
          return (
            <FunnelChart data={config.data}>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: theme.cardBackground.includes('gray-800') ? '#1f2937' : '#fff',
                  border: `1px solid ${theme.borderColor.includes('gray-700') ? '#374151' : '#e5e7eb'}`,
                  color: theme.textColor.includes('white') ? '#fff' : '#374151'
                }}
              />
              <Funnel
                dataKey={config.config.valueKey || 'value'}
                data={config.data}
                isAnimationActive
              >
                <LabelList position="center" fill="#fff" stroke="none" />
                {config.data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={theme.chartColors[index % theme.chartColors.length]} />
                ))}
              </Funnel>
            </FunnelChart>
          );

        case 'treemap':
          return (
            <Treemap
              data={config.data}
              dataKey={config.config.valueKey || 'value'}
              ratio={4/3}
              stroke="#fff"
              fill={theme.chartColors[0]}
            >
              {config.data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={theme.chartColors[index % theme.chartColors.length]} />
              ))}
            </Treemap>
          );

        case 'heatmap': {
          // Enhanced heatmap with better visualization and no overlapping
          const heatmapData = config.data.slice(0, 64); // Limit to 8x8 grid for better readability
          const maxValue = Math.max(...heatmapData.map(item => {
            const values = Object.values(item).filter(v => typeof v === 'number');
            return Math.max(...values);
          }));

          const minValue = Math.min(...heatmapData.map(item => {
            const values = Object.values(item).filter(v => typeof v === 'number');
            return Math.min(...values);
          }));

          const gridSize = Math.ceil(Math.sqrt(heatmapData.length));
          const cellSize = isFullscreen ? 'w-16 h-16' : 'w-8 h-8';

          return (
            <div className="h-full flex flex-col items-center justify-center p-2 space-y-3 overflow-hidden">
              {/* Heatmap Grid */}
              <div 
                className="grid gap-0.5 mx-auto"
                style={{ 
                  gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
                  maxWidth: isFullscreen ? '600px' : '300px',
                  maxHeight: isFullscreen ? '500px' : '250px'
                }}
              >
                {heatmapData.map((item, index) => {
                  const value = Object.values(item).find(v => typeof v === 'number') as number || 0;
                  const normalizedValue = maxValue > minValue ? (value - minValue) / (maxValue - minValue) : 0;
                  const colorIndex = Math.floor(normalizedValue * (theme.chartColors.length - 1));
                  
                  return (
                    <div
                      key={index}
                      className={`${cellSize} rounded-sm border border-white/20 flex items-center justify-center text-xs font-medium transition-all hover:scale-110 hover:z-10 relative cursor-pointer group`}
                      style={{
                        backgroundColor: theme.chartColors[colorIndex] || theme.chartColors[0],
                        opacity: 0.4 + (normalizedValue * 0.6),
                        color: normalizedValue > 0.5 ? '#fff' : theme.textColor.includes('white') ? '#fff' : '#000'
                      }}
                    >
                      {/* Tooltip on hover */}
                      <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap z-20 transition-opacity pointer-events-none">
                        {value.toFixed(2)}
                      </div>
                      
                      {/* Show value only if cell is large enough */}
                      {(isFullscreen || gridSize <= 8) && (
                        <span className="truncate text-xs">
                          {value >= 1000 ? `${(value/1000).toFixed(1)}k` : value.toFixed(0)}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="flex items-center justify-center w-full">
                <div className="flex items-center space-x-2">
                  <span className={`text-xs ${theme.textColor}`}>Low</span>
                  <div className="flex space-x-1">
                    {theme.chartColors.slice(0, 5).map((color, index) => (
                      <div
                        key={index}
                        className="w-3 h-3 rounded border border-white/30"
                        style={{ 
                          backgroundColor: color, 
                          opacity: 0.4 + (index * 0.15) 
                        }}
                      />
                    ))}
                  </div>
                  <span className={`text-xs ${theme.textColor}`}>High</span>
                </div>
              </div>

              {/* Value Range */}
              <div className={`text-xs ${theme.textColor} opacity-70 text-center`}>
                Range: {minValue.toFixed(2)} - {maxValue.toFixed(2)}
              </div>
            </div>
          );
        }

        case 'waterfall':
          return (
            <ComposedChart data={config.data}>
              <CartesianGrid strokeDasharray="3 3" stroke={theme.borderColor.includes('gray-200') ? '#e5e7eb' : '#374151'} />
              <XAxis 
                dataKey={config.config.xKey}
                tick={{ fill: theme.textColor.includes('white') ? '#fff' : '#374151' }}
              />
              <YAxis tick={{ fill: theme.textColor.includes('white') ? '#fff' : '#374151' }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: theme.cardBackground.includes('gray-800') ? '#1f2937' : '#fff',
                  border: `1px solid ${theme.borderColor.includes('gray-700') ? '#374151' : '#e5e7eb'}`,
                  color: theme.textColor.includes('white') ? '#fff' : '#374151'
                }}
              />
              <Bar dataKey={config.config.yKey} fill={theme.chartColors[0]} />
              <ReferenceLine y={0} stroke="#000" />
            </ComposedChart>
          );

        case 'gauge': {
          // Enhanced gauge chart
          const gaugeValue = config.data[0]?.[config.config.valueKey || 'value'] || 0;
          const maxValue = 100;
          const percentage = Math.min((gaugeValue / maxValue) * 100, 100);
          const gaugeData = [
            { name: 'Value', value: percentage, fill: theme.chartColors[0] },
            { name: 'Remaining', value: 100 - percentage, fill: '#e5e7eb' }
          ];
          
          return (
            <div className="relative h-full flex flex-col items-center justify-center">
              <PieChart width={isFullscreen ? 300 : 200} height={isFullscreen ? 300 : 200}>
                <Pie
                  data={gaugeData}
                  dataKey="value"
                  startAngle={180}
                  endAngle={0}
                  cx="50%"
                  cy="80%"
                  outerRadius={isFullscreen ? 120 : 80}
                  innerRadius={isFullscreen ? 90 : 60}
                >
                  {gaugeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
              </PieChart>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/4 text-center">
                <div className={`${isFullscreen ? 'text-5xl' : 'text-3xl'} font-bold ${theme.textColor}`}>
                  {percentage.toFixed(1)}%
                </div>
                <div className={`text-sm ${theme.textColor} opacity-70`}>Performance</div>
              </div>
            </div>
          );
        }

        case 'candlestick':
          // Enhanced candlestick chart
          return (
            <ComposedChart data={config.data}>
              <CartesianGrid strokeDasharray="3 3" stroke={theme.borderColor.includes('gray-200') ? '#e5e7eb' : '#374151'} />
              <XAxis 
                dataKey={config.config.xKey}
                tick={{ fill: theme.textColor.includes('white') ? '#fff' : '#374151' }}
              />
              <YAxis tick={{ fill: theme.textColor.includes('white') ? '#fff' : '#374151' }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: theme.cardBackground.includes('gray-800') ? '#1f2937' : '#fff',
                  border: `1px solid ${theme.borderColor.includes('gray-700') ? '#374151' : '#e5e7eb'}`,
                  color: theme.textColor.includes('white') ? '#fff' : '#374151'
                }}
              />
              <Bar dataKey="high" fill={theme.chartColors[1]} />
              <Bar dataKey="low" fill={theme.chartColors[2]} />
              <Line type="monotone" dataKey="close" stroke={theme.chartColors[0]} strokeWidth={2} />
            </ComposedChart>
          );

        case 'violin':
          // Enhanced violin plot
          return (
            <AreaChart data={config.data}>
              <CartesianGrid strokeDasharray="3 3" stroke={theme.borderColor.includes('gray-200') ? '#e5e7eb' : '#374151'} />
              <XAxis 
                dataKey={config.config.xKey}
                tick={{ fill: theme.textColor.includes('white') ? '#fff' : '#374151' }}
              />
              <YAxis tick={{ fill: theme.textColor.includes('white') ? '#fff' : '#374151' }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: theme.cardBackground.includes('gray-800') ? '#1f2937' : '#fff',
                  border: `1px solid ${theme.borderColor.includes('gray-700') ? '#374151' : '#e5e7eb'}`,
                  color: theme.textColor.includes('white') ? '#fff' : '#374151'
                }}
              />
              <Area
                type="monotone"
                dataKey={config.config.yKey}
                stroke={theme.chartColors[0]}
                fill={theme.chartColors[0]}
                fillOpacity={0.6}
              />
            </AreaChart>
          );
          
        default:
          return (
            <div className={`h-full flex items-center justify-center ${theme.textColor} opacity-60`}>
              Unsupported chart type: {config.type}
            </div>
          );
      }
    } catch (error) {
      console.error('Error rendering chart:', error);
      return (
        <div className={`h-full flex items-center justify-center text-red-500`}>
          Error rendering chart
        </div>
      );
    }
  };

  return (
    <div 
      className={`${theme.cardBackground} rounded-lg shadow-lg border ${theme.borderColor} relative ${
        isFullscreen 
          ? 'fixed inset-4 z-50 p-6' 
          : 'p-4 h-96'
      }`}
      style={{
        contain: 'layout style',
        isolation: 'isolate',
        position: isFullscreen ? 'fixed' : 'relative'
      }}
    >
      {/* Enhanced Header with Better Chart Type Selector */}
      <div className="flex items-center justify-between mb-3 relative z-10">
        <h3 className={`text-base font-semibold ${theme.textColor} truncate pr-2 flex-1`}>{config.title}</h3>
        
        {/* Enhanced Chart Type Selector - More Prominent */}
        <div className="flex items-center space-x-2 flex-shrink-0">
          <div className="relative">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className={`flex items-center px-3 py-2 rounded-lg border-2 transition-all font-medium text-sm ${
                showSettings
                  ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-md'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600'
              }`}
              title="Change Chart Type"
            >
              <Palette className="h-4 w-4 mr-2" />
              <span className="capitalize">{config.type}</span>
              <ChevronDown className={`h-4 w-4 ml-1 transition-transform ${showSettings ? 'rotate-180' : ''}`} />
            </button>
            
            {/* Dropdown Settings Panel */}
            {showSettings && (
              <div 
                className="absolute top-full right-0 mt-2 w-80 bg-white border-2 border-blue-200 rounded-xl shadow-xl z-50 p-4"
                style={{ zIndex: 9999 }}
              >
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-semibold text-gray-900 flex items-center">
                    <Palette className="h-4 w-4 mr-2 text-blue-600" />
                    Change Chart Type
                  </h4>
                  <button
                    onClick={() => setShowSettings(false)}
                    className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X className="h-4 w-4 text-gray-500" />
                  </button>
                </div>
                <div className="border-t border-gray-200 pt-3">
                  <ChartTypeSelector
                    currentType={config.type}
                    onTypeChange={handleTypeChange}
                    availableTypes={availableTypes}
                  />
                </div>
              </div>
            )}
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center space-x-1">
            <button
              onClick={handleRefresh}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Refresh Chart"
            >
              <RefreshCw className="h-4 w-4 text-gray-500" />
            </button>
            <button
              onClick={handleDownload}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Download Chart"
            >
              <Download className="h-4 w-4 text-gray-500" />
            </button>
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Fullscreen"
            >
              <Maximize2 className="h-4 w-4 text-gray-500" />
            </button>
            <button
              onClick={() => onRemove(config.id)}
              className="p-2 hover:bg-red-100 rounded-lg transition-colors"
              title="Remove Chart"
            >
              <X className="h-4 w-4 text-red-500" />
            </button>
          </div>
        </div>
      </div>

      {/* Current Chart Type Indicator */}
      <div className="mb-3 relative z-10">
        <div className="flex items-center justify-between">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200`}>
            <Palette className="h-3 w-3 mr-1" />
            {config.type.charAt(0).toUpperCase() + config.type.slice(1)} Chart
          </span>
          {showSettings && (
            <span className="text-xs text-blue-600 font-medium animate-pulse">
              ← Select a new chart type
            </span>
          )}
        </div>
      </div>
      
      {/* Chart Container */}
      <div className={`${isFullscreen ? 'h-[calc(100vh-200px)]' : 'h-72'} relative`}>
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default EnhancedChartPanel;