import express from 'express';
import authRoute from './routes/auth.Route.js'; // Adjust the path as necessary
import { connectDB } from './lib/database.js';
const app = express();


app.use("/api/auth" , authRoute);
app.listen(5001 , ()=> {
    console.log(`Server is running on port 5001`);
    connectDB();
})
