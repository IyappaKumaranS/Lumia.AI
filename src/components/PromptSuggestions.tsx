import React from 'react';
import { AIPrompt } from '../types';
import { Sparkles, BarChart3, LineChart, PieChart, TrendingUp, ScatterChart as Scatter } from 'lucide-react';

interface PromptSuggestionsProps {
  prompts: AIPrompt[];
  onSelectPrompt: (prompt: AIPrompt) => void;
}

const PromptSuggestions: React.FC<PromptSuggestionsProps> = ({ prompts, onSelectPrompt }) => {
  const getChartIcon = (type: string) => {
    switch (type) {
      case 'bar':
        return <BarChart3 className="h-5 w-5" />;
      case 'line':
        return <LineChart className="h-5 w-5" />;
      case 'pie':
        return <PieChart className="h-5 w-5" />;
      case 'area':
        return <TrendingUp className="h-5 w-5" />;
      case 'scatter':
        return <Scatter className="h-5 w-5" />;
      default:
        return <BarChart3 className="h-5 w-5" />;
    }
  };

  const getChartColor = (type: string) => {
    switch (type) {
      case 'bar':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'line':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'pie':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'area':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'scatter':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center mb-6">
        <Sparkles className="h-6 w-6 text-purple-600 mr-2" />
        <h2 className="text-xl font-semibold">AI-Generated Insights</h2>
      </div>
      
      <div className="grid gap-4">
        {prompts.map((prompt) => (
          <div
            key={prompt.id}
            onClick={() => onSelectPrompt(prompt)}
            className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center mb-2">
                  <div className={`p-2 rounded-lg border ${getChartColor(prompt.chartType)} mr-3`}>
                    {getChartIcon(prompt.chartType)}
                  </div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {prompt.title}
                  </h3>
                </div>
                <p className="text-sm text-gray-600 mb-3">{prompt.description}</p>
                <div className="flex flex-wrap gap-2">
                  {prompt.metrics.map((metric) => (
                    <span
                      key={metric}
                      className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                    >
                      {metric}
                    </span>
                  ))}
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs text-gray-500 capitalize">{prompt.chartType} Chart</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {prompts.length === 0 && (
        <div className="text-center py-8">
          <Sparkles className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No insights generated yet. Upload a CSV file to get started.</p>
        </div>
      )}
    </div>
  );
};

export default PromptSuggestions;