import React, { useState } from 'react';
import DocumentUpload from './documents/DocumentUpload';
import { Card, CardContent } from './ui/card';
import { FileText, Plus } from 'lucide-react';

const MedicalRecords: React.FC = () => {
  const [showUpload, setShowUpload] = useState(false);

  const handleUploadComplete = (data: any) => {
    console.log('Uploaded document data:', data);
    setShowUpload(false);
    // Handle the uploaded document data
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Medical Records</h1>
        <button
          onClick={() => setShowUpload(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Upload Document
        </button>
      </div>

      {showUpload && (
        <div className="mb-6">
          <Card>
            <CardContent className="p-6">
              <DocumentUpload onUploadComplete={handleUploadComplete} />
            </CardContent>
          </Card>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <FileText className="w-8 h-8 text-blue-500" />
              <div>
                <h3 className="font-medium">Recent Prescription</h3>
                <p className="text-sm text-gray-500">Uploaded on Dec 15, 2024</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MedicalRecords;