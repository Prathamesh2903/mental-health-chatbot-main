import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema({
  sessionId: { type: String, required: true },
  history: [
    {
      role: { type: String, required: true },
      parts: [{ text: { type: String, required: true } }],
    },
  ],
});

export const chatModel = mongoose.model('Chat', chatSchema);