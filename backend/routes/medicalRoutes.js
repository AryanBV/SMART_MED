const express = require('express');
const router = express.Router();
const MedicalRecordController = require('../controllers/medicalRecordController');

// Medical record routes
router.post('/', MedicalRecordController.createRecord);
router.get('/patient/:patientId', MedicalRecordController.getPatientRecords);
router.get('/progression/:patientId', MedicalRecordController.getDiabetesProgression);
router.get('/:id', MedicalRecordController.getRecord);
router.put('/:id', MedicalRecordController.updateRecord);
router.delete('/:id', MedicalRecordController.deleteRecord);

module.exports = router;