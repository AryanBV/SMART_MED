const express = require('express');
const router = express.Router();
const FamilyController = require('../controllers/familyController');

// GET family tree for a patient
router.get('/tree/:id', FamilyController.getFamilyTree);

// POST new family relation with error handling
router.post('/relation', async (req, res) => {
    try {
        console.log('Received request body:', req.body); // Debug log
        await FamilyController.addRelation(req, res);
    } catch (error) {
        console.error('Route error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to add family member',
            details: error.message
        });
    }
});

// Keep your existing risk, update, and delete routes
router.get('/risk/:id', (_req, res) => {
    res.json({
        success: true,
        message: 'Risk calculation endpoint - to be implemented'
    });
});

router.put('/relation/:id', (_req, res) => {
    res.json({
        success: true,
        message: 'Family member update endpoint - to be implemented'
    });
});

router.delete('/relation/:id', (_req, res) => {
    res.json({
        success: true,
        message: 'Family member deletion endpoint - to be implemented'
    });
});

module.exports = router;