const mongoose = require('mongoose');

const staffQuestionTrackerSchema = new mongoose.Schema({
  staffId: { type: mongoose.Schema.Types.ObjectId, ref: 'addStaff', required: true },
  questionsAnswered: [{
    questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question', required: true },
    answeredAt: { type: Date, default: Date.now }
  }]
});

const StaffQuestionTracker = mongoose.model('StaffQuestionTracker', staffQuestionTrackerSchema);

module.exports = StaffQuestionTracker;
