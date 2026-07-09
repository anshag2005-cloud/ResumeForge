const express = require('express');
const router = express.Router();
const trackerController = require('../controllers/trackerController');
const authMiddleware = require('../middleware/auth');

router.post('/', authMiddleware, trackerController.createApplication);
router.get('/', authMiddleware, trackerController.getApplications);
router.put('/:id', authMiddleware, trackerController.updateApplication);
router.delete('/:id', authMiddleware, trackerController.deleteApplication);

module.exports = router;
