import express from 'express';
import { protectRoute } from '../middlewares/auth.middleware.js';
import { getMyFriends, getRecommendedUsers } from '../controllers/user.controller.js';


const router = express.Router();

router.use(protectRoute);   // add this middleware to all the routes

router.get("/" , getRecommendedUsers);
router.get("/friends" , getMyFriends);

export default router;