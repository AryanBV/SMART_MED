const express = require('express');
const router = express.Router();
const PatientController = require('../controllers/patientController');

// Patient routes
router.post('/', PatientController.createPatient);
router.get('/search', PatientController.searchPatients);
router.get('/:id', PatientController.getPatient);
router.put('/:id', PatientController.updatePatient);
router.delete('/:id', PatientController.deletePatient);

module.exports = router;