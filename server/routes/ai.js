const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const authMiddleware = require('../middleware/auth');

router.post('/improve/:resumeId', authMiddleware, aiController.improveResume);
router.post('/coverletter', authMiddleware, aiController.generateCoverLetter);
router.get('/coverletters', authMiddleware, aiController.getCoverLetters);
router.post('/interview', authMiddleware, aiController.generateInterviewPrep);
router.post('/roadmap/:resumeId', authMiddleware, aiController.generateCareerRoadmap);

module.exports = router;
