import express from 'express';
import { chatWithAI } from '../controllers/chatController.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes require authentication and business user type
router.use(protect);
router.use(restrictTo('business'));

// Chat route
router.post('/', chatWithAI);

export default router;