const mongoose = require('mongoose');

const JobMatchSchema = new mongoose.Schema({
  resumeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Resume',
    required: true
  },
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'JobDescription',
    required: true
  },
  matchScore: {
    type: Number,
    required: true
  },
  matchingSkills: {
    type: [String],
    default: []
  },
  missingKeywords: {
    type: [String],
    default: []
  },
  suggestions: {
    type: [String],
    default: []
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('JobMatch', JobMatchSchema);
