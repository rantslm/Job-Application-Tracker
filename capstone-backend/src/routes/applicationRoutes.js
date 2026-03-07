const express = require('express');
const router = express.Router();

const applicationController = require('../controllers/applicationController');
const authMiddleware = require('../middleware/authMiddleware');

// Get all applications
router.get('/', authMiddleware, applicationController.getApplications);

// Get one application by id
router.get('/:id', authMiddleware, applicationController.getApplicationById);

// Create a new application
router.post('/', authMiddleware, applicationController.createApplication);

// Update an application
router.put('/:id', authMiddleware, applicationController.updateApplication);

// Delete an application
router.delete('/:id', authMiddleware, applicationController.deleteApplication);

module.exports = router;
