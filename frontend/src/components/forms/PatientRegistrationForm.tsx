import React, { useState } from 'react';
import { Save, X } from 'lucide-react';
import DocumentUpload from '../documents/DocumentUpload';

interface PatientForm {
  personalInfo: {
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    gender: string;
    email: string;
    phone: string;
    address: string;
  };
  medicalInfo: {
    bloodType: string;
    height: string;
    weight: string;
    allergies: string;
    medications: string;
    chronicConditions: string;
  };
  diabetesInfo: {
    diabetesType: string;
    diagnosisDate: string;
    lastHbA1c: string;
    lastGlucoseReading: string;
    medicationSchedule: string;
  };
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
}

const PatientRegistrationForm: React.FC = () => {
  const [activeStep, setActiveStep] = useState(1);
  const [formData, setFormData] = useState<PatientForm>({
    personalInfo: {
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      gender: '',
      email: '',
      phone: '',
      address: '',
    },
    medicalInfo: {
      bloodType: '',
      height: '',
      weight: '',
      allergies: '',
      medications: '',
      chronicConditions: '',
    },
    diabetesInfo: {
      diabetesType: '',
      diagnosisDate: '',
      lastHbA1c: '',
      lastGlucoseReading: '',
      medicationSchedule: '',
    },
    emergencyContact: {
      name: '',
      relationship: '',
      phone: '',
    }
  });

  const handleInputChange = (category: keyof PatientForm, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value
      }
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Here you would typically send the data to your backend
  };

  const handleExtractedData = (data: any) => {
    if (data.medications) {
      handleInputChange('medicalInfo', 'medications', 
        data.medications.map((med: any) => 
          `${med.name} ${med.dosage} ${med.frequency}`
        ).join('\n')
      );
    }
    if (data.conditions) {
      handleInputChange('medicalInfo', 'chronicConditions', 
        data.conditions.join(', ')
      );
    }
    // Add more field mappings as needed
  };

  const renderStepIndicator = () => (
    <div className="flex justify-center mb-8">
      {[1, 2, 3, 4].map((step) => (
        <div key={step} className="flex items-center">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              step === activeStep
                ? 'bg-blue-600 text-white'
                : step < activeStep
                ? 'bg-green-500 text-white'
                : 'bg-gray-200 text-gray-600'
            }`}
          >
            {step < activeStep ? '✓' : step}
          </div>
          {step < 4 && (
            <div
              className={`w-12 h-1 ${
                step < activeStep ? 'bg-green-500' : 'bg-gray-200'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );

  const renderPersonalInfo = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">First Name</label>
          <input
            type="text"
            value={formData.personalInfo.firstName}
            onChange={(e) => handleInputChange('personalInfo', 'firstName', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Last Name</label>
          <input
            type="text"
            value={formData.personalInfo.lastName}
            onChange={(e) => handleInputChange('personalInfo', 'lastName', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
          <input
            type="date"
            value={formData.personalInfo.dateOfBirth}
            onChange={(e) => handleInputChange('personalInfo', 'dateOfBirth', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Gender</label>
          <select
            value={formData.personalInfo.gender}
            onChange={(e) => handleInputChange('personalInfo', 'gender', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            value={formData.personalInfo.email}
            onChange={(e) => handleInputChange('personalInfo', 'email', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Phone</label>
          <input
            type="tel"
            value={formData.personalInfo.phone}
            onChange={(e) => handleInputChange('personalInfo', 'phone', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Address</label>
        <textarea
          value={formData.personalInfo.address}
          onChange={(e) => handleInputChange('personalInfo', 'address', e.target.value)}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>
    </div>
  );

  const renderMedicalInfo = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Blood Type</label>
          <select
            value={formData.medicalInfo.bloodType}
            onChange={(e) => handleInputChange('medicalInfo', 'bloodType', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">Select Blood Type</option>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Height (cm)</label>
          <input
            type="number"
            value={formData.medicalInfo.height}
            onChange={(e) => handleInputChange('medicalInfo', 'height', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Weight (kg)</label>
          <input
            type="number"
            value={formData.medicalInfo.weight}
            onChange={(e) => handleInputChange('medicalInfo', 'weight', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Allergies</label>
        <textarea
          value={formData.medicalInfo.allergies}
          onChange={(e) => handleInputChange('medicalInfo', 'allergies', e.target.value)}
          rows={2}
          placeholder="List any allergies..."
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Current Medications</label>
        <textarea
          value={formData.medicalInfo.medications}
          onChange={(e) => handleInputChange('medicalInfo', 'medications', e.target.value)}
          rows={2}
          placeholder="List current medications..."
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Chronic Conditions</label>
        <textarea
          value={formData.medicalInfo.chronicConditions}
          onChange={(e) => handleInputChange('medicalInfo', 'chronicConditions', e.target.value)}
          rows={2}
          placeholder="List any chronic conditions..."
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>
    </div>
  );

  const renderDiabetesInfo = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Type of Diabetes</label>
          <select
            value={formData.diabetesInfo.diabetesType}
            onChange={(e) => handleInputChange('diabetesInfo', 'diabetesType', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">Select Type</option>
            <option value="type1">Type 1</option>
            <option value="type2">Type 2</option>
            <option value="gestational">Gestational</option>
            <option value="prediabetes">Prediabetes</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Diagnosis Date</label>
          <input
            type="date"
            value={formData.diabetesInfo.diagnosisDate}
            onChange={(e) => handleInputChange('diabetesInfo', 'diagnosisDate', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Last HbA1c</label>
          <input
            type="text"
            value={formData.diabetesInfo.lastHbA1c}
            onChange={(e) => handleInputChange('diabetesInfo', 'lastHbA1c', e.target.value)}
            placeholder="e.g., 6.5%"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Last Glucose Reading</label>
          <input
            type="text"
            value={formData.diabetesInfo.lastGlucoseReading}
            onChange={(e) => handleInputChange('diabetesInfo', 'lastGlucoseReading', e.target.value)}
            placeholder="e.g., 120 mg/dL"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Medication Schedule</label>
        <textarea
          value={formData.diabetesInfo.medicationSchedule}
          onChange={(e) => handleInputChange('diabetesInfo', 'medicationSchedule', e.target.value)}
          rows={3}
          placeholder="Detail current diabetes medication schedule..."
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>
    </div>
  );

  const renderEmergencyContact = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Emergency Contact Name</label>
        <input
          type="text"
          value={formData.emergencyContact.name}
          onChange={(e) => handleInputChange('emergencyContact', 'name', e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Relationship</label>
        <input
          type="text"
          value={formData.emergencyContact.relationship}
          onChange={(e) => handleInputChange('emergencyContact', 'relationship', e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300
          shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Emergency Contact Phone</label>
        <input
          type="tel"
          value={formData.emergencyContact.phone}
          onChange={(e) => handleInputChange('emergencyContact', 'phone', e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Patient Registration</h2>
      
      {renderStepIndicator()}

      <form onSubmit={handleSubmit} className="space-y-8">
        {activeStep === 1 && (
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
            {renderPersonalInfo()}
          </div>
        )}

        {activeStep === 2 && (
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Medical Information</h3>
            <DocumentUpload onUploadComplete={handleExtractedData} />
            {renderMedicalInfo()}
          </div>
        )}

        {activeStep === 3 && (
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Diabetes Information</h3>
            {renderDiabetesInfo()}
          </div>
        )}

        {activeStep === 4 && (
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Emergency Contact</h3>
            {renderEmergencyContact()}
          </div>
        )}

        <div className="flex justify-between pt-4">
          <button
            type="button"
            onClick={() => setActiveStep(prev => Math.max(1, prev - 1))}
            className="px-4 py-2 bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
            disabled={activeStep === 1}
          >
            Previous
          </button>
          
          {activeStep < 4 ? (
            <button
              type="button"
              onClick={() => setActiveStep(prev => Math.min(4, prev + 1))}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Next
            </button>
          ) : (
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              Submit Registration
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default PatientRegistrationForm;