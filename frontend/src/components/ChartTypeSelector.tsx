import React from 'react';
import { 
  BarChart3, 
  LineChart, 
  PieChart, 
  TrendingUp, 
  ScatterChart as Scatter, 
  Activity,
  Target,
  Layers,
  Grid3X3,
  Zap,
  BarChart2,
  BarChart4,
  TrendingDown
} from 'lucide-react';

interface ChartTypeSelectorProps {
  currentType: string;
  onTypeChange: (type: string) => void;
  availableTypes: string[];
}

const ChartTypeSelector: React.FC<ChartTypeSelectorProps> = ({ 
  currentType, 
  onTypeChange, 
  availableTypes 
}) => {
  const chartTypes = [
    { id: 'bar', name: 'Bar Chart', icon: BarChart3, description: 'Compare categories' },
    { id: 'line', name: 'Line Chart', icon: LineChart, description: 'Show trends over time' },
    { id: 'pie', name: 'Pie Chart', icon: PieChart, description: 'Show proportions' },
    { id: 'donut', name: 'Donut Chart', icon: Target, description: 'Modern pie chart' },
    { id: 'area', name: 'Area Chart', icon: TrendingUp, description: 'Filled line chart' },
    { id: 'scatter', name: 'Scatter Plot', icon: Scatter, description: 'Show correlations' },
    { id: 'radar', name: 'Radar Chart', icon: Zap, description: 'Multi-dimensional data' },
    { id: 'funnel', name: 'Funnel Chart', icon: Layers, description: 'Process flow' },
    { id: 'treemap', name: 'Treemap', icon: Grid3X3, description: 'Hierarchical data' },
    { id: 'heatmap', name: 'Heatmap', icon: Activity, description: 'Data intensity' },
    { id: 'waterfall', name: 'Waterfall', icon: TrendingDown, description: 'Cumulative changes' },
    { id: 'gauge', name: 'Gauge Chart', icon: Target, description: 'Progress indicator' },
    { id: 'bubble', name: 'Bubble Chart', icon: Scatter, description: '3D scatter plot' },
    { id: 'candlestick', name: 'Candlestick', icon: BarChart2, description: 'Financial data' },
    { id: 'violin', name: 'Violin Plot', icon: BarChart4, description: 'Distribution shape' }
  ];

  const availableChartTypes = chartTypes.filter(type => availableTypes.includes(type.id));

  return (
    <div className="grid grid-cols-2 gap-2 max-h-80 overflow-y-auto">
      {availableChartTypes.map((type) => {
        const Icon = type.icon;
        return (
          <button
            key={type.id}
            onClick={() => onTypeChange(type.id)}
            className={`p-3 rounded-lg border-2 transition-all ${
              currentType === type.id
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            }`}
          >
            <div className="flex flex-col items-center space-y-2">
              <Icon className="h-5 w-5" />
              <div className="text-center">
                <p className="text-xs font-medium">{type.name}</p>
                <p className="text-xs text-gray-500">{type.description}</p>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default ChartTypeSelector;