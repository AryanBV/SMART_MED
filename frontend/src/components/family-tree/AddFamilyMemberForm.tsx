import React, { useState } from 'react';
import { X } from 'lucide-react';

interface AddFamilyMemberFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: FamilyMemberData) => void;
}

interface FamilyMemberData {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  relationship: string;
  diabetesStatus: string;
  diabetesType?: string;
  ageOfOnset?: string;
  medications?: string;
  diabetesRisk?: number;
  lifestyle: {
    bmi: number;
    physicalActivity: string;
    smoking: string;
  };
}

const AddFamilyMemberForm: React.FC<AddFamilyMemberFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [formData, setFormData] = useState<FamilyMemberData>({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    relationship: '',
    diabetesStatus: 'unknown',
    lifestyle: {
      bmi: 0,
      physicalActivity: 'moderate',
      smoking: 'no',
    },
  });

  const [error, setError] = useState<string | null>(null);
  const [riskScore, setRiskScore] = useState<number | null>(null);

  if (!isOpen) return null;

  const calculateBayesianRisk = () => {
    // Prior probabilities based on general population
    const P_diabetes = 0.1; // Base rate in population (10%)
    
    // Likelihood ratios based on risk factors
    const familyHistoryLR = 2.5; // Increased risk due to family history
    const ageLR = calculateAgeLR(formData.dateOfBirth);
    const bmiLR = calculateBMILR(formData.lifestyle.bmi);
    const lifestyleLR = calculateLifestyleLR(formData.lifestyle);

    // Combined likelihood ratio
    const combinedLR = familyHistoryLR * ageLR * bmiLR * lifestyleLR;

    // Posterior probability using Bayes' Theorem
    const posterior = (P_diabetes * combinedLR) / 
      ((P_diabetes * combinedLR) + (1 - P_diabetes));

    return posterior * 100;
  };

  const calculateAgeLR = (dob: string): number => {
    const age = new Date().getFullYear() - new Date(dob).getFullYear();
    if (age < 40) return 1;
    if (age < 50) return 1.5;
    if (age < 60) return 2;
    return 2.5;
  };

  const calculateBMILR = (bmi: number): number => {
    if (bmi < 25) return 1;
    if (bmi < 30) return 1.5;
    if (bmi < 35) return 2;
    return 2.5;
  };

  const calculateLifestyleLR = (lifestyle: {
    physicalActivity: string;
    smoking: string;
  }): number => {
    let lr = 1;
    if (lifestyle.physicalActivity === 'low') lr *= 1.3;
    if (lifestyle.smoking === 'yes') lr *= 1.2;
    return lr;
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleLifestyleChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      lifestyle: {
        ...prev.lifestyle,
        [field]: value,
      },
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.firstName || !formData.lastName || !formData.dateOfBirth || !formData.relationship) {
      setError('Please fill in all required fields');
      return;
    }
  
    const submitData = {
      ...formData,
      gender: formData.gender || 'unknown',
      diabetesStatus: formData.diabetesStatus || 'unknown',
      lifestyle: {
        bmi: parseFloat(formData.lifestyle.bmi?.toString() || '0'),
        physicalActivity: formData.lifestyle.physicalActivity || 'moderate',
        smoking: formData.lifestyle.smoking || 'no'
      }
    };
  
    const risk = calculateBayesianRisk();
    setRiskScore(risk);
    
    onSubmit({
      ...submitData,
      diabetesRisk: risk
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Add Family Member</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  First Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Last Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Date of Birth
                </label>
                <input
                  type="date"
                  required
                  value={formData.dateOfBirth}
                  onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Relationship
                </label>
                <select
                  required
                  value={formData.relationship}
                  onChange={(e) => handleInputChange('relationship', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="">Select Relationship</option>
                  <option value="parent">Parent</option>
                  <option value="sibling">Sibling</option>
                  <option value="child">Child</option>
                  <option value="grandparent">Grandparent</option>
                  <option value="aunt_uncle">Aunt/Uncle</option>
                  <option value="cousin">Cousin</option>
                </select>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Diabetes Information</h4>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Diabetes Status
                </label>
                <select
                  value={formData.diabetesStatus}
                  onChange={(e) => handleInputChange('diabetesStatus', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="unknown">Unknown</option>
                  <option value="no">No Diabetes</option>
                  <option value="type1">Type 1 Diabetes</option>
                  <option value="type2">Type 2 Diabetes</option>
                  <option value="prediabetes">Prediabetes</option>
                </select>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Risk Factors</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    BMI
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.lifestyle.bmi || ''}
                    onChange={(e) => handleLifestyleChange('bmi', parseFloat(e.target.value))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Physical Activity
                  </label>
                  <select
                    value={formData.lifestyle.physicalActivity}
                    onChange={(e) => handleLifestyleChange('physicalActivity', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="high">High</option>
                    <option value="moderate">Moderate</option>
                    <option value="low">Low</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Smoking
                  </label>
                  <select
                    value={formData.lifestyle.smoking}
                    onChange={(e) => handleLifestyleChange('smoking', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="no">No</option>
                    <option value="yes">Yes</option>
                    <option value="former">Former</option>
                  </select>
                </div>
              </div>
            </div>

            {riskScore !== null && (
              <div className="p-4 bg-blue-50 rounded-md">
                <h4 className="font-medium text-blue-900">Diabetes Risk Assessment</h4>
                <p className="text-blue-700">
                  Estimated risk of developing diabetes: {riskScore.toFixed(1)}%
                </p>
                <p className="text-sm text-blue-600 mt-1">
                  Based on family history, age, BMI, and lifestyle factors
                </p>
              </div>
            )}

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                Add Family Member
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddFamilyMemberForm;