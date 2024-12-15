import React, { useState, useEffect } from 'react';
import { Plus, User } from 'lucide-react';
import { familyService, FamilyMemberData } from '../../services/api';
import AddFamilyMemberForm from './AddFamilyMemberForm';

interface Patient {
  patient_id: number;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  gender: string;
  email: string;
  phone: string;
}

interface FamilyMember {
  relationship_id: number;
  relative_id: number;
  first_name: string;
  last_name: string;
  relationship_type: string;
  diabetes_type: string | null;
  hba1c_level: number | null;
  blood_sugar_level: number | null;
}

interface DiabetesStats {
  total_relatives: number;
  diabetic_relatives: number;
  avg_hba1c: number | null;
  avg_blood_sugar: number | null;
}

interface ApiResponse {
  success: boolean;
  data: {
    patient: Patient;
    familyTree: FamilyMember[];
    diabetesStats: DiabetesStats;
  };
}

const FamilyTree: React.FC = () => {
  const [data, setData] = useState<ApiResponse['data'] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);

  // You might want to get this from your auth context or route params
  const patientId = "1"; // Replace with actual patient ID source

  const displayValue = (value: number | null | undefined, unit: string = '') => {
    if (value === null || value === undefined) return 'N/A';
    return `${Number(value).toFixed(1)}${unit}`;
  };

  const calculateAge = (dateOfBirth: string) => {
    const diff = Date.now() - new Date(dateOfBirth).getTime();
    return Math.floor(diff / 31557600000);
  };

  const fetchFamilyTree = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching family tree for patient:', patientId);
      const response = await familyService.getFamilyTree(patientId);
      console.log('Family tree response:', response);

      if (response.success && response.data) {
        setData(response.data);
      } else {
        setError(response.error || 'Failed to fetch family tree');
      }
    } catch (error) {
      console.error('Error in fetchFamilyTree:', error);
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleAddMember = async (memberData: FamilyMemberData) => {
    try {
      console.log('Adding new family member:', memberData);
      const response = await familyService.addFamilyMember(patientId, memberData);
      console.log('Add family member response:', response);

      if (response.success) {
        setIsAddMemberOpen(false);
        await fetchFamilyTree();
      } else {
        setError(response.error || 'Failed to add family member');
      }
    } catch (error) {
      console.error('Error adding family member:', error);
      setError(error instanceof Error ? error.message : 'Failed to add family member');
    }
  };

  useEffect(() => {
    fetchFamilyTree();
  }, [patientId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (error || !data || !data.patient) {
    return (
      <div className="flex flex-col items-center justify-center h-64 bg-white rounded-lg shadow p-6">
        <div className="text-red-500 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p className="text-center text-lg font-semibold">{error || 'Failed to load data'}</p>
        </div>
        <button 
          onClick={fetchFamilyTree}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  const stats = {
    total_relatives: data.diabetesStats?.total_relatives || 0,
    diabetic_relatives: data.diabetesStats?.diabetic_relatives || 0,
    avg_hba1c: data.diabetesStats?.avg_hba1c,
    avg_blood_sugar: data.diabetesStats?.avg_blood_sugar
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Family Health Tree</h2>
        <button 
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          onClick={() => setIsAddMemberOpen(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Family Member
        </button>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        {/* Main patient info */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center">
            <User className="w-10 h-10 text-gray-600" />
          </div>
          <h3 className="mt-4 text-xl font-semibold">
            {data.patient.first_name} {data.patient.last_name}
          </h3>
          <p className="text-gray-600">
            Age: {calculateAge(data.patient.date_of_birth)} years
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-sm text-blue-800 font-medium">Total Relatives</div>
            <div className="mt-1 text-2xl font-semibold text-blue-900">
              {stats.total_relatives}
            </div>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-sm text-blue-800 font-medium">Diabetic Relatives</div>
            <div className="mt-1 text-2xl font-semibold text-blue-900">
              {stats.diabetic_relatives || 'N/A'}
            </div>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-sm text-blue-800 font-medium">Average HbA1c</div>
            <div className="mt-1 text-2xl font-semibold text-blue-900">
              {displayValue(stats.avg_hba1c, '%')}
            </div>
          </div>
        </div>

        {/* Family Members Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.familyTree.length === 0 ? (
            <div className="col-span-full text-center text-gray-500 py-8">
              No family members added yet. Click "Add Family Member" to start building your family tree.
            </div>
          ) : (
            data.familyTree.map((member) => (
              <div key={member.relationship_id} className="p-4 border rounded-lg">
                <h3 className="font-medium text-lg">{member.first_name} {member.last_name}</h3>
                <p className="text-gray-600 capitalize">{member.relationship_type}</p>
                {member.diabetes_type && (
                  <p className="text-blue-600 mt-2">Type: {member.diabetes_type}</p>
                )}
                <p className="text-blue-600">
                  HbA1c: {displayValue(member.hba1c_level, '%')}
                </p>
                {member.blood_sugar_level && (
                  <p className="text-blue-600">
                    Blood Sugar: {displayValue(member.blood_sugar_level, ' mg/dL')}
                  </p>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {isAddMemberOpen && (
        <AddFamilyMemberForm
          isOpen={isAddMemberOpen}
          onClose={() => setIsAddMemberOpen(false)}
          onSubmit={handleAddMember}
        />
      )}
    </div>
  );
};

export default FamilyTree;