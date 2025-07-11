import express from 'express';
import authRoute from './routes/auth.Route.js'; // Adjust the path as necessary
import userRoute from './routes/user.Route.js'; // Adjust the path as necessary
import { connectDB } from './lib/database.js';
const app = express();
import cookieParser from 'cookie-parser';

app.use(express.json()); // Middleware to parse JSON bodies
app.use(cookieParser()); // Middleware to parse cookies


app.use("/api/auth" , authRoute);
app.use("/api/users" , userRoute) 


app.listen(5001 , ()=> {
    console.log(`Server is running on port 5001`);
    connectDB();
})
