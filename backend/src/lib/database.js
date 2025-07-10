import mongoose from 'mongoose';
import { MONGO_URL } from '../../constants.js';

export const connectDB = async ()=>{
    try {
      const connection =   await mongoose.connect(MONGO_URL)
      console.log(`Database connected successfully.`);
    } catch (error) {
      console.error(`Error connecting to MongoDB: ${error.message}`);
    }
}