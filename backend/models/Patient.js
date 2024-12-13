const db = require('../config/db');

class Patient {
    // Create a new patient
    static async create(patientData) {
        try {
            const [result] = await db.query(
                'INSERT INTO patients (first_name, last_name, date_of_birth, gender, email, phone) VALUES (?, ?, ?, ?, ?, ?)',
                [patientData.first_name, patientData.last_name, patientData.date_of_birth, 
                 patientData.gender, patientData.email, patientData.phone]
            );
            return result.insertId;
        } catch (error) {
            throw error;
        }
    }

    // Get patient by ID
    static async findById(id) {
        try {
            const [rows] = await db.query('SELECT * FROM patients WHERE patient_id = ?', [id]);
            return rows[0];
        } catch (error) {
            throw error;
        }
    }

    // Get all patients
    static async findAll() {
        try {
            const [rows] = await db.query('SELECT * FROM patients');
            return rows;
        } catch (error) {
            throw error;
        }
    }

    // Update patient
    static async update(id, patientData) {
        try {
            const [result] = await db.query(
                'UPDATE patients SET first_name = ?, last_name = ?, date_of_birth = ?, gender = ?, email = ?, phone = ? WHERE patient_id = ?',
                [patientData.first_name, patientData.last_name, patientData.date_of_birth, 
                 patientData.gender, patientData.email, patientData.phone, id]
            );
            return result.affectedRows > 0;
        } catch (error) {
            throw error;
        }
    }

    // Delete patient
    static async delete(id) {
        try {
            const [result] = await db.query('DELETE FROM patients WHERE patient_id = ?', [id]);
            return result.affectedRows > 0;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = Patient;