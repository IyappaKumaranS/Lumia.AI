import Papa from 'papaparse';
import { CSVData, DataColumn } from '../types';

export const parseCSV = (file: File): Promise<CSVData> => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.errors.length > 0) {
          reject(new Error(results.errors[0].message));
          return;
        }

        const headers = results.meta.fields || [];
        const rows = results.data as Record<string, any>[];

        // Filter out completely empty rows
        const validRows = rows.filter(row => 
          Object.values(row).some(val => val !== null && val !== '' && val !== undefined)
        );

        resolve({
          headers,
          rows: validRows
        });
      },
      error: (error) => {
        reject(error);
      }
    });
  });
};

export const analyzeColumns = (data: CSVData): DataColumn[] => {
  return data.headers.map(header => {
    const allValues = data.rows.map(row => row[header]);
    const values = allValues.filter(val => val !== null && val !== '' && val !== undefined);
    
    // Safe numeric check
    const numericValues = values.filter(val => {
      const num = Number(val);
      return !isNaN(num) && isFinite(num) && val !== '';
    });
    
    const isNumeric = values.length > 0 && numericValues.length > values.length * 0.7;
    
    // Safe date check
    const dateValues = values.filter(val => {
      try {
        const dateStr = String(val).trim();
        if (dateStr.length < 4) return false;
        
        const date = new Date(dateStr);
        return !isNaN(date.getTime()) && 
               date.getFullYear() > 1900 && 
               date.getFullYear() < 2100;
      } catch {
        return false;
      }
    });
    
    const isDate = values.length > 0 && dateValues.length > values.length * 0.5;

    let type: 'string' | 'number' | 'date' = 'string';
    if (isNumeric) type = 'number';
    else if (isDate) type = 'date';

    // Safe unique count calculation
    const uniqueValues = new Set(values.map(val => String(val).trim()));
    
    return {
      name: header,
      type,
      values: values,
      uniqueCount: uniqueValues.size,
      nullCount: allValues.length - values.length
    };
  });
};