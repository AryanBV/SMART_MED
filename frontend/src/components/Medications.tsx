import React, { useState } from 'react';
import { Plus, Calendar, Clock, AlertCircle } from 'lucide-react';
import { Card } from './ui/card';

interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  schedule: string;
  nextDose: string;
  status: 'active' | 'completed' | 'pending';
}

const Medications: React.FC = () => {
  const [medications] = useState<Medication[]>([
    {
      id: '1',
      name: 'Metformin',
      dosage: '500mg',
      frequency: 'Twice daily',
      schedule: 'Morning and Evening',
      nextDose: '8:00 PM',
      status: 'active'
    },
    {
      id: '2',
      name: 'Insulin',
      dosage: '10 units',
      frequency: 'Before meals',
      schedule: 'Three times daily',
      nextDose: '1:00 PM',
      status: 'active'
    }
  ]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Current Medications</h2>
        <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Add Medication
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {medications.map((medication) => (
          <Card key={medication.id} className="p-4">
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{medication.name}</h3>
                  <p className="text-sm text-gray-500">{medication.dosage}</p>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  medication.status === 'active' 
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {medication.status}
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="w-4 h-4 mr-2" />
                  {medication.frequency}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="w-4 h-4 mr-2" />
                  Next dose: {medication.nextDose}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  {medication.schedule}
                </div>
              </div>

              <div className="pt-4 flex justify-end space-x-2 border-t">
                <button className="text-sm text-blue-600 hover:text-blue-800">
                  Edit
                </button>
                <button className="text-sm text-red-600 hover:text-red-800">
                  Remove
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Medications;