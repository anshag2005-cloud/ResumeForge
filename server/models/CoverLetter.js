const mongoose = require('mongoose');

const CoverLetterSchema = new mongoose.Schema({
  resumeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Resume',
    required: true
  },
  companyName: {
    type: String,
    required: true
  },
  jobTitle: {
    type: String,
    required: true
  },
  letterText: {
    type: String,
    required: true
  },
  tone: {
    type: String,
    default: 'professional'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('CoverLetter', CoverLetterSchema);
