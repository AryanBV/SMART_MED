const db = require('../config/db');

class MedicalRecord {
    // Create a new medical record
    static async create(recordData) {
        try {
            const [result] = await db.query(
                `INSERT INTO medical_records 
                (patient_id, diabetes_type, diagnosis_date, hba1c_level, 
                blood_sugar_level, medications, notes) 
                VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [
                    recordData.patient_id,
                    recordData.diabetes_type,
                    recordData.diagnosis_date,
                    recordData.hba1c_level,
                    recordData.blood_sugar_level,
                    recordData.medications,
                    recordData.notes
                ]
            );
            return result.insertId;
        } catch (error) {
            throw error;
        }
    }

    // Get medical record by ID
    static async findById(recordId) {
        try {
            const [rows] = await db.query(
                'SELECT * FROM medical_records WHERE record_id = ?',
                [recordId]
            );
            return rows[0];
        } catch (error) {
            throw error;
        }
    }

    // Get all medical records for a patient
    static async findByPatientId(patientId) {
        try {
            const [rows] = await db.query(
                'SELECT * FROM medical_records WHERE patient_id = ? ORDER BY record_date DESC',
                [patientId]
            );
            return rows;
        } catch (error) {
            throw error;
        }
    }

    // Get latest medical record for a patient
    static async getLatestRecord(patientId) {
        try {
            const [rows] = await db.query(
                'SELECT * FROM medical_records WHERE patient_id = ? ORDER BY record_date DESC LIMIT 1',
                [patientId]
            );
            return rows[0];
        } catch (error) {
            throw error;
        }
    }

    // Update medical record
    static async update(recordId, recordData) {
        try {
            const [result] = await db.query(
                `UPDATE medical_records 
                SET diabetes_type = ?, 
                    diagnosis_date = ?, 
                    hba1c_level = ?, 
                    blood_sugar_level = ?, 
                    medications = ?, 
                    notes = ? 
                WHERE record_id = ?`,
                [
                    recordData.diabetes_type,
                    recordData.diagnosis_date,
                    recordData.hba1c_level,
                    recordData.blood_sugar_level,
                    recordData.medications,
                    recordData.notes,
                    recordId
                ]
            );
            return result.affectedRows > 0;
        } catch (error) {
            throw error;
        }
    }

    // Delete medical record
    static async delete(recordId) {
        try {
            const [result] = await db.query(
                'DELETE FROM medical_records WHERE record_id = ?',
                [recordId]
            );
            return result.affectedRows > 0;
        } catch (error) {
            throw error;
        }
    }

    // Get diabetes statistics for family members
    static async getFamilyDiabetesStats(patientId) {
        try {
            const [rows] = await db.query(
                `SELECT 
                    COUNT(*) as total_relatives,
                    SUM(CASE WHEN mr.diabetes_type IS NOT NULL THEN 1 ELSE 0 END) as diabetic_relatives,
                    AVG(mr.hba1c_level) as avg_hba1c,
                    AVG(mr.blood_sugar_level) as avg_blood_sugar
                FROM family_relationships fr
                JOIN patients p ON fr.relative_id = p.patient_id
                LEFT JOIN medical_records mr ON p.patient_id = mr.patient_id
                WHERE fr.patient_id = ?`,
                [patientId]
            );
            return rows[0];
        } catch (error) {
            throw error;
        }
    }
}

module.exports = MedicalRecord;