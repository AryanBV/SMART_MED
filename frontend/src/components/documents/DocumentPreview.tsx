import React from 'react';
import { FileText, X } from 'lucide-react';

interface DocumentPreviewProps {
  file: File;
  onRemove: () => void;
  previewUrl?: string;
}

const DocumentPreview: React.FC<DocumentPreviewProps> = ({ file, onRemove, previewUrl }) => {
  const isImage = file.type.startsWith('image/');

  return (
    <div className="relative border rounded-lg p-4 bg-gray-50">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <FileText className="h-8 w-8 text-blue-500" />
          <div>
            <p className="text-sm font-medium text-gray-900">{file.name}</p>
            <p className="text-xs text-gray-500">
              {(file.size / (1024 * 1024)).toFixed(2)} MB
            </p>
          </div>
        </div>
        <button
          onClick={onRemove}
          className="p-1 rounded-full hover:bg-gray-200"
          aria-label="Remove file"
        >
          <X className="h-5 w-5 text-gray-500" />
        </button>
      </div>

      {isImage && previewUrl && (
        <div className="mt-4">
          <img
            src={previewUrl}
            alt="Document preview"
            className="max-w-full h-auto rounded-md"
          />
        </div>
      )}
    </div>
  );
};

export default DocumentPreview;