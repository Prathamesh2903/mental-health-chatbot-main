import { Router } from "express";
import { chat, clearChat } from "../controllers/chat-bot.js";

const chatBotRouter = Router()

chatBotRouter.route("/answerQuery").post(
    chat
 )

 chatBotRouter.route("/clearChat").post(
    clearChat
 )
export default chatBotRouter