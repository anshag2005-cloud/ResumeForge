const mongoose = require('mongoose');

console.log('--- Models Verification ---');
try {
  const User = require('../models/User');
  const Resume = require('../models/Resume');
  const ResumeAnalysis = require('../models/ResumeAnalysis');
  const JobDescription = require('../models/JobDescription');
  const JobMatch = require('../models/JobMatch');
  const CoverLetter = require('../models/CoverLetter');
  const Notification = require('../models/Notification');
  const JobApplication = require('../models/JobApplication');
  
  console.log('✓ All Mongoose schemas loaded and compiled successfully!');
  console.log('-----------------------------');
  process.exit(0);
} catch (error) {
  console.error('✗ Schema compilation failed:', error.message);
  process.exit(1);
}
