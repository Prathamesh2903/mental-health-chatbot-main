import mongoose from 'mongoose';
import { encryptData } from '../utils/encryption.js';

const chatSchema = new mongoose.Schema({
  sessionId: { type: String, required: true },
  history: [
    {
      role: { type: String, required: true },
      parts: [{ text: { type: String, required: true } }],
    },
  ],
});

// Pre-save hook: Encrypt text fields before saving
chatSchema.pre('save', function (next) {
  if (this.isModified('history')) {
    this.history.forEach((entry) => {
      entry.parts.forEach((part) => {
        if (!part.text.startsWith('eyJ')) { // Avoid re-encrypting already encrypted data
          part.text = encryptData(part.text);
        }
      });
    });
  }
  next();
});

export const chatModel = mongoose.model('Chat', chatSchema);
