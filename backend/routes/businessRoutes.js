import express from 'express';
import {
  analyzeBusiness,
  generateGrowthPlan,
  getGrowthPlan,
  searchBusinesses,
  getBusinessById,
} from '../controllers/businessController.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Business-only routes
router.post('/analyze', restrictTo('business'), analyzeBusiness);
router.post('/growth-plan', restrictTo('business'), generateGrowthPlan);
router.get('/growth-plan', restrictTo('business'), getGrowthPlan);

// Public business routes (accessible by all authenticated users)
router.get('/search', searchBusinesses);
router.get('/:id', getBusinessById);

export default router;