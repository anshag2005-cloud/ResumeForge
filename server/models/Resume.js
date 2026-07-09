const mongoose = require('mongoose');

const ResumeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  filename: {
    type: String,
    required: true
  },
  filePath: {
    type: String,
    required: true
  },
  parsedContent: {
    name: { type: String, default: '' },
    email: { type: String, default: '' },
    phone: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    github: { type: String, default: '' },
    portfolio: { type: String, default: '' },
    summary: { type: String, default: '' },
    skills: {
      technical: [String],
      soft: [String]
    },
    experience: [{
      role: String,
      company: String,
      duration: String,
      description: String
    }],
    education: [{
      degree: String,
      school: String,
      year: String
    }],
    projects: [{
      title: String,
      description: String
    }],
    certifications: [String],
    languages: [String]
  },
  uploadedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Resume', ResumeSchema);
