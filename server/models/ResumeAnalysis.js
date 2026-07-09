const mongoose = require('mongoose');

const ResumeAnalysisSchema = new mongoose.Schema({
  resumeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Resume',
    required: true
  },
  atsScore: {
    type: Number,
    required: true
  },
  formattingScore: {
    type: Number,
    required: true
  },
  keywordScore: {
    type: Number,
    required: true
  },
  sectionScores: {
    type: Map,
    of: Number,
    required: true
  },
  suggestions: {
    type: [String],
    default: []
  },
  skillsFound: {
    technical: [String],
    soft: [String]
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('ResumeAnalysis', ResumeAnalysisSchema);
