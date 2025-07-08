export interface CSVData {
  headers: string[];
  rows: Record<string, any>[];
}

export interface DataColumn {
  name: string;
  type: 'string' | 'number' | 'date';
  values: any[];
  uniqueCount: number;
  nullCount: number;
}

export interface AIPrompt {
  id: string;
  title: string;
  description: string;
  chartType: 'bar' | 'line' | 'pie' | 'area' | 'scatter' | 'donut' | 'radar' | 'funnel' | 'treemap' | 'heatmap' | 'waterfall' | 'gauge' | 'bubble' | 'candlestick' | 'violin';
  xAxis?: string;
  yAxis?: string;
  groupBy?: string;
  metrics: string[];
  filters?: Record<string, any>;
}

export interface ChartConfig {
  id: string;
  title: string;
  type: 'bar' | 'line' | 'pie' | 'area' | 'scatter' | 'donut' | 'radar' | 'funnel' | 'treemap' | 'heatmap' | 'waterfall' | 'gauge' | 'bubble' | 'candlestick' | 'violin';
  data: any[];
  config: {
    xKey?: string;
    yKey?: string;
    dataKey?: string;
    nameKey?: string;
    valueKey?: string;
  };
}

export interface DashboardTheme {
  id: string;
  name: string;
  background: string;
  cardBackground: string;
  textColor: string;
  accentColor: string;
  chartColors: string[];
  borderColor: string;
}