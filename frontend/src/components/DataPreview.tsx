import React from 'react';
import { CSVData, DataColumn } from '../types';
import { BarChart3, Hash, Type, Calendar } from 'lucide-react';

interface DataPreviewProps {
  data: CSVData;
  columns: DataColumn[];
}

const DataPreview: React.FC<DataPreviewProps> = ({ data, columns }) => {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'number':
        return <Hash className="h-4 w-4 text-green-600" />;
      case 'date':
        return <Calendar className="h-4 w-4 text-blue-600" />;
      default:
        return <Type className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center mb-6">
        <BarChart3 className="h-6 w-6 text-blue-600 mr-2" />
        <h2 className="text-xl font-semibold">Data Overview</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">Total Rows</p>
          <p className="text-2xl font-bold text-gray-900">{data.rows.length}</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">Total Columns</p>
          <p className="text-2xl font-bold text-gray-900">{data.headers.length}</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">Numeric Columns</p>
          <p className="text-2xl font-bold text-gray-900">
            {columns.filter(col => col.type === 'number').length}
          </p>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-4">Column Analysis</h3>
        <div className="grid gap-3">
          {columns.map((column) => (
            <div key={column.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                {getTypeIcon(column.type)}
                <div>
                  <p className="font-medium">{column.name}</p>
                  <p className="text-sm text-gray-600 capitalize">{column.type}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Unique: {column.uniqueCount}</p>
                {column.nullCount > 0 && (
                  <p className="text-sm text-red-600">Null: {column.nullCount}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Data Preview</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg">
            <thead className="bg-gray-50">
              <tr>
                {data.headers.map((header) => (
                  <th key={header} className="px-4 py-2 text-left text-sm font-medium text-gray-900 border-b">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.rows.slice(0, 5).map((row, index) => (
                <tr key={index} className="border-b">
                  {data.headers.map((header) => (
                    <td key={header} className="px-4 py-2 text-sm text-gray-900">
                      {row[header] || '-'}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {data.rows.length > 5 && (
          <p className="text-sm text-gray-600 mt-2">
            Showing first 5 rows of {data.rows.length} total rows
          </p>
        )}
      </div>
    </div>
  );
};

export default DataPreview;