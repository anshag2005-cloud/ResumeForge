const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');
const authMiddleware = require('../middleware/auth');

router.post('/match', authMiddleware, jobController.matchResumeToJob);
router.get('/history', authMiddleware, jobController.getMatchHistory);

module.exports = router;
