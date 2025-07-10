import { DataColumn, AIPrompt, CSVData } from '../types';

export const generateAIPrompts = (data: CSVData, columns: DataColumn[]): AIPrompt[] => {
  const prompts: AIPrompt[] = [];
  
  // Safe filtering with validation
  const numericColumns = columns.filter(col => col.type === 'number' && col.values.length > 0);
  const categoricalColumns = columns.filter(col => 
    col.type === 'string' && 
    col.uniqueCount > 1 && 
    col.uniqueCount <= Math.min(50, data.rows.length * 0.8) &&
    col.values.length > 0
  );
  const dateColumns = columns.filter(col => col.type === 'date' && col.values.length > 0);

  // Revenue/Sales Analysis
  const revenueCol = numericColumns.find(col => {
    const name = col.name.toLowerCase();
    return name.includes('revenue') || 
           name.includes('sales') ||
           name.includes('amount') ||
           name.includes('price') ||
           name.includes('cost') ||
           name.includes('value');
  });

  if (revenueCol && categoricalColumns.length > 0) {
    prompts.push({
      id: 'revenue-by-category',
      title: `${revenueCol.name} by ${categoricalColumns[0].name}`,
      description: `Analyze ${revenueCol.name} distribution across different ${categoricalColumns[0].name}`,
      chartType: 'bar',
      xAxis: categoricalColumns[0].name,
      yAxis: revenueCol.name,
      metrics: [revenueCol.name]
    });

    // Add donut chart variation
    prompts.push({
      id: 'revenue-donut',
      title: `${revenueCol.name} Distribution (Donut)`,
      description: `Modern donut chart showing ${revenueCol.name} by ${categoricalColumns[0].name}`,
      chartType: 'donut',
      groupBy: categoricalColumns[0].name,
      metrics: [revenueCol.name]
    });

    // Add gauge chart for performance metrics
    prompts.push({
      id: 'revenue-gauge',
      title: `${revenueCol.name} Performance Gauge`,
      description: `Gauge chart showing ${revenueCol.name} performance indicator`,
      chartType: 'gauge',
      metrics: [revenueCol.name]
    });
  }

  // Category Distribution
  if (categoricalColumns.length > 0) {
    const categoryCol = categoricalColumns[0];
    prompts.push({
      id: 'category-breakdown',
      title: `${categoryCol.name} Distribution`,
      description: `Breakdown of records by ${categoryCol.name}`,
      chartType: 'pie',
      groupBy: categoryCol.name,
      metrics: ['count']
    });

    // Add treemap variation
    prompts.push({
      id: 'category-treemap',
      title: `${categoryCol.name} Treemap`,
      description: `Hierarchical view of ${categoryCol.name} distribution`,
      chartType: 'treemap',
      groupBy: categoryCol.name,
      metrics: ['count']
    });

    // Add heatmap for categorical data
    prompts.push({
      id: 'category-heatmap',
      title: `${categoryCol.name} Heatmap`,
      description: `Intensity heatmap of ${categoryCol.name} data`,
      chartType: 'heatmap',
      groupBy: categoryCol.name,
      metrics: ['count']
    });
  }

  // Trend Analysis
  if (dateColumns.length > 0 && numericColumns.length > 0) {
    prompts.push({
      id: 'trend-analysis',
      title: `${numericColumns[0].name} Trend Over Time`,
      description: `Track ${numericColumns[0].name} changes over ${dateColumns[0].name}`,
      chartType: 'line',
      xAxis: dateColumns[0].name,
      yAxis: numericColumns[0].name,
      metrics: [numericColumns[0].name]
    });

    // Add area chart variation
    prompts.push({
      id: 'trend-area',
      title: `${numericColumns[0].name} Area Trend`,
      description: `Filled area chart showing ${numericColumns[0].name} over time`,
      chartType: 'area',
      xAxis: dateColumns[0].name,
      yAxis: numericColumns[0].name,
      metrics: [numericColumns[0].name]
    });

    // Add waterfall chart for cumulative changes
    prompts.push({
      id: 'trend-waterfall',
      title: `${numericColumns[0].name} Waterfall Analysis`,
      description: `Waterfall chart showing cumulative changes in ${numericColumns[0].name}`,
      chartType: 'waterfall',
      xAxis: dateColumns[0].name,
      yAxis: numericColumns[0].name,
      metrics: [numericColumns[0].name]
    });
  }

  // Numeric comparison with categories
  if (numericColumns.length > 0 && categoricalColumns.length > 0) {
    const numCol = numericColumns[0];
    const catCol = categoricalColumns[0];
    
    prompts.push({
      id: 'numeric-by-category',
      title: `Average ${numCol.name} by ${catCol.name}`,
      description: `Compare average ${numCol.name} across different ${catCol.name}`,
      chartType: 'bar',
      xAxis: catCol.name,
      yAxis: numCol.name,
      metrics: [numCol.name]
    });

    // Add funnel chart if appropriate
    if (catCol.uniqueCount <= 8) {
      prompts.push({
        id: 'category-funnel',
        title: `${catCol.name} Funnel Analysis`,
        description: `Funnel view of ${catCol.name} progression`,
        chartType: 'funnel',
        groupBy: catCol.name,
        metrics: ['count']
      });
    }

    // Add violin plot for distribution analysis
    prompts.push({
      id: 'distribution-violin',
      title: `${numCol.name} Distribution Shape`,
      description: `Violin plot showing ${numCol.name} distribution by ${catCol.name}`,
      chartType: 'violin',
      xAxis: catCol.name,
      yAxis: numCol.name,
      metrics: [numCol.name]
    });
  }

  // Multi-metric radar chart
  if (numericColumns.length >= 3 && categoricalColumns.length > 0) {
    prompts.push({
      id: 'multi-metric-radar',
      title: 'Multi-Metric Radar',
      description: `Radar chart comparing ${numericColumns.slice(0, 5).map(col => col.name).join(', ')}`,
      chartType: 'radar',
      xAxis: categoricalColumns[0].name,
      metrics: numericColumns.slice(0, 5).map(col => col.name)
    });
  }

  // Distribution Analysis (only if we have 2+ numeric columns)
  if (numericColumns.length >= 2) {
    prompts.push({
      id: 'distribution-analysis',
      title: `${numericColumns[0].name} vs ${numericColumns[1].name}`,
      description: `Explore the relationship between ${numericColumns[0].name} and ${numericColumns[1].name}`,
      chartType: 'scatter',
      xAxis: numericColumns[0].name,
      yAxis: numericColumns[1].name,
      metrics: [numericColumns[0].name, numericColumns[1].name]
    });

    // Add bubble chart for 3D analysis
    if (numericColumns.length >= 3) {
      prompts.push({
        id: 'bubble-analysis',
        title: `${numericColumns[0].name} vs ${numericColumns[1].name} (Bubble)`,
        description: `3D bubble chart with ${numericColumns[2].name} as size`,
        chartType: 'bubble',
        xAxis: numericColumns[0].name,
        yAxis: numericColumns[1].name,
        metrics: [numericColumns[0].name, numericColumns[1].name, numericColumns[2].name]
      });
    }
  }

  // Financial data analysis
  const financialColumns = numericColumns.filter(col => {
    const name = col.name.toLowerCase();
    return name.includes('open') || name.includes('close') || 
           name.includes('high') || name.includes('low') ||
           name.includes('volume') || name.includes('price');
  });

  if (financialColumns.length >= 4) {
    prompts.push({
      id: 'financial-candlestick',
      title: 'Financial Candlestick Chart',
      description: 'Candlestick chart for financial data analysis',
      chartType: 'candlestick',
      metrics: financialColumns.slice(0, 4).map(col => col.name)
    });
  }

  // Performance/Score Analysis
  const performanceColumns = numericColumns.filter(col => {
    const name = col.name.toLowerCase();
    return name.includes('performance') ||
           name.includes('score') ||
           name.includes('rating') ||
           name.includes('salary') ||
           name.includes('income') ||
           name.includes('grade');
  });

  if (performanceColumns.length > 0 && categoricalColumns.length > 0) {
    prompts.push({
      id: 'performance-comparison',
      title: `${performanceColumns[0].name} Analysis`,
      description: `Analyze ${performanceColumns[0].name} across different ${categoricalColumns[0].name}`,
      chartType: 'bar',
      xAxis: categoricalColumns[0].name,
      yAxis: performanceColumns[0].name,
      metrics: [performanceColumns[0].name]
    });
  }

  // Ensure we always have at least one prompt
  if (prompts.length === 0 && columns.length > 0) {
    if (categoricalColumns.length > 0) {
      prompts.push({
        id: 'basic-distribution',
        title: `${categoricalColumns[0].name} Overview`,
        description: `Basic distribution of ${categoricalColumns[0].name}`,
        chartType: 'pie',
        groupBy: categoricalColumns[0].name,
        metrics: ['count']
      });
    } else if (numericColumns.length > 0) {
      prompts.push({
        id: 'basic-numeric',
        title: `${numericColumns[0].name} Analysis`,
        description: `Basic analysis of ${numericColumns[0].name}`,
        chartType: 'bar',
        xAxis: 'index',
        yAxis: numericColumns[0].name,
        metrics: [numericColumns[0].name]
      });
    }
  }

  return prompts;
};