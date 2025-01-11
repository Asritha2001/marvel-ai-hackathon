const mongoose = require('mongoose');

const promptResponseSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  prompt: {
    type: String,
    required: true,
  },
  response: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const PromptResponse = mongoose.model('PromptResponse', promptResponseSchema);

module.exports = PromptResponse;