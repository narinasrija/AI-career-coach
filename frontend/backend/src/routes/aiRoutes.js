const express = require('express');
const router = express.Router();
const multer = require('multer');
const { analyzeResume, generateRoadmap, mockInterview } = require('../controllers/aiController');
const { protect } = require('../middlewares/authMiddleware');

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/analyze-resume', protect, upload.single('resume'), analyzeResume);
router.post('/roadmap', protect, generateRoadmap);
router.post('/interview', protect, mockInterview);

module.exports = router;
