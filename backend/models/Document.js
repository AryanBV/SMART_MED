const db = require('../config/db');

class Document {
    // Create a new document record
    static async create(documentData) {
        try {
            const [result] = await db.query(
                `INSERT INTO documents 
                (patient_id, document_type, file_name, file_path, 
                processed_text, processed_status, metadata) 
                VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [
                    documentData.patient_id,
                    documentData.document_type,
                    documentData.file_name,
                    documentData.file_path,
                    documentData.processed_text || null,
                    documentData.processed_status || 'pending',
                    JSON.stringify(documentData.metadata || {})
                ]
            );
            return result.insertId;
        } catch (error) {
            throw error;
        }
    }

    // Get document by ID
    static async findById(documentId) {
        try {
            const [rows] = await db.query(
                'SELECT * FROM documents WHERE document_id = ?',
                [documentId]
            );
            if (rows[0]) {
                rows[0].metadata = JSON.parse(rows[0].metadata);
            }
            return rows[0];
        } catch (error) {
            throw error;
        }
    }

    // Get all documents for a patient
    static async findByPatientId(patientId) {
        try {
            const [rows] = await db.query(
                'SELECT * FROM documents WHERE patient_id = ? ORDER BY upload_date DESC',
                [patientId]
            );
            rows.forEach(row => {
                row.metadata = JSON.parse(row.metadata);
            });
            return rows;
        } catch (error) {
            throw error;
        }
    }

    // Update document processing status and results
    static async updateProcessingResults(documentId, processedData) {
        try {
            const [result] = await db.query(
                `UPDATE documents 
                SET processed_text = ?,
                    processed_status = ?,
                    metadata = ?,
                    last_updated = CURRENT_TIMESTAMP
                WHERE document_id = ?`,
                [
                    processedData.processed_text,
                    processedData.processed_status,
                    JSON.stringify(processedData.metadata || {}),
                    documentId
                ]
            );
            return result.affectedRows > 0;
        } catch (error) {
            throw error;
        }
    }

    // Delete document
    static async delete(documentId) {
        try {
            const [result] = await db.query(
                'DELETE FROM documents WHERE document_id = ?',
                [documentId]
            );
            return result.affectedRows > 0;
        } catch (error) {
            throw error;
        }
    }

    // Get recent prescriptions
    static async getRecentPrescriptions(patientId, limit = 5) {
        try {
            const [rows] = await db.query(
                `SELECT * FROM documents 
                WHERE patient_id = ? 
                AND document_type = 'prescription' 
                ORDER BY upload_date DESC 
                LIMIT ?`,
                [patientId, limit]
            );
            rows.forEach(row => {
                row.metadata = JSON.parse(row.metadata);
            });
            return rows;
        } catch (error) {
            throw error;
        }
    }

    // Search documents by content
    static async searchDocuments(patientId, searchTerm) {
        try {
            const [rows] = await db.query(
                `SELECT * FROM documents 
                WHERE patient_id = ? 
                AND (processed_text LIKE ? OR metadata LIKE ?)`,
                [patientId, `%${searchTerm}%`, `%${searchTerm}%`]
            );
            rows.forEach(row => {
                row.metadata = JSON.parse(row.metadata);
            });
            return rows;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = Document;