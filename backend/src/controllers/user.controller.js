import express from 'express';
import User from '../models/User.js'; // Adjust the path as necessary


export async function getRecommendedUsers(req, res) {
    try {
        console.log("Fetching recommended users");
        const currentUserId = req.user.id; // Assuming req.user is set by the protectRoute middleware
        const currentUser = req.user // Fetch current user with friends and isOnboarded fields
        
         const recommendedUsers = await User.find({
           $and: [
             { _id: { $ne: currentUserId } }, // Exclude current user
             { _id: { $nin: currentUser.friends } }, // Exclude friends
             { isOnboarded: true }, // Only include users who are onboarded
           ],
         });

         res.status(200).json({ recommendedUsers });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
export async function getMyFriends(req, res) {}
