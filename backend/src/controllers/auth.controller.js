import User from "../models/User.js"
import jwt from "jsonwebtoken";
import {JWT_SECRET_KEY } from "../../constants.js";
import express from 'express';
import bcrypt from "bcryptjs"; // Import bcrypt for password hashing
import { upsertStreamUser } from "../lib/stream.js";// import { upsertStreamUser } from "../lib/stream.js";

const app = express();
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
          email,
          password,
          profilePic: randomAvatar,
        });

         //creating thestream data
          try
          {
            await upsertStreamUser({
            id : user._id.toString(),
            name : user.fullName, 
            image : user.profilePic || "",

          })
        console.log("Stream user created successfully for user:", user.fullName);
        }
          catch(error) {
            console.error("Error upserting Stream user:", error.message);
          }
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

    const user = await User.findOne({ email });   //returns user instance
//    user is full user instance not only email   
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

export async function logout(req, res) {
    // Handle user logout logic here
    res.clearCookie("jwt"); // Clear the cookie
    // Optionally, you can also invalidate the token on the server side if needed   

    res.status(200).send("Logged out successfully");
}

export async function onboard(req, res) {
  try {
    const userId = req.user._id; // Get the user ID from the request object
   
    const {fullName, bio, nativeLanguage, learningLanguage, location} = req.body;

    if(!fullName || !bio || !nativeLanguage || !learningLanguage || !location) {
      return res.status(400).json({
        success: false,
        message: "All fields are required for onboarding", 
        missingFields : [
          !fullName && "fullName",
          !bio && "bio", 
          !nativeLanguage && "nativeLanguage",
          !learningLanguage && "learningLanguage",
          !location && "location"
        ].filter(Boolean) // Filter out undefined values
      });     
     
    }

    //update user is Database
    const updatedUser = await User.findByIdAndUpdate(userId, {
      ...req.body,
      isOnboarded: true,
    },
    { new: true }
  )
  if(!updatedUser) {
    return res.status(404).json({
      success: false,
      message: "User not found"
    })}

    //update user in Stream
    try {
      await upsertStreamUser({
        id : updatedUser._id.toString(),
        name : updatedUser.fullName,  
        profilePic : updatedUser.profilePic || "",
      })
      console.log("Stream user updated successfully for user:", updatedUser.fullName);
    } catch (streamError) {
      console.error("Error updating user in Stream:", streamError.message);
    }

    res.status(200).json({
      success: true,
      message: "Onboarding successful",
      user: {
        id: updatedUser._id,
        fullName: updatedUser.fullName,
        email: updatedUser.email,
        profilePic: updatedUser.profilePic,
        bio: updatedUser.bio,
        nativeLanguage: updatedUser.nativeLanguage,
        learningLanguage: updatedUser.learningLanguage,
        location: updatedUser.location,
      }
    });

} catch (error) {
  console.error("Error during onboarding:", error.message);
  res.status(500).json({
    success: false,
    error: error.message
  });
}}