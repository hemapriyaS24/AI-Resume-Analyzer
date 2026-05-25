const express = require('express');
const router = express.Router();
const multer = require('multer');
const jwt = require('jsonwebtoken');
const resumeController = require('../controllers/resumeController');
const authMiddleware = require('../middleware/authMiddleware');

// Configure multer memory storage for resume uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// Optional authentication middleware for resume upload
const optionalAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecret_neon_glow_resume_analyzer_key_12345');
      req.user = decoded.userId;
    } catch (err) {
      // Token expired or invalid, proceed as guest
    }
  }
  next();
};

// Resume management routes
router.post('/upload', upload.single('resume'), optionalAuth, resumeController.uploadAndAnalyze);
router.get('/history', authMiddleware, resumeController.getHistory);
router.get('/:id', optionalAuth, resumeController.getResumeById);
router.post('/:id/optimize', optionalAuth, resumeController.optimizeResume);

module.exports = router;
