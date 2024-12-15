const API_BASE_URL = 'http://localhost:5000/api';

export interface FamilyMemberData {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  relationship: string;
  diabetesStatus: string;
  diabetesType?: string;
  diabetesRisk?: number;
  lifestyle: {
    bmi: number;
    physicalActivity: string;
    smoking: string;
  };
}

export interface DocumentUploadResponse {
  success: boolean;
  message?: string;
  data?: {
    document_id: string;
    extractedData?: any;
  };
  extractedData?: any;
}

export const familyService = {
  getFamilyTree: async (patientId: string) => {
    try {
      console.log('Fetching family tree for patient:', patientId);
      const response = await fetch(`${API_BASE_URL}/family/tree/${patientId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Family tree response:', data);
      
      return {
        success: true,
        data: data.data || data // Handle both {data: {...}} and direct response formats
      };
    } catch (error) {
      console.error('Error fetching family tree:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch family tree'
      };
    }
  },

  addFamilyMember: async (patientId: string, memberData: FamilyMemberData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/family/relation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          patientId: parseInt(patientId),
          ...memberData,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || data.error || 'Failed to add family member');
      }
      
      return {
        success: true,
        data
      };
    } catch (error) {
      console.error('Error adding family member:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to add family member'
      };
    }
  }
};

export const documentService = {
  uploadDocument: async (file: File, patientId: string): Promise<DocumentUploadResponse> => {
    try {
      const formData = new FormData();
      formData.append('document', file);
      formData.append('patient_id', patientId);
      formData.append('document_type', file.type);

      const response = await fetch(`${API_BASE_URL}/documents/upload`, {
        method: 'POST',
        body: formData
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Upload failed');
      }

      return {
        ...data,
        extractedData: data.data?.extractedData || data.extractedData
      };
    } catch (error) {
      console.error('Error uploading document:', error);
      throw error;
    }
  }
};

export default {
  familyService,
  documentService
};