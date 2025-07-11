import express from 'express';
import { signup , login, logout , onboard } from '../controllers/auth.controller.js';
import { protectRoute } from '../middlewares/auth.middleware.js';

const router = express.Router();
const app = express();
app.use(express.json()); // Middleware to parse JSON bodies

router.post("/login" , login)
router.post("/logout" , logout) 
router.post("/signup" , signup)

//this route must be protected
router.post("/boarding" , protectRoute, onboard);

export default router;
