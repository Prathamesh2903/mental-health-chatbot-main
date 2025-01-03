import express from "express";
import cors from "cors"
import cookieParser from "cookie-parser"
import session from 'express-session';
import MongoStore from 'connect-mongo';

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(
    session({
      secret: process.env.SESSION_SECRET ,
      resave: false,
      saveUninitialized: true,
      store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI, 
        collectionName: 'sessions',      
        crypto: {
          secret: process.env.MONGO_STORE_SECRET , // Optional: Encrypt session data
        },
      }),
    })
  );

app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended: true, limit:"16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

// routes import 
import chatBotRouter from "./routes/chat-bot.routes.js";


// routes declaration
app.use("/api", chatBotRouter)


app.listen(3001 , () => {
    console.log("server is running")
})

export { app }