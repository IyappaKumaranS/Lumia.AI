import { CSVData, AIPrompt, ChartConfig } from '../types';

export const generateChartConfig = (data: CSVData, prompt: AIPrompt): ChartConfig => {
  let chartData: any[] = [];
  
  try {
    switch (prompt.chartType) {
      case 'bar':
      case 'line':
        if (prompt.xAxis && prompt.yAxis) {
          // Group and aggregate data for categorical x-axis
          const groupedData = data.rows.reduce((acc, row) => {
            const xValue = String(row[prompt.xAxis!] || 'Unknown').trim();
            const yValue = parseFloat(row[prompt.yAxis!]) || 0;
            
            if (!acc[xValue]) {
              acc[xValue] = [];
            }
            acc[xValue].push(yValue);
            return acc;
          }, {} as Record<string, number[]>);
          
          chartData = Object.entries(groupedData).map(([key, values]) => ({
            [prompt.xAxis!]: key,
            [prompt.yAxis!]: values.reduce((sum, val) => sum + val, 0) / values.length // Average
          })).slice(0, 20); // Limit to 20 categories for readability
        }
        break;
        
      case 'pie':
      case 'donut':
        if (prompt.groupBy) {
          const groupCounts = data.rows.reduce((acc, row) => {
            const key = String(row[prompt.groupBy!] || 'Unknown').trim();
            acc[key] = (acc[key] || 0) + 1;
            return acc;
          }, {} as Record<string, number>);
          
          // Sort by count and take top 10 for readability
          const sortedEntries = Object.entries(groupCounts)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 10);
          
          chartData = sortedEntries.map(([name, value]) => ({
            name: name || 'Unknown',
            value
          }));
        }
        break;
        
      case 'scatter':
        if (prompt.xAxis && prompt.yAxis) {
          chartData = data.rows
            .map(row => {
              const x = parseFloat(row[prompt.xAxis!]);
              const y = parseFloat(row[prompt.yAxis!]);
              return { x: isNaN(x) ? 0 : x, y: isNaN(y) ? 0 : y };
            })
            .filter(point => point.x !== 0 || point.y !== 0)
            .slice(0, 500); // Limit points for performance
        }
        break;

      case 'bubble':
        if (prompt.metrics.length >= 3) {
          chartData = data.rows
            .map((row, index) => {
              const x = parseFloat(row[prompt.metrics[0]]) || index;
              const y = parseFloat(row[prompt.metrics[1]]) || 0;
              const z = parseFloat(row[prompt.metrics[2]]) || 10;
              return { 
                x, 
                y, 
                z, 
                name: row[prompt.xAxis!] || `Point ${index + 1}`,
                [prompt.metrics[0]]: x,
                [prompt.metrics[1]]: y,
                [prompt.metrics[2]]: z
              };
            })
            .slice(0, 100);
        }
        break;

      case 'radar':
        if (prompt.metrics.length > 0) {
          // Create radar data with multiple metrics
          const radarData = data.rows.slice(0, 6).map((row, index) => {
            const dataPoint: any = {
              subject: row[prompt.xAxis!] || `Item ${index + 1}`
            };
            
            prompt.metrics.forEach(metric => {
              const value = parseFloat(row[metric]);
              dataPoint[metric] = isNaN(value) ? 0 : value;
            });
            
            return dataPoint;
          });
          
          chartData = radarData;
        }
        break;

      case 'heatmap':
        if (prompt.groupBy) {
          // Create heatmap data
          const heatmapData = data.rows.slice(0, 100).map((row, index) => {
            const value = parseFloat(row[prompt.metrics[0]]) || Math.random() * 100;
            return {
              id: index,
              value,
              category: row[prompt.groupBy!] || `Category ${index % 10}`,
              x: index % 10,
              y: Math.floor(index / 10)
            };
          });
          
          chartData = heatmapData;
        }
        break;

      case 'gauge':
        if (prompt.metrics.length > 0) {
          const values = data.rows.map(row => parseFloat(row[prompt.metrics[0]]) || 0);
          const avgValue = values.reduce((sum, val) => sum + val, 0) / values.length;
          const maxValue = Math.max(...values);
          const percentage = (avgValue / maxValue) * 100;
          
          chartData = [{ value: percentage, max: 100 }];
        }
        break;

      case 'waterfall':
        if (prompt.xAxis && prompt.yAxis) {
          let cumulative = 0;
          chartData = data.rows.slice(0, 15).map(row => {
            const value = parseFloat(row[prompt.yAxis!]) || 0;
            cumulative += value;
            return {
              [prompt.xAxis!]: row[prompt.xAxis!],
              [prompt.yAxis!]: value,
              cumulative
            };
          });
        }
        break;

      case 'candlestick':
        if (prompt.metrics.length >= 4) {
          chartData = data.rows.slice(0, 50).map(row => ({
            date: row[prompt.xAxis!] || new Date().toISOString(),
            open: parseFloat(row[prompt.metrics[0]]) || 0,
            high: parseFloat(row[prompt.metrics[1]]) || 0,
            low: parseFloat(row[prompt.metrics[2]]) || 0,
            close: parseFloat(row[prompt.metrics[3]]) || 0
          }));
        }
        break;

      case 'violin':
        if (prompt.xAxis && prompt.yAxis) {
          // Create distribution data for violin plot
          const groupedData = data.rows.reduce((acc, row) => {
            const category = String(row[prompt.xAxis!] || 'Unknown');
            const value = parseFloat(row[prompt.yAxis!]) || 0;
            
            if (!acc[category]) {
              acc[category] = [];
            }
            acc[category].push(value);
            return acc;
          }, {} as Record<string, number[]>);
          
          chartData = Object.entries(groupedData).map(([category, values]) => {
            const sorted = values.sort((a, b) => a - b);
            const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
            const median = sorted[Math.floor(sorted.length / 2)];
            
            return {
              [prompt.xAxis!]: category,
              [prompt.yAxis!]: mean,
              median,
              min: Math.min(...values),
              max: Math.max(...values)
            };
          });
        }
        break;
        
      case 'area':
        if (prompt.xAxis && prompt.metrics.length > 0) {
          const groupedData = data.rows.reduce((acc, row) => {
            const xValue = String(row[prompt.xAxis!] || 'Unknown').trim();
            
            if (!acc[xValue]) {
              acc[xValue] = {};
              prompt.metrics.forEach(metric => {
                acc[xValue][metric] = [];
              });
            }
            
            prompt.metrics.forEach(metric => {
              const value = parseFloat(row[metric]) || 0;
              acc[xValue][metric].push(value);
            });
            
            return acc;
          }, {} as Record<string, Record<string, number[]>>);
          
          chartData = Object.entries(groupedData).map(([key, metrics]) => {
            const dataPoint: any = { [prompt.xAxis!]: key };
            Object.entries(metrics).forEach(([metric, values]) => {
              dataPoint[metric] = values.reduce((sum, val) => sum + val, 0) / values.length;
            });
            return dataPoint;
          }).slice(0, 15);
        }
        break;

      case 'funnel':
        if (prompt.groupBy) {
          const groupCounts = data.rows.reduce((acc, row) => {
            const key = String(row[prompt.groupBy!] || 'Unknown').trim();
            acc[key] = (acc[key] || 0) + 1;
            return acc;
          }, {} as Record<string, number>);
          
          chartData = Object.entries(groupCounts)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 8)
            .map(([name, value]) => ({ name, value }));
        }
        break;

      case 'treemap':
        if (prompt.groupBy) {
          const groupCounts = data.rows.reduce((acc, row) => {
            const key = String(row[prompt.groupBy!] || 'Unknown').trim();
            acc[key] = (acc[key] || 0) + 1;
            return acc;
          }, {} as Record<string, number>);
          
          chartData = Object.entries(groupCounts).map(([name, value]) => ({
            name,
            value,
            size: value
          }));
        }
        break;
    }

    // Ensure we have valid data
    if (!chartData || chartData.length === 0) {
      // Generate sample data based on chart type
      chartData = generateSampleData(prompt.chartType);
    }

  } catch (error) {
    console.error('Error generating chart config:', error);
    chartData = generateSampleData(prompt.chartType);
  }

  return {
    id: prompt.id,
    title: prompt.title,
    type: prompt.chartType,
    data: chartData,
    config: {
      xKey: prompt.xAxis,
      yKey: prompt.yAxis,
      dataKey: prompt.metrics[0],
      nameKey: 'name',
      valueKey: 'value'
    }
  };
};

// Helper function to generate sample data when no valid data is available
const generateSampleData = (chartType: string): any[] => {
  switch (chartType) {
    case 'radar':
      return [
        { subject: 'Math', A: 120, B: 110, fullMark: 150 },
        { subject: 'Chinese', A: 98, B: 130, fullMark: 150 },
        { subject: 'English', A: 86, B: 130, fullMark: 150 },
        { subject: 'Geography', A: 99, B: 100, fullMark: 150 },
        { subject: 'Physics', A: 85, B: 90, fullMark: 150 },
        { subject: 'History', A: 65, B: 85, fullMark: 150 }
      ];
    case 'bubble':
      return Array.from({ length: 20 }, (_, i) => ({
        x: Math.random() * 100,
        y: Math.random() * 100,
        z: Math.random() * 50 + 10,
        name: `Point ${i + 1}`
      }));
    case 'heatmap':
      return Array.from({ length: 50 }, (_, i) => ({
        id: i,
        value: Math.random() * 100,
        x: i % 10,
        y: Math.floor(i / 10)
      }));
    case 'gauge':
      return [{ value: 75, max: 100 }];
    default:
      return [
        { name: 'Sample A', value: 30 },
        { name: 'Sample B', value: 45 },
        { name: 'Sample C', value: 25 }
      ];
  }
};