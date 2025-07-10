import React, { useRef } from 'react';
import { Upload, FileText, AlertCircle, CheckCircle } from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  loading: boolean;
  error: string | null;
  uploadedFileName?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, loading, error, uploadedFileName }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'text/csv') {
      onFileSelect(file);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && file.type === 'text/csv') {
      onFileSelect(file);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          loading 
            ? 'border-blue-300 bg-blue-50' 
            : uploadedFileName 
            ? 'border-green-300 bg-green-50'
            : 'border-gray-300 hover:border-blue-400'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <div className="flex flex-col items-center space-y-4">
          {loading ? (
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          ) : uploadedFileName ? (
            <CheckCircle className="h-12 w-12 text-green-500" />
          ) : (
            <Upload className="h-12 w-12 text-gray-400" />
          )}
          
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {loading 
                ? 'Processing CSV...' 
                : uploadedFileName 
                ? 'File Uploaded Successfully'
                : 'Upload CSV File'
              }
            </h3>
            
            {uploadedFileName ? (
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">Uploaded file:</p>
                <div className="inline-flex items-center px-3 py-2 bg-white border border-green-200 rounded-md">
                  <FileText className="h-4 w-4 text-green-600 mr-2" />
                  <span className="text-sm font-medium text-green-800">{uploadedFileName}</span>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-600 mb-4">
                Drag and drop your CSV file here, or click to browse
              </p>
            )}
            
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={loading}
              className={`inline-flex items-center px-4 py-2 rounded-md transition-colors ${
                uploadedFileName
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <FileText className="h-4 w-4 mr-2" />
              {uploadedFileName ? 'Upload Different File' : 'Choose File'}
            </button>
          </div>
        </div>
        
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
      
      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;