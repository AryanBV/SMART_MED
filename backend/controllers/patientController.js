const Patient = require('../models/Patient');
const MedicalRecord = require('../models/MedicalRecord');
const FamilyRelation = require('../models/FamilyRelation');

class PatientController {
    // Create new patient
    static async createPatient(req, res) {
        try {
            const patientData = req.body;
            
            // Basic validation
            if (!patientData.first_name || !patientData.last_name || !patientData.date_of_birth) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'Missing required fields' 
                });
            }

            const patientId = await Patient.create(patientData);
            
            res.status(201).json({
                success: true,
                message: 'Patient created successfully',
                data: { patient_id: patientId }
            });
        } catch (error) {
            console.error('Error creating patient:', error);
            res.status(500).json({
                success: false,
                message: 'Error creating patient',
                error: error.message
            });
        }
    }

    // Get patient by ID with medical history
    static async getPatient(req, res) {
        try {
            const patientId = req.params.id;
            
            // Get patient basic info
            const patient = await Patient.findById(patientId);
            if (!patient) {
                return res.status(404).json({
                    success: false,
                    message: 'Patient not found'
                });
            }

            // Get medical records
            const medicalRecords = await MedicalRecord.findByPatientId(patientId);
            
            // Get family relations
            const familyMembers = await FamilyRelation.findByPatientId(patientId);

            // Get diabetes statistics for family
            const diabetesStats = await MedicalRecord.getFamilyDiabetesStats(patientId);

            res.json({
                success: true,
                data: {
                    patient,
                    medicalRecords,
                    familyMembers,
                    diabetesStats
                }
            });
        } catch (error) {
            console.error('Error fetching patient:', error);
            res.status(500).json({
                success: false,
                message: 'Error fetching patient details',
                error: error.message
            });
        }
    }

    // Update patient
    static async updatePatient(req, res) {
        try {
            const patientId = req.params.id;
            const updateData = req.body;

            const success = await Patient.update(patientId, updateData);
            if (!success) {
                return res.status(404).json({
                    success: false,
                    message: 'Patient not found or no changes made'
                });
            }

            res.json({
                success: true,
                message: 'Patient updated successfully'
            });
        } catch (error) {
            console.error('Error updating patient:', error);
            res.status(500).json({
                success: false,
                message: 'Error updating patient',
                error: error.message
            });
        }
    }

    // Delete patient
    static async deletePatient(req, res) {
        try {
            const patientId = req.params.id;
            
            const success = await Patient.delete(patientId);
            if (!success) {
                return res.status(404).json({
                    success: false,
                    message: 'Patient not found'
                });
            }

            res.json({
                success: true,
                message: 'Patient deleted successfully'
            });
        } catch (error) {
            console.error('Error deleting patient:', error);
            res.status(500).json({
                success: false,
                message: 'Error deleting patient',
                error: error.message
            });
        }
    }

    // Search patients
    static async searchPatients(req, res) {
        try {
            const { query } = req.query;
            if (!query) {
                return res.status(400).json({
                    success: false,
                    message: 'Search query is required'
                });
            }

            const patients = await Patient.search(query);
            res.json({
                success: true,
                data: patients
            });
        } catch (error) {
            console.error('Error searching patients:', error);
            res.status(500).json({
                success: false,
                message: 'Error searching patients',
                error: error.message
            });
        }
    }
}

module.exports = PatientController;