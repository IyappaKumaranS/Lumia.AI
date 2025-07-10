import React from 'react';
import { ChartConfig, DashboardTheme } from '../types';
import EnhancedChartPanel from './EnhancedChartPanel';
import { BarChart3, TrendingUp, Grid, List } from 'lucide-react';

interface DashboardProps {
  charts: ChartConfig[];
  theme: DashboardTheme;
  onRemoveChart: (id: string) => void;
  onUpdateChart: (id: string, newConfig: ChartConfig) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ charts, theme, onRemoveChart, onUpdateChart }) => {
  const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('grid');

  if (charts.length === 0) {
    return (
      <div className={`${theme.cardBackground} rounded-xl shadow-lg p-16 text-center border ${theme.borderColor} h-full flex flex-col items-center justify-center`}>
        <BarChart3 className={`h-20 w-20 mx-auto mb-6 ${theme.textColor} opacity-30`} />
        <h3 className={`text-2xl font-semibold ${theme.textColor} mb-3`}>No Charts Yet</h3>
        <p className={`${theme.textColor} opacity-70 text-lg max-w-md`}>
          Select AI-generated insights from the sidebar to create your dashboard
        </p>
      </div>
    );
  }

  return (
    <div className={`${theme.background} rounded-xl h-full flex flex-col overflow-hidden`}>
      {/* Fixed Header */}
      <div className="flex-shrink-0 p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <TrendingUp className={`h-6 w-6 ${theme.accentColor} mr-2`} />
            <h2 className={`text-xl font-semibold ${theme.textColor}`}>Dashboard</h2>
            <span className={`ml-2 px-3 py-1 bg-blue-100 ${theme.accentColor} text-sm rounded-full`}>
              {charts.length} chart{charts.length !== 1 ? 's' : ''}
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'grid' 
                  ? 'bg-blue-100 text-blue-600' 
                  : `hover:bg-gray-100 ${theme.textColor} opacity-70`
              }`}
              title="Grid View"
            >
              <Grid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'list' 
                  ? 'bg-blue-100 text-blue-600' 
                  : `hover:bg-gray-100 ${theme.textColor} opacity-70`
              }`}
              title="List View"
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        <div className="p-6">
          <div className={`${
            viewMode === 'grid' 
              ? 'grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-6' 
              : 'space-y-6'
          }`}>
            {charts.map((chart) => (
              <div 
                key={chart.id} 
                className="relative"
                style={{ 
                  contain: 'layout style',
                  isolation: 'isolate'
                }}
              >
                <EnhancedChartPanel
                  config={chart}
                  theme={theme}
                  onRemove={onRemoveChart}
                  onUpdate={onUpdateChart}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;