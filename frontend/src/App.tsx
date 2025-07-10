import React, { useState } from 'react';
import { BarChart3, Database, Sparkles, TrendingUp, MessageCircle, Zap, CheckCircle2, Plus } from 'lucide-react';
import FileUpload from './components/FileUpload';
import DataPreview from './components/DataPreview';
import PromptSuggestions from './components/PromptSuggestions';
import Dashboard from './components/Dashboard';
import CSVChat from './components/CSVChat';
import SuccessToast from './components/SuccessToast';
import ThemeSelector from './components/ThemeSelector';
import { CSVData, DataColumn, AIPrompt, ChartConfig, DashboardTheme } from './types';
import { parseCSV, analyzeColumns } from './utils/csvParser';
import { generateAIPrompts } from './utils/promptGenerator';
import { generateChartConfig } from './utils/chartGenerator';
import { getThemeById } from './utils/themes';

function App() {
  const [csvData, setCsvData] = useState<CSVData | null>(null);
  const [columns, setColumns] = useState<DataColumn[]>([]);
  const [prompts, setPrompts] = useState<AIPrompt[]>([]);
  const [charts, setCharts] = useState<ChartConfig[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [activeTab, setActiveTab] = useState<'upload' | 'data' | 'dashboard' | 'chat'>('upload');
  const [currentTheme, setCurrentTheme] = useState<DashboardTheme>(getThemeById('default'));
  const [selectedPrompts, setSelectedPrompts] = useState<Set<string>>(new Set());
  const [rapidFireMode, setRapidFireMode] = useState(false);
  const [isCreatingCharts, setIsCreatingCharts] = useState(false);

  const handleFileSelect = async (file: File) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await parseCSV(file);
      const analyzedColumns = analyzeColumns(data);
      const generatedPrompts = generateAIPrompts(data, analyzedColumns);
      
      setCsvData(data);
      setColumns(analyzedColumns);
      setPrompts(generatedPrompts);
      setUploadedFileName(file.name);
      setShowSuccessToast(true);
      setActiveTab('data');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to parse CSV file');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPrompt = (prompt: AIPrompt) => {
    if (!csvData) return;
    
    if (rapidFireMode) {
      // In rapid fire mode, just toggle selection
      setSelectedPrompts(prev => {
        const newSet = new Set(prev);
        if (newSet.has(prompt.id)) {
          newSet.delete(prompt.id);
        } else {
          newSet.add(prompt.id);
        }
        return newSet;
      });
    } else {
      // Normal mode - create chart immediately
      try {
        const chartConfig = generateChartConfig(csvData, prompt);
        setCharts(prev => [...prev, chartConfig]);
        if (activeTab !== 'dashboard') {
          setActiveTab('dashboard');
        }
      } catch (error) {
        console.error('Error creating chart:', error);
        setError('Failed to create chart. Please try a different prompt.');
      }
    }
  };

  const handleRapidFire = async () => {
    if (!csvData || selectedPrompts.size === 0) return;
    
    setIsCreatingCharts(true);
    
    // Add a small delay to show the loading state
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const selectedPromptObjects = prompts.filter(prompt => selectedPrompts.has(prompt.id));
    const newCharts: ChartConfig[] = [];
    
    selectedPromptObjects.forEach(prompt => {
      try {
        const chartConfig = generateChartConfig(csvData, prompt);
        newCharts.push(chartConfig);
      } catch (error) {
        console.error('Error creating chart for prompt:', prompt.title, error);
      }
    });
    
    setCharts(prev => [...prev, ...newCharts]);
    setSelectedPrompts(new Set());
    setRapidFireMode(false);
    setIsCreatingCharts(false);
    setActiveTab('dashboard');
  };

  const handleRemoveChart = (id: string) => {
    setCharts(prev => prev.filter(chart => chart.id !== id));
  };

  const handleUpdateChart = (id: string, newConfig: ChartConfig) => {
    setCharts(prev => prev.map(chart => chart.id === id ? newConfig : chart));
  };

  const resetApp = () => {
    setCsvData(null);
    setColumns([]);
    setPrompts([]);
    setCharts([]);
    setError(null);
    setUploadedFileName(null);
    setActiveTab('upload');
    setSelectedPrompts(new Set());
    setRapidFireMode(false);
  };

  const tabs = [
    { id: 'upload', label: 'Upload', icon: Database, disabled: false },
    { id: 'data', label: 'Data Preview', icon: BarChart3, disabled: !csvData },
    { id: 'dashboard', label: 'Dashboard', icon: TrendingUp, disabled: !csvData },
    { id: 'chat', label: 'Chat with Data', icon: MessageCircle, disabled: !csvData }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Success Toast */}
      <SuccessToast
        message="CSV file uploaded successfully!"
        isVisible={showSuccessToast}
        onClose={() => setShowSuccessToast(false)}
      />

      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <BarChart3 className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-xl font-bold text-gray-900">Lumia.AI</h1>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeSelector currentTheme={currentTheme} onThemeChange={setCurrentTheme} />
              {csvData && (
                <button
                  onClick={resetApp}
                  className="px-4 py-2 text-sm text-gray-700 hover:opacity-75 transition-opacity"
                >
                  Reset
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => !tab.disabled && setActiveTab(tab.id as any)}
                  className={`flex items-center px-1 py-4 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : tab.disabled
                      ? 'border-transparent text-gray-400 cursor-not-allowed'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                  disabled={tab.disabled}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content - Full width for dashboard */}
      <main className={`${activeTab === 'dashboard' ? 'max-w-full' : 'max-w-7xl'} mx-auto px-4 sm:px-6 lg:px-8 py-8`}>
        {activeTab === 'upload' && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Create Intelligent Dashboards with AI
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Upload your CSV data and let AI generate insightful visualizations and analysis prompts automatically
              </p>
            </div>
            <FileUpload
              onFileSelect={handleFileSelect}
              loading={loading}
              error={error}
              uploadedFileName={uploadedFileName}
            />
          </div>
        )}

        {activeTab === 'data' && csvData && (
          <DataPreview data={csvData} columns={columns} />
        )}

        {activeTab === 'dashboard' && csvData && (
          <div className="flex gap-4 h-[calc(100vh-140px)]">
            {/* Main Dashboard Area - Much larger now */}
            <div className="flex-1 min-w-0 overflow-hidden">
              <div className="h-full">
                <Dashboard
                  charts={charts}
                  theme={currentTheme}
                  onRemoveChart={handleRemoveChart}
                  onUpdateChart={handleUpdateChart}
                />
              </div>
            </div>

            {/* AI Insights Sidebar - Enhanced with Rapid Fire */}
            <div className="w-80 flex-shrink-0 h-full">
              <div className="h-full bg-white rounded-xl shadow-lg border border-gray-200 flex flex-col">
                <div className="p-4 border-b border-gray-100 flex-shrink-0">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div className="p-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg mr-3">
                        <Sparkles className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <h3 className="text-base font-semibold text-gray-900">AI Insights</h3>
                        <p className="text-xs text-gray-500">
                          {rapidFireMode ? 'Select multiple charts to create' : 'Click to add individual charts'}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Enhanced Rapid Fire Button */}
                  <div className="space-y-3">
                    {!rapidFireMode ? (
                      <button
                        onClick={() => setRapidFireMode(true)}
                        className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-semibold text-sm hover:from-orange-600 hover:to-red-600 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
                      >
                        <Zap className="h-5 w-5 mr-2" />
                        🚀 Rapid Fire Mode
                      </button>
                    ) : (
                      <div className="space-y-2">
                        {/* Selection Counter */}
                        <div className="flex items-center justify-between p-3 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg border border-orange-200">
                          <div className="flex items-center">
                            <CheckCircle2 className="h-4 w-4 text-orange-600 mr-2" />
                            <span className="text-sm font-medium text-orange-800">
                              {selectedPrompts.size} chart{selectedPrompts.size !== 1 ? 's' : ''} selected
                            </span>
                          </div>
                          <button
                            onClick={() => {
                              setRapidFireMode(false);
                              setSelectedPrompts(new Set());
                            }}
                            className="text-xs text-orange-600 hover:text-orange-800 font-medium"
                          >
                            Cancel
                          </button>
                        </div>
                        
                        {/* Create Charts Button */}
                        {selectedPrompts.size > 0 && (
                          <button
                            onClick={handleRapidFire}
                            disabled={isCreatingCharts}
                            className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-xl font-bold text-sm hover:from-green-600 hover:to-blue-600 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                          >
                            {isCreatingCharts ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                                Creating Charts...
                              </>
                            ) : (
                              <>
                                <Plus className="h-5 w-5 mr-2" />
                                ⚡ Create {selectedPrompts.size} Chart{selectedPrompts.size !== 1 ? 's' : ''} Now!
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    )}
                    
                    {/* Help Text */}
                    <div className={`text-xs p-3 rounded-lg border ${
                      rapidFireMode 
                        ? 'text-orange-700 bg-orange-50 border-orange-200' 
                        : 'text-blue-700 bg-blue-50 border-blue-200'
                    }`}>
                      {rapidFireMode ? (
                        <>
                          <strong>🎯 Rapid Fire Active:</strong> Select multiple insights below, then click "Create Charts" to generate them all instantly!
                        </>
                      ) : (
                        <>
                          <strong>💡 Pro Tip:</strong> Use Rapid Fire Mode to select and create multiple charts at once for faster dashboard building!
                        </>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex-1 overflow-y-auto p-4">
                  <div className="space-y-3">
                    {prompts.map((prompt) => (
                      <div
                        key={prompt.id}
                        onClick={() => handleSelectPrompt(prompt)}
                        className={`group p-3 border rounded-lg transition-all cursor-pointer ${
                          rapidFireMode && selectedPrompts.has(prompt.id)
                            ? 'border-green-400 bg-green-50 shadow-md ring-2 ring-green-200'
                            : rapidFireMode
                            ? 'border-orange-200 hover:border-orange-300 hover:shadow-sm bg-gradient-to-r from-orange-50 to-yellow-50 hover:from-orange-100 hover:to-yellow-100'
                            : 'border-gray-200 hover:border-blue-300 hover:shadow-sm bg-gradient-to-r from-gray-50 to-white hover:from-blue-50 hover:to-purple-50'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h4 className={`font-medium transition-colors text-sm leading-tight ${
                            rapidFireMode && selectedPrompts.has(prompt.id)
                              ? 'text-green-800'
                              : rapidFireMode
                              ? 'text-orange-700 group-hover:text-orange-800'
                              : 'text-gray-900 group-hover:text-blue-700'
                          }`}>
                            {prompt.title}
                          </h4>
                          <div className="flex items-center space-x-1">
                            {rapidFireMode && selectedPrompts.has(prompt.id) && (
                              <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                                <CheckCircle2 className="w-3 h-3 text-white" />
                              </div>
                            )}
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium capitalize ml-2 flex-shrink-0 ${
                              rapidFireMode && selectedPrompts.has(prompt.id)
                                ? 'bg-green-200 text-green-800'
                                : rapidFireMode
                                ? 'bg-orange-100 text-orange-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}>
                              {prompt.chartType}
                            </span>
                          </div>
                        </div>
                        
                        <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                          {prompt.description}
                        </p>
                        
                        <div className="flex flex-wrap gap-1 mb-2">
                          {prompt.metrics.slice(0, 2).map((metric) => (
                            <span
                              key={metric}
                              className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded"
                            >
                              {metric.length > 10 ? `${metric.substring(0, 10)}...` : metric}
                            </span>
                          ))}
                          {prompt.metrics.length > 2 && (
                            <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
                              +{prompt.metrics.length - 2}
                            </span>
                          )}
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center text-xs text-gray-500">
                            <div className={`w-1.5 h-1.5 rounded-full mr-1 ${
                              rapidFireMode && selectedPrompts.has(prompt.id)
                                ? 'bg-green-400'
                                : 'bg-green-400'
                            }`}></div>
                            {rapidFireMode && selectedPrompts.has(prompt.id) ? 'Selected ✓' : 'Ready'}
                          </div>
                          <button className={`text-xs px-3 py-1.5 rounded-lg transition-all transform group-hover:scale-105 font-semibold ${
                            rapidFireMode && selectedPrompts.has(prompt.id)
                              ? 'bg-green-500 text-white shadow-md'
                              : rapidFireMode
                              ? 'bg-gradient-to-r from-orange-500 to-yellow-500 text-white hover:from-orange-600 hover:to-yellow-600 shadow-md'
                              : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 shadow-md'
                          }`}>
                            {rapidFireMode && selectedPrompts.has(prompt.id) ? '✓ Selected' : rapidFireMode ? '+ Select' : '+ Add Chart'}
                          </button>
                        </div>
                      </div>
                    ))}
                    
                    {prompts.length === 0 && (
                      <div className="text-center py-8">
                        <Sparkles className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                        <p className="text-gray-500 text-sm">No insights available</p>
                      </div>
                    )}
                  </div>
                </div>
                
                {prompts.length > 0 && (
                  <div className="p-3 border-t border-gray-100 flex-shrink-0">
                    <div className="text-center">
                      <p className="text-xs text-gray-500 mb-1">
                        {rapidFireMode 
                          ? `${selectedPrompts.size}/${prompts.length} insights selected`
                          : `${prompts.length} AI insights available`
                        }
                      </p>
                      <div className="flex justify-center">
                        <div className="flex space-x-1">
                          {[...Array(Math.min(prompts.length, 5))].map((_, i) => (
                            <div 
                              key={i} 
                              className={`w-1 h-1 rounded-full ${
                                rapidFireMode ? 'bg-orange-400' : 'bg-blue-400'
                              }`}
                            ></div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'chat' && csvData && (
          <CSVChat csvData={csvData} columns={columns} />
        )}
      </main>
    </div>
  );
}

export default App;