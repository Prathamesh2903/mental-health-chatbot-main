import mongoose from "mongoose";
// import { DB_NAME } from "../constants.js";
import dotenv from 'dotenv'


dotenv.config({
    path: './.env'
})


const connectDB = async()=>{
    try{
        console.log('MONGODB_URI:', `${process.env.MONGODB_URI}`);
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}`)
        console.log(`\n MongoDB connected!! DB HOST: ${connectionInstance.connection.host}`);
    }catch(error){
        console.log("mongo", error);
        process.exit(1);
    }
}
export default connectDB;