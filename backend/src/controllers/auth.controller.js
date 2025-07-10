import User from "../models/User.js"
import jwt from "jsonwebtoken";
import {JWT_SECRET_KEY } from "../../constants.js";
import express from 'express';
 const app = express();
 import bcrypt from "bcryptjs"; // Import bcrypt for password hashing

app.use(express.json()); // Middleware to parse JSON bodies


export async function signup(req, res) {
    // Handle user signup logic here
    
    try {
        const { email, password , fullName} = req.body;
        //all safety checks
        if(!email || !password || !fullName) {
            return res.status(400).send("All fields are required");
        }
        if(password.length < 6) {
            return res.status(400).send("Password must be at least 6 characters long");
        }
         const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
         if(emailRegex.test(email) === false) {
            return res.status(400).send("Invalid email format");
        }

        const existingUser = await User.findOne({email});
        if(existingUser) {
            return res.status(400).send("Email already existed");
        }

        //onboarding user
        const idx = Math.floor(Math.random() * 100) +1;
        const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`;

        const user = await User.create({
            fullName,
            email ,
            password,
            profilePic: randomAvatar,
        })

         //making up a token
        const token = jwt.sign({id : user._id} , JWT_SECRET_KEY , {expiresIn : "7d"} );
         // wraping it into a cookie
         res.cookie("jwt" , token , {
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            httpOnly: true, // Prevents client-side JavaScript from accessing the cookie    
            // secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
            sameSite: 'strict' // Helps prevent CSRF attacks
         })

         console.log(req.body);
         
        // Sending response

        res.status(201).json({message : "Signed up Successfully" , user : user});

    } catch (error) {
       return res.status(500).json({
         success: false,
         message: "Something went wrong",
         error: error.message,
         
       });
    }
    // res.send("User signed up");
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;

    // Safety checks
    if (!email || !password) {
      return res.status(400).send("All fields are required");
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).send("Invalid credentials");
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    // Check if the password is correct
    if (!isPasswordCorrect) {
      return res.status(401).send("Invalid credentials");
    }

    // Create token
    const token = jwt.sign({ id: user._id }, JWT_SECRET_KEY, {
      expiresIn: "7d",
    });

    // Set cookie
    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      httpOnly: true,
      sameSite: "strict",
    });

    // Send response
    res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        profilePic: user.profilePic,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ ERROR: error.message });
  }
}

export function logout(req, res) {
    // Handle user logout logic here
    res.clearCookie("jwt"); // Clear the cookie
    // Optionally, you can also invalidate the token on the server side if needed   

    res.status(200).send("Logged out successfully");
}