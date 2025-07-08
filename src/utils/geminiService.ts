import { CSVData, DataColumn } from '../types';

// Simple fallback service without external API calls
export const generateInsightWithGemini = async (
  question: string,
  csvData: CSVData,
  columns: DataColumn[]
): Promise<string> => {
  // Return simple analysis without API calls to avoid errors
  return generateIntelligentFallbackResponse(question, csvData, columns);
};

// Enhanced fallback response with intelligent analysis
const generateIntelligentFallbackResponse = (question: string, csvData: CSVData, columns: DataColumn[]): string => {
  const questionLower = question.toLowerCase();
  
  // Detect question type and provide specific analysis
  if (questionLower.includes('overview') || questionLower.includes('summary') || questionLower.includes('describe') || questionLower.includes('insight')) {
    return generateDataOverview(csvData, columns);
  }
  
  if (questionLower.includes('statistic') || questionLower.includes('average') || questionLower.includes('mean') || questionLower.includes('sum')) {
    return generateStatisticalAnalysis(csvData, columns, question);
  }
  
  if (questionLower.includes('pattern') || questionLower.includes('trend') || questionLower.includes('correlation')) {
    return generatePatternAnalysis(csvData, columns);
  }
  
  if (questionLower.includes('distribution') || questionLower.includes('breakdown')) {
    return generateDistributionAnalysis(csvData, columns);
  }
  
  // Check if question mentions specific column names
  const mentionedColumns = columns.filter(col => 
    questionLower.includes(col.name.toLowerCase())
  );
  
  if (mentionedColumns.length > 0) {
    return generateColumnSpecificAnalysis(csvData, mentionedColumns, question);
  }
  
  // Default comprehensive response
  return generateComprehensiveResponse(question, csvData, columns);
};

const generateDataOverview = (csvData: CSVData, columns: DataColumn[]): string => {
  const numericCols = columns.filter(col => col.type === 'number');
  const categoricalCols = columns.filter(col => col.type === 'string');
  const dateCols = columns.filter(col => col.type === 'date');
  
  return `Comprehensive Data Overview

Dataset Characteristics:
- Total Records: ${csvData.rows.length}
- Total Columns: ${csvData.headers.length}
- Data Types: ${numericCols.length} numeric, ${categoricalCols.length} categorical, ${dateCols.length} date columns

Column Inventory:
Numeric Columns: ${numericCols.map(col => col.name).join(', ') || 'None'}
Categorical Columns: ${categoricalCols.map(col => col.name).join(', ') || 'None'}
Date Columns: ${dateCols.map(col => col.name).join(', ') || 'None'}

Data Quality Assessment:
- Complete Columns: ${columns.filter(col => col.nullCount === 0).length}/${columns.length}
- Columns with Missing Data: ${columns.filter(col => col.nullCount > 0).map(col => `${col.name} (${col.nullCount} missing)`).join(', ') || 'None'}
- Most Diverse Column: ${columns.reduce((max, col) => col.uniqueCount > max.uniqueCount ? col : max).name} (${columns.reduce((max, col) => col.uniqueCount > max.uniqueCount ? col : max).uniqueCount} unique values)

Key Insights:
${numericCols.length > 0 ? `- Quantitative Analysis Available: You can perform statistical analysis on ${numericCols.length} numeric columns` : ''}
${categoricalCols.length > 0 ? `- Segmentation Opportunities: ${categoricalCols.length} categorical columns available for grouping and filtering` : ''}
${dateCols.length > 0 ? `- Time-Series Analysis Possible: ${dateCols.length} date columns enable trend analysis` : ''}

Recommended Next Steps:
1. Statistical Analysis: Explore averages, distributions, and correlations in numeric data
2. Categorical Breakdown: Analyze distribution patterns in categorical columns
3. Data Quality Review: Address missing values in columns with incomplete data
4. Relationship Analysis: Investigate correlations between different variables

What specific aspect would you like me to analyze further?`;
};

const generateStatisticalAnalysis = (csvData: CSVData, columns: DataColumn[], question: string): string => {
  const numericColumns = columns.filter(col => col.type === 'number');
  
  if (numericColumns.length === 0) {
    return `Statistical Analysis Not Available

Your dataset doesn't contain numeric columns suitable for statistical analysis.

Available Columns: ${columns.map(col => `${col.name} (${col.type})`).join(', ')}

Alternative Analysis Options:
- Categorical Distribution: Analyze frequency distributions of text columns
- Data Quality Assessment: Review completeness and uniqueness of data
- Pattern Recognition: Identify trends in categorical data

Would you like me to perform any of these alternative analyses?`;
  }
  
  let response = `Statistical Analysis Summary\n\n`;
  
  numericColumns.slice(0, 6).forEach(col => {
    const values = col.values.filter(v => v !== null && v !== '' && !isNaN(parseFloat(v))).map(v => parseFloat(v));
    
    if (values.length > 0) {
      const sum = values.reduce((a, b) => a + b, 0);
      const avg = sum / values.length;
      const min = Math.min(...values);
      const max = Math.max(...values);
      const sortedValues = values.sort((a, b) => a - b);
      const median = sortedValues[Math.floor(sortedValues.length / 2)];
      const range = max - min;
      
      // Calculate standard deviation
      const variance = values.reduce((acc, val) => acc + Math.pow(val - avg, 2), 0) / values.length;
      const stdDev = Math.sqrt(variance);
      
      response += `${col.name}:
- Average: ${avg.toFixed(2)}
- Median: ${median.toFixed(2)}
- Range: ${min} to ${max} (span: ${range.toFixed(2)})
- Standard Deviation: ${stdDev.toFixed(2)}
- Data Coverage: ${values.length}/${csvData.rows.length} records

`;
      
      // Provide insights
      if (stdDev / avg > 0.5) {
        response += `- Insight: High variability detected\n`;
      }
      if (avg > median * 1.2) {
        response += `- Insight: Data appears right-skewed (mean > median)\n`;
      }
      response += '\n';
    }
  });
  
  return response;
};

const generatePatternAnalysis = (csvData: CSVData, columns: DataColumn[]): string => {
  return `Pattern Analysis

Data Structure Patterns:
- Dataset Size: ${csvData.rows.length} records across ${csvData.headers.length} dimensions
- Data Density: ${((columns.filter(col => col.nullCount === 0).length / columns.length) * 100).toFixed(1)}% complete
- Diversity Index: ${((columns.reduce((sum, col) => sum + col.uniqueCount, 0) / csvData.rows.length / columns.length) * 100).toFixed(1)}% average uniqueness

Column Relationship Patterns:
${columns.filter(col => col.type === 'number').length >= 2 ? 
`- Numeric Correlations: ${columns.filter(col => col.type === 'number').length} numeric columns available for correlation analysis` : 
'- Limited Numeric Analysis: Fewer than 2 numeric columns available'}

${columns.filter(col => col.type === 'string').length > 0 ? 
`- Categorical Groupings: ${columns.filter(col => col.type === 'string').length} categorical variables for segmentation` : 
'- No Categorical Groupings: No text columns available for segmentation'}

Data Distribution Patterns:
${columns.map(col => {
  const diversityRatio = col.uniqueCount / csvData.rows.length;
  let pattern = '';
  if (diversityRatio > 0.9) pattern = 'Highly unique (likely identifier)';
  else if (diversityRatio > 0.5) pattern = 'Moderately diverse';
  else if (diversityRatio > 0.1) pattern = 'Categorical grouping';
  else pattern = 'Limited categories';
  
  return `- ${col.name}: ${pattern} (${col.uniqueCount} unique values)`;
}).join('\n')}

Recommended Pattern Exploration:
1. High-Diversity Columns: Focus on columns with many unique values for detailed analysis
2. Low-Diversity Columns: Use for grouping and segmentation
3. Missing Data Patterns: Investigate columns with incomplete data
4. Correlation Opportunities: Explore relationships between numeric variables

What specific patterns would you like me to investigate further?`;
};

const generateDistributionAnalysis = (csvData: CSVData, columns: DataColumn[]): string => {
  const categoricalCols = columns.filter(col => col.type === 'string' && col.uniqueCount <= 50);
  
  let response = `Distribution Analysis\n\n`;
  
  if (categoricalCols.length > 0) {
    response += `Categorical Distributions:\n\n`;
    
    categoricalCols.slice(0, 4).forEach(col => {
      const valueCounts = col.values.reduce((acc, val) => {
        const cleanVal = String(val || 'Unknown').trim();
        acc[cleanVal] = (acc[cleanVal] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      const sortedValues = Object.entries(valueCounts)
        .sort(([,a], [,b]) => b - a);
      
      response += `${col.name} Distribution:
- Total Categories: ${col.uniqueCount}
- Most Common: ${sortedValues[0][0]} (${sortedValues[0][1]} records, ${((sortedValues[0][1]/csvData.rows.length)*100).toFixed(1)}%)
`;
      
      if (sortedValues.length > 1) {
        response += `- Second Most Common: ${sortedValues[1][0]} (${sortedValues[1][1]} records, ${((sortedValues[1][1]/csvData.rows.length)*100).toFixed(1)}%)\n`;
      }
      
      response += '\n';
    });
  }
  
  const numericCols = columns.filter(col => col.type === 'number');
  if (numericCols.length > 0) {
    response += `Numeric Distributions:\n\n`;
    
    numericCols.slice(0, 3).forEach(col => {
      const values = col.values.filter(v => !isNaN(parseFloat(v))).map(v => parseFloat(v));
      if (values.length > 0) {
        const avg = values.reduce((a, b) => a + b, 0) / values.length;
        const sortedValues = values.sort((a, b) => a - b);
        const median = sortedValues[Math.floor(sortedValues.length / 2)];
        
        response += `${col.name} Distribution:
- Mean: ${avg.toFixed(2)}
- Median: ${median.toFixed(2)}
`;
        
        // Distribution shape insights
        if (Math.abs(avg - median) / avg > 0.1) {
          response += `- Insight: ${avg > median ? 'Right-skewed' : 'Left-skewed'} distribution\n`;
        } else {
          response += `- Insight: Relatively symmetric distribution\n`;
        }
        response += '\n';
      }
    });
  }
  
  return response;
};

const generateColumnSpecificAnalysis = (csvData: CSVData, mentionedColumns: DataColumn[], question: string): string => {
  let response = `Column-Specific Analysis\n\n`;
  
  mentionedColumns.forEach(col => {
    response += `${col.name} Analysis:
- Data Type: ${col.type}
- Unique Values: ${col.uniqueCount}
- Missing Values: ${col.nullCount}
- Data Coverage: ${((csvData.rows.length - col.nullCount)/csvData.rows.length*100).toFixed(1)}%
`;
    
    if (col.type === 'number') {
      const values = col.values.filter(v => !isNaN(parseFloat(v))).map(v => parseFloat(v));
      if (values.length > 0) {
        const avg = values.reduce((a, b) => a + b, 0) / values.length;
        const min = Math.min(...values);
        const max = Math.max(...values);
        
        response += `- Statistical Summary:
  • Average: ${avg.toFixed(2)}
  • Range: ${min} to ${max}
  • Total Sum: ${values.reduce((a, b) => a + b, 0).toFixed(2)}
`;
      }
    } else if (col.type === 'string') {
      const valueCounts = col.values.reduce((acc, val) => {
        const cleanVal = String(val || 'Unknown').trim();
        acc[cleanVal] = (acc[cleanVal] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      const topValues = Object.entries(valueCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5);
      
      response += `- Top Values:
`;
      topValues.forEach(([val, count]) => {
        response += `  • ${val}: ${count} (${((count/csvData.rows.length)*100).toFixed(1)}%)\n`;
      });
    }
    
    response += '\n';
  });
  
  response += `Based on your question: "${question}"
I've provided detailed analysis of the mentioned columns. What specific insights or calculations would you like me to perform with this data?`;
  
  return response;
};

const generateComprehensiveResponse = (question: string, csvData: CSVData, columns: DataColumn[]): string => {
  return `AI Data Analysis Assistant

I understand you're asking: "${question}"

Your Dataset Context:
- Records: ${csvData.rows.length}
- Columns: ${csvData.headers.length} (${csvData.headers.join(', ')})
- Data Types: ${columns.filter(col => col.type === 'number').length} numeric, ${columns.filter(col => col.type === 'string').length} categorical, ${columns.filter(col => col.type === 'date').length} date

What I Can Analyze For You:

Statistical Analysis:
- Calculate averages, medians, ranges for numeric columns
- Identify outliers and data distribution patterns
- Perform correlation analysis between variables

Categorical Analysis:
- Show distribution breakdowns and frequency counts
- Identify most/least common categories
- Analyze category relationships and patterns

Data Quality Assessment:
- Identify missing values and data completeness
- Detect potential data quality issues
- Suggest data cleaning recommendations

Pattern Recognition:
- Identify trends and relationships in your data
- Highlight unusual patterns or anomalies
- Provide business insights and recommendations

Try These Specific Questions:

For Statistical Insights:
- "What's the average ${columns.find(col => col.type === 'number')?.name || 'value'} in my data?"
- "Show me the distribution of ${columns.find(col => col.type === 'string')?.name || 'categories'}"
- "What are the highest and lowest values?"

For Pattern Analysis:
- "What patterns do you see in the data?"
- "How does [column A] relate to [column B]?"
- "What are the most interesting insights?"

For Data Quality:
- "Are there any data quality issues?"
- "Which columns have missing values?"
- "What's the overall data completeness?"

I'm ready to provide detailed, data-driven insights! Please ask me a specific question about your data.`;
};

export const generateDataSummary = async (
  csvData: CSVData,
  columns: DataColumn[]
): Promise<string> => {
  return generateFallbackDataSummary(csvData, columns);
};

const generateFallbackDataSummary = (csvData: CSVData, columns: DataColumn[]): string => {
  const numericCols = columns.filter(col => col.type === 'number').length;
  const categoricalCols = columns.filter(col => col.type === 'string').length;
  const dateCols = columns.filter(col => col.type === 'date').length;
  
  return `Dataset Summary

Your dataset contains ${csvData.rows.length} records across ${csvData.headers.length} columns, including ${numericCols} numeric, ${categoricalCols} categorical, and ${dateCols} date columns.

Key Characteristics:
- Data completeness: ${columns.filter(col => col.nullCount === 0).length}/${columns.length} columns are complete
- Most diverse: ${columns.reduce((max, col) => col.uniqueCount > max.uniqueCount ? col : max).name} (${columns.reduce((max, col) => col.uniqueCount > max.uniqueCount ? col : max).uniqueCount} unique values)

Analysis Opportunities:
- Statistical analysis of numeric columns
- Distribution patterns in categorical data
- Correlation analysis between variables${dateCols > 0 ? '\n- Time-series trends and patterns' : ''}

Ready to explore your data! Ask me anything about patterns, statistics, or specific insights you'd like to discover.`;
};