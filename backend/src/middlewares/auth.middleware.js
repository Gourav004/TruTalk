    import jwt from 'jsonwebtoken';
    import User from '../models/User.js';
    import { JWT_SECRET_KEY } from '../../constants.js';

    export const protectRoute = async (req, res, next) => {
        try {
            const token =  req.cookies.jwt; // Assuming the JWT is stored in a cookie named 'jwt'
            if(!token){
                return res.status(401).json({ message: 'Unauthorized - NO token provided' });
            } 
            const decoded =  jwt.verify(token ,JWT_SECRET_KEY)
            if(!decoded){
                return res.status(401).json({ message: 'Unauthorized - Invalid token' });
            } 

            const user =  await User.findById(decoded.id).select("-password");
            if(!user){
                return res.status(401).json({ message: 'Unauthorized - User not found' });
            }

            req.user=  user; // Attach user to request object ki bhai yhi hai user jo req bhej rha hai.
            next(); // Proceed to the next middleware or route handler
          

        } catch (error) {
            console.log("Error in protectRoute middleware:", error.message);
        }
    }