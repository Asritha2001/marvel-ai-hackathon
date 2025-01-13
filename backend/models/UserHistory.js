const mongoose = require('mongoose');

const userHistorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  experience: {
    type: String,
    required: true,
  },
  language: {
    type: String,
    required: true,
  },
  expertise: {
    type: String,
    required: true,
  },
  time: {
    type: Date,
    default: Date.now,
  },
});

const UserHistory = mongoose.model('UserHistory', userHistorySchema);

module.exports = UserHistory;
