const mongoose = require('mongoose');

const JobApplicationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  company: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Wishlist', 'Applied', 'Interviewing', 'Offered', 'Rejected'],
    default: 'Applied'
  },
  notes: {
    type: String,
    default: ''
  },
  salary: {
    type: String,
    default: ''
  },
  bookmarked: {
    type: Boolean,
    default: false
  },
  appliedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('JobApplication', JobApplicationSchema);
