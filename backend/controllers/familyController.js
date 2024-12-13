const FamilyRelation = require('../models/FamilyRelation');
const Patient = require('../models/Patient');
const MedicalRecord = require('../models/MedicalRecord');

class FamilyController {
    // Add family relationship
    static async addRelation(req, res) {
        try {
            const { patient_id, relative_id, relationship_type } = req.body;

            // Validate input
            if (!patient_id || !relative_id || !relationship_type) {
                return res.status(400).json({
                    success: false,
                    message: 'Missing required fields'
                });
            }

            // Check if both patient and relative exist
            const patient = await Patient.findById(patient_id);
            const relative = await Patient.findById(relative_id);

            if (!patient || !relative) {
                return res.status(404).json({
                    success: false,
                    message: 'Patient or relative not found'
                });
            }

            // Check if relationship already exists
            const exists = await FamilyRelation.relationshipExists(patient_id, relative_id);
            if (exists) {
                return res.status(400).json({
                    success: false,
                    message: 'Relationship already exists'
                });
            }

            const relationId = await FamilyRelation.create({
                patient_id,
                relative_id,
                relationship_type
            });

            res.status(201).json({
                success: true,
                message: 'Family relationship added successfully',
                data: { relationship_id: relationId }
            });
        } catch (error) {
            console.error('Error adding family relation:', error);
            res.status(500).json({
                success: false,
                message: 'Error adding family relation',
                error: error.message
            });
        }
    }

    // Get family tree
    static async getFamilyTree(req, res) {
        try {
            const patientId = req.params.id;

            // Verify patient exists
            const patient = await Patient.findById(patientId);
            if (!patient) {
                return res.status(404).json({
                    success: false,
                    message: 'Patient not found'
                });
            }

            // Get family tree with extended relations
            const familyTree = await FamilyRelation.getFamilyTree(patientId);

            // Get diabetes stats for family members
            const diabetesStats = await MedicalRecord.getFamilyDiabetesStats(patientId);

            res.json({
                success: true,
                data: {
                    patient,
                    familyTree,
                    diabetesStats
                }
            });
        } catch (error) {
            console.error('Error fetching family tree:', error);
            res.status(500).json({
                success: false,
                message: 'Error fetching family tree',
                error: error.message
            });
        }
    }

    // Update relationship
    static async updateRelation(req, res) {
        try {
            const relationshipId = req.params.id;
            const { relationship_type } = req.body;

            if (!relationship_type) {
                return res.status(400).json({
                    success: false,
                    message: 'Relationship type is required'
                });
            }

            const success = await FamilyRelation.update(relationshipId, {
                relationship_type
            });

            if (!success) {
                return res.status(404).json({
                    success: false,
                    message: 'Relationship not found'
                });
            }

            res.json({
                success: true,
                message: 'Relationship updated successfully'
            });
        } catch (error) {
            console.error('Error updating relationship:', error);
            res.status(500).json({
                success: false,
                message: 'Error updating relationship',
                error: error.message
            });
        }
    }

    // Remove relationship
    static async removeRelation(req, res) {
        try {
            const relationshipId = req.params.id;
            
            const success = await FamilyRelation.delete(relationshipId);
            if (!success) {
                return res.status(404).json({
                    success: false,
                    message: 'Relationship not found'
                });
            }

            res.json({
                success: true,
                message: 'Relationship removed successfully'
            });
        } catch (error) {
            console.error('Error removing relationship:', error);
            res.status(500).json({
                success: false,
                message: 'Error removing relationship',
                error: error.message
            });
        }
    }

    // Calculate diabetes risk based on family history
    static async calculateFamilyRisk(req, res) {
        try {
            const patientId = req.params.id;
            
            // Get family diabetes statistics
            const stats = await MedicalRecord.getFamilyDiabetesStats(patientId);
            
            // Simple risk calculation based on percentage of diabetic relatives
            const riskFactor = stats.diabetic_relatives / stats.total_relatives;
            let riskLevel = 'low';
            
            if (riskFactor > 0.5) {
                riskLevel = 'high';
            } else if (riskFactor > 0.25) {
                riskLevel = 'medium';
            }

            res.json({
                success: true,
                data: {
                    statistics: stats,
                    riskLevel,
                    riskFactor
                }
            });
        } catch (error) {
            console.error('Error calculating family risk:', error);
            res.status(500).json({
                success: false,
                message: 'Error calculating family risk',
                error: error.message
            });
        }
    }
}

module.exports = FamilyController;