import React from 'react';
import { Check, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ExtractedData {
  patient?: {
    name?: string;
    age?: string;
    gender?: string;
    id?: string;
  };
  vitals?: {
    weight?: string;
    bp?: string;
  };
  conditions?: string[];
  medications?: Array<{
    name: string;
    dosage?: string;
    frequency?: string;
    timing?: string;
  }>;
  labValues?: {
    hba1c?: string;
    bloodSugar?: string;
    pp?: string;
    fasting?: string;
  };
  followUp?: string;
}

interface ExtractedDataViewProps {
  data: ExtractedData;
  onAccept: (data: ExtractedData) => void;
  onEdit: (field: string, value: any) => void;
}

const ExtractedDataView: React.FC<ExtractedDataViewProps> = ({
  data,
  onAccept,
  onEdit,
}) => {
  const renderSection = (title: string, content: React.ReactNode) => (
    <div className="mb-4">
      <h4 className="text-sm font-medium text-gray-700 mb-2">{title}</h4>
      {content}
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">
          Extracted Information
        </h3>
        <button
          onClick={() => onAccept(data)}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
        >
          Accept & Fill Form
        </button>
      </div>

      {data.patient && renderSection('Patient Information',
        <div className="grid grid-cols-2 gap-2 text-sm">
          {Object.entries(data.patient).map(([key, value]) => (
            <div key={key} className="flex justify-between">
              <span className="text-gray-600 capitalize">{key}:</span>
              <span className="font-medium">{value}</span>
            </div>
          ))}
        </div>
      )}

      {data.medications && renderSection('Medications',
        <div className="space-y-2">
          {data.medications.map((med, index) => (
            <div key={index} className="bg-gray-50 p-2 rounded">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">{med.name}</p>
                  <p className="text-sm text-gray-600">
                    {[med.dosage, med.frequency, med.timing]
                      .filter(Boolean)
                      .join(' • ')}
                  </p>
                </div>
                <button
                  onClick={() => onEdit(`medications.${index}`, med)}
                  className="text-blue-600 text-sm hover:underline"
                >
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {data.labValues && renderSection('Lab Values',
        <div className="grid grid-cols-2 gap-2 text-sm">
          {Object.entries(data.labValues).map(([key, value]) => (
            <div key={key} className="flex justify-between">
              <span className="text-gray-600 capitalize">{key}:</span>
              <span className="font-medium">{value}</span>
            </div>
          ))}
        </div>
      )}

      {data.followUp && renderSection('Follow Up',
        <p className="text-sm font-medium">{data.followUp}</p>
      )}

      {(!data.patient && !data.medications && !data.labValues) && (
        <div className="rounded-lg border-l-4 border-red-500 bg-red-50 p-4">
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <div className="ml-3">
              <p className="text-sm text-red-700">
                No data could be extracted from the document. Please check the document quality or enter information manually.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExtractedDataView;