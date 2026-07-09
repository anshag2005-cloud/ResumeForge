const express = require('express');
const router = express.Router();
const multer = require('multer');
const resumeController = require('../controllers/resumeController');
const authMiddleware = require('../middleware/auth');

// Initialize Multer memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

router.post('/upload', authMiddleware, upload.single('file'), resumeController.uploadResume);
router.get('/', authMiddleware, resumeController.getResumes);
router.get('/:id', authMiddleware, resumeController.getResume);
router.get('/:id/report', authMiddleware, resumeController.getResumeReport);
router.delete('/:id', authMiddleware, resumeController.deleteResume);

module.exports = router;
