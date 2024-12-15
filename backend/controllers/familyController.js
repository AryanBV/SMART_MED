const db = require('../config/db');

const FamilyController = {
  getFamilyTree: async (req, res) => {
    let connection;
    try {
      const patientId = req.params.id;
      console.log('Fetching family tree for patient:', patientId);

      connection = await db.getConnection();

      // First, get the main patient's information
      const [patientRows] = await connection.query(
        `SELECT 
          patient_id, first_name, last_name, date_of_birth, gender, email, phone 
         FROM patients 
         WHERE patient_id = ?`,
        [patientId]
      );

      if (patientRows.length === 0) {
        return res.status(404).json({
          success: false,
          error: 'Patient not found'
        });
      }

      // Get family members with their medical information
      const [familyRows] = await connection.query(
        `SELECT 
          fr.relationship_id,
          fr.relative_id,
          fr.relationship_type,
          p.first_name,
          p.last_name,
          mr.diabetes_type,
          mr.hba1c_level,
          mr.blood_sugar_level
         FROM family_relationships fr
         JOIN patients p ON fr.relative_id = p.patient_id
         LEFT JOIN medical_records mr ON p.patient_id = mr.patient_id
         WHERE fr.patient_id = ?`,
        [patientId]
      );

      // Calculate diabetes statistics
      const [statsResult] = await connection.query(
        `SELECT 
          COUNT(DISTINCT fr.relative_id) as total_relatives,
          COUNT(DISTINCT CASE WHEN mr.diabetes_type IS NOT NULL THEN fr.relative_id END) as diabetic_relatives,
          AVG(mr.hba1c_level) as avg_hba1c,
          AVG(mr.blood_sugar_level) as avg_blood_sugar
         FROM family_relationships fr
         LEFT JOIN medical_records mr ON fr.relative_id = mr.patient_id
         WHERE fr.patient_id = ?`,
        [patientId]
      );

      const response = {
        success: true,
        data: {
          patient: patientRows[0],
          familyTree: familyRows,
          diabetesStats: {
            total_relatives: statsResult[0].total_relatives || 0,
            diabetic_relatives: statsResult[0].diabetic_relatives || 0,
            avg_hba1c: statsResult[0].avg_hba1c,
            avg_blood_sugar: statsResult[0].avg_blood_sugar
          }
        }
      };

      console.log('Sending response:', response);
      res.json(response);

    } catch (error) {
      console.error('Error in getFamilyTree:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch family tree',
        details: error.message
      });
    } finally {
      if (connection) {
        connection.release();
      }
    }
  },

  // Keep your existing addRelation method as is
  addRelation: async (req, res) => {
    // Your existing code remains the same
  }
};

module.exports = FamilyController;