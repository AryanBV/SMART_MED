const db = require('../config/db');

class FamilyRelation {
    // Create a new family relationship
    static async create(relationData) {
        try {
            const [result] = await db.query(
                'INSERT INTO family_relationships (patient_id, relative_id, relationship_type) VALUES (?, ?, ?)',
                [relationData.patient_id, relationData.relative_id, relationData.relationship_type]
            );
            return result.insertId;
        } catch (error) {
            throw error;
        }
    }

    // Get all family relationships for a patient
    static async findByPatientId(patientId) {
        try {
            const [rows] = await db.query(
                `SELECT fr.*, 
                    p.first_name, p.last_name, p.date_of_birth, p.gender 
                FROM family_relationships fr 
                JOIN patients p ON fr.relative_id = p.patient_id 
                WHERE fr.patient_id = ?`,
                [patientId]
            );
            return rows;
        } catch (error) {
            throw error;
        }
    }

    // Get family tree (includes extended family)
    static async getFamilyTree(patientId) {
        try {
            const [rows] = await db.query(
                `WITH RECURSIVE family_tree AS (
                    SELECT fr.*, p.first_name, p.last_name, 1 as level
                    FROM family_relationships fr
                    JOIN patients p ON fr.relative_id = p.patient_id
                    WHERE fr.patient_id = ?
                    
                    UNION ALL
                    
                    SELECT fr.*, p.first_name, p.last_name, ft.level + 1
                    FROM family_relationships fr
                    JOIN family_tree ft ON fr.patient_id = ft.relative_id
                    JOIN patients p ON fr.relative_id = p.patient_id
                    WHERE ft.level < 3
                )
                SELECT * FROM family_tree`,
                [patientId]
            );
            return rows;
        } catch (error) {
            throw error;
        }
    }

    // Update family relationship
    static async update(relationshipId, relationData) {
        try {
            const [result] = await db.query(
                'UPDATE family_relationships SET relationship_type = ? WHERE relationship_id = ?',
                [relationData.relationship_type, relationshipId]
            );
            return result.affectedRows > 0;
        } catch (error) {
            throw error;
        }
    }

    // Delete family relationship
    static async delete(relationshipId) {
        try {
            const [result] = await db.query(
                'DELETE FROM family_relationships WHERE relationship_id = ?',
                [relationshipId]
            );
            return result.affectedRows > 0;
        } catch (error) {
            throw error;
        }
    }

    // Check if relationship exists
    static async relationshipExists(patientId, relativeId) {
        try {
            const [rows] = await db.query(
                'SELECT * FROM family_relationships WHERE patient_id = ? AND relative_id = ?',
                [patientId, relativeId]
            );
            return rows.length > 0;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = FamilyRelation;