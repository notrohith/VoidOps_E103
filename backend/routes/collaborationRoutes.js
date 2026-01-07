import express from 'express';
import {
  sendCollaborationRequest,
  getCollaborations,
  getCollaborationById,
  respondToCollaboration,
  completeCollaboration,
  cancelCollaboration,
  getCollaborationStats,
} from '../controllers/collaborationController.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes require authentication and business user type
router.use(protect);
router.use(restrictTo('business'));

// Collaboration routes
router.post('/', sendCollaborationRequest);
router.get('/', getCollaborations);
router.get('/stats', getCollaborationStats);
router.get('/:id', getCollaborationById);
router.put('/:id/respond', respondToCollaboration);
router.put('/:id/complete', completeCollaboration);
router.delete('/:id', cancelCollaboration);

export default router;