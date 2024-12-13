const MedicalRecord = require('../models/MedicalRecord');
const Patient = require('../models/Patient');

class MedicalRecordController {
    // Add new medical record
    static async createRecord(req, res) {
        try {
            const recordData = req.body;

            // Validate required fields
            if (!recordData.patient_id || !recordData.diabetes_type) {
                return res.status(400).json({
                    success: false,
                    message: 'Missing required fields'
                });
            }

            // Verify patient exists
            const patient = await Patient.findById(recordData.patient_id);
            if (!patient) {
                return res.status(404).json({
                    success: false,
                    message: 'Patient not found'
                });
            }

            const recordId = await MedicalRecord.create(recordData);

            res.status(201).json({
                success: true,
                message: 'Medical record created successfully',
                data: { record_id: recordId }
            });
        } catch (error) {
            console.error('Error creating medical record:', error);
            res.status(500).json({
                success: false,
                message: 'Error creating medical record',
                error: error.message
            });
        }
    }

    // Get medical record by ID
    static async getRecord(req, res) {
        try {
            const recordId = req.params.id;
            
            const record = await MedicalRecord.findById(recordId);
            if (!record) {
                return res.status(404).json({
                    success: false,
                    message: 'Medical record not found'
                });
            }

            res.json({
                success: true,
                data: record
            });
        } catch (error) {
            console.error('Error fetching medical record:', error);
            res.status(500).json({
                success: false,
                message: 'Error fetching medical record',
                error: error.message
            });
        }
    }

    // Get all medical records for a patient
    static async getPatientRecords(req, res) {
        try {
            const patientId = req.params.patientId;
            
            // Verify patient exists
            const patient = await Patient.findById(patientId);
            if (!patient) {
                return res.status(404).json({
                    success: false,
                    message: 'Patient not found'
                });
            }

            const records = await MedicalRecord.findByPatientId(patientId);

            res.json({
                success: true,
                data: {
                    patient,
                    records
                }
            });
        } catch (error) {
            console.error('Error fetching patient records:', error);
            res.status(500).json({
                success: false,
                message: 'Error fetching patient records',
                error: error.message
            });
        }
    }

    // Update medical record
    static async updateRecord(req, res) {
        try {
            const recordId = req.params.id;
            const updateData = req.body;

            const success = await MedicalRecord.update(recordId, updateData);
            if (!success) {
                return res.status(404).json({
                    success: false,
                    message: 'Medical record not found'
                });
            }

            res.json({
                success: true,
                message: 'Medical record updated successfully'
            });
        } catch (error) {
            console.error('Error updating medical record:', error);
            res.status(500).json({
                success: false,
                message: 'Error updating medical record',
                error: error.message
            });
        }
    }

    // Delete medical record
    static async deleteRecord(req, res) {
        try {
            const recordId = req.params.id;
            
            const success = await MedicalRecord.delete(recordId);
            if (!success) {
                return res.status(404).json({
                    success: false,
                    message: 'Medical record not found'
                });
            }

            res.json({
                success: true,
                message: 'Medical record deleted successfully'
            });
        } catch (error) {
            console.error('Error deleting medical record:', error);
            res.status(500).json({
                success: false,
                message: 'Error deleting medical record',
                error: error.message
            });
        }
    }

    // Get diabetes progression analysis
    static async getDiabetesProgression(req, res) {
        try {
            const patientId = req.params.patientId;
            
            // Get all records sorted by date
            const records = await MedicalRecord.findByPatientId(patientId);
            
            // Calculate progression metrics
            const progression = records.map(record => ({
                date: record.record_date,
                hba1c_level: record.hba1c_level,
                blood_sugar_level: record.blood_sugar_level
            }));

            res.json({
                success: true,
                data: {
                    progression,
                    recordCount: records.length
                }
            });
        } catch (error) {
            console.error('Error analyzing diabetes progression:', error);
            res.status(500).json({
                success: false,
                message: 'Error analyzing diabetes progression',
                error: error.message
            });
        }
    }
}

module.exports = MedicalRecordController;