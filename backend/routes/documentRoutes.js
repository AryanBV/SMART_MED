const express = require('express');
const router = express.Router();
const DocumentController = require('../controllers/documentController');

// Document routes
router.post('/upload', DocumentController.uploadDocument);
router.get('/patient/:patientId', DocumentController.getPatientDocuments);
router.get('/:id', DocumentController.getDocument);
router.delete('/:id', DocumentController.deleteDocument);

module.exports = router;