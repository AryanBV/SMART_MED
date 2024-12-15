import React, { useState } from 'react';
import { Upload } from 'lucide-react';
import DocumentPreview from './DocumentPreview';
import ExtractedDataView from './ExtractedDataView';
import { documentService } from '../../services/api';


interface DocumentUploadProps {
  onUploadComplete: (data: any) => void;
}

const DocumentUpload: React.FC<DocumentUploadProps> = ({ onUploadComplete }) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string>("");
  const [extractedData, setExtractedData] = useState<any>(null);


  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (validateFile(selectedFile)) {
        setFile(selectedFile);
        setError("");
      } else {
        setError("Please upload a valid document (PDF, JPG, PNG) under 5MB");
        setFile(null);
      }
    }
  };

  const validateFile = (file: File): boolean => {
    const validTypes = ['application/pdf', 'image/jpeg', 'image/png'];
    const maxSize = 5 * 1024 * 1024; // 5MB
    return validTypes.includes(file.type) && file.size <= maxSize;
  };

  const handleUpload = async () => {
    if (!file) return;

    try {
      setUploading(true);
      setError("");
      
      const result = await documentService.uploadDocument(file, '1'); // Replace with actual patientId
      
      if (result.success) {
        const extractedData = result.data?.extractedData || result.extractedData;
        setExtractedData(extractedData);
        onUploadComplete(extractedData);
      } else {
        throw new Error(result.message || 'Upload failed');
      }
      
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Upload failed';
      setError(errorMessage);
      setExtractedData(null);
    } finally {
      setUploading(false);
    }
  };
  

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
        <input
          type="file"
          id="file-upload"
          className="hidden"
          onChange={handleFileSelect}
          accept=".pdf,.jpg,.jpeg,.png"
        />
        
        {!file ? (
          <label htmlFor="file-upload" className="cursor-pointer">
            <div className="flex flex-col items-center">
              <Upload className="h-12 w-12 text-gray-400" />
              <p className="mt-2 text-sm text-gray-600">
                Click to upload or drag and drop
              </p>
              <p className="text-xs text-gray-500">
                PDF, JPG, PNG up to 5MB
              </p>
            </div>
          </label>
        ) : (
          <div className="space-y-4">
            <DocumentPreview
              file={file}
              onRemove={() => {
                setFile(null);
                setError("");
                setExtractedData(null);
              }}
              previewUrl={file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined}
            />
            
            <button
              onClick={handleUpload}
              disabled={uploading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {uploading ? 'Processing...' : 'Upload Document'}
            </button>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-500 rounded">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {extractedData && (
        <ExtractedDataView
          data={extractedData}
          onAccept={(data) => {
            onUploadComplete(data);
          }}
          onEdit={(field, value) => {
            setExtractedData((prev: Record<string, any>) => ({
              ...prev,
              [field]: value
            }));
          }}
        />
      )}
    </div>
  );
};

export default DocumentUpload;