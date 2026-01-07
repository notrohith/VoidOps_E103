import express from 'express';
import {
  createFundraiser,
  getAllFundraisers,
  getFundraiserById,
  getMyFundraisers,
  updateFundraiser,
  cancelFundraiser,
  supportFundraiser,
  getDonationHistory,
} from '../controllers/fundraiserController.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getAllFundraisers);
router.get('/:id', getFundraiserById);

// Protected routes
router.use(protect);

// Business-only routes
router.post('/', restrictTo('business'), createFundraiser);
router.get('/my/all', restrictTo('business'), getMyFundraisers);
router.put('/:id', restrictTo('business'), updateFundraiser);
router.put('/:id/cancel', restrictTo('business'), cancelFundraiser);

// Normal user routes
router.post('/:id/support', restrictTo('normal'), supportFundraiser);
router.get('/donations/history', restrictTo('normal'), getDonationHistory);

export default router;