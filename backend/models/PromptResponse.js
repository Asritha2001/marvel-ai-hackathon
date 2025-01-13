const mongoose = require('mongoose');

const promptResponseSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  prompt: {
    type: String,
    required: true,
  },
  response: {
    type: String,
  },
  completedLesson: {
    type:Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const PromptResponse = mongoose.model('PromptResponse', promptResponseSchema);

module.exports = PromptResponse;