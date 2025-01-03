import { GoogleGenerativeAI } from '@google/generative-ai';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { chatModel } from '../models/chat-bot.models.js';
import { decryptData } from '../utils/encryption.js';

const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

const chat = asyncHandler(async (req, res) => {
  const { prompt } = req.body;
  const sessionId = req.session.id;

  if (!prompt) throw new ApiError('Please enter a valid prompt');

  let chatHistory = await chatModel.findOne({ sessionId });
  if (!chatHistory) {
    chatHistory = new chatModel({
      sessionId,
      history: [
        { role: 'user', parts: [{ text: 'Hello' }] },
        { role: 'model', parts: [{ text: 'Great to meet you. What would you like to know?' }] },
      ],
    });
    await chatHistory.save();
  }

  const formattedHistory = chatHistory.history.map((entry) => ({
    role: entry.role,
    parts: entry.parts.map((part) => ({ text: decryptData(part.text) })),
  }));

  const result = await model.startChat({ history: formattedHistory }).sendMessage(prompt);
  const botReply = result.response.text();

  chatHistory.history.push({ role: 'user', parts: [{ text: prompt }] });
  chatHistory.history.push({ role: 'model', parts: [{ text: botReply }] });
  await chatHistory.save();

  return res.status(200).json({
    history: chatHistory.history.map((entry) => ({
      role: entry.role,
      parts: entry.parts.map((part) => ({ text: decryptData(part.text) })),
    })),
  });
});

const clearChat = asyncHandler(async (req, res) => {
  const sessionId = req.session.id;
  await chatModel.deleteOne({ sessionId });
  return res.status(200).json(new ApiResponse('Chat deleted successfully'));
});

export { chat, clearChat };
