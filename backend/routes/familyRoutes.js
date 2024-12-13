const express = require('express');
const router = express.Router();
const FamilyController = require('../controllers/familyController');

// Family relationship routes
router.post('/relation', FamilyController.addRelation);
router.get('/tree/:id', FamilyController.getFamilyTree);
router.get('/risk/:id', FamilyController.calculateFamilyRisk);
router.put('/relation/:id', FamilyController.updateRelation);
router.delete('/relation/:id', FamilyController.removeRelation);

module.exports = router;