import Collaboration from '../models/Collaboration.js';
import BusinessUser from '../models/BusinessUser.js';

// @desc    Send collaboration request
// @route   POST /api/collaborations
// @access  Private (Business users only)
export const sendCollaborationRequest = async (req, res) => {
  try {
    const { receiverId, collaborationType, message } = req.body;

    // Validation
    if (!receiverId || !collaborationType || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields',
      });
    }

    // Check if business user
    if (req.user.userType !== 'business') {
      return res.status(403).json({
        success: false,
        message: 'Only business users can send collaboration requests',
      });
    }

    // Check if trying to collaborate with self
    if (receiverId === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Cannot send collaboration request to yourself',
      });
    }

    // Check if receiver exists and is a business user
    const receiver = await BusinessUser.findById(receiverId);
    if (!receiver) {
      return res.status(404).json({
        success: false,
        message: 'Business not found',
      });
    }

    // Check for existing pending request
    const existingRequest = await Collaboration.findOne({
      sender: req.user._id,
      receiver: receiverId,
      status: 'pending',
    });

    if (existingRequest) {
      return res.status(400).json({
        success: false,
        message: 'You already have a pending request with this business',
      });
    }

    // Create collaboration request
    const collaboration = await Collaboration.create({
      sender: req.user._id,
      receiver: receiverId,
      collaborationType,
      message,
    });

    // Populate sender and receiver details
    await collaboration.populate([
      {
        path: 'sender',
        select: 'name businessProfile.businessName businessProfile.businessType businessProfile.location',
      },
      {
        path: 'receiver',
        select: 'name businessProfile.businessName businessProfile.businessType businessProfile.location',
      },
    ]);

    res.status(201).json({
      success: true,
      message: 'Collaboration request sent successfully',
      data: collaboration,
    });
  } catch (error) {
    console.error('Send collaboration error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error sending collaboration request',
    });
  }
};

// @desc    Get all collaboration requests (sent and received)
// @route   GET /api/collaborations
// @access  Private (Business users only)
export const getCollaborations = async (req, res) => {
  try {
    if (req.user.userType !== 'business') {
      return res.status(403).json({
        success: false,
        message: 'Only business users can access collaborations',
      });
    }

    const { type, status } = req.query;

    let filter = {};

    // Filter by type (sent or received)
    if (type === 'sent') {
      filter.sender = req.user._id;
    } else if (type === 'received') {
      filter.receiver = req.user._id;
    } else {
      // Both sent and received
      filter.$or = [{ sender: req.user._id }, { receiver: req.user._id }];
    }

    // Filter by status
    if (status) {
      filter.status = status;
    }

    const collaborations = await Collaboration.find(filter)
      .populate([
        {
          path: 'sender',
          select: 'name businessProfile.businessName businessProfile.businessType businessProfile.location',
        },
        {
          path: 'receiver',
          select: 'name businessProfile.businessName businessProfile.businessType businessProfile.location',
        },
      ])
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: collaborations.length,
      data: collaborations,
    });
  } catch (error) {
    console.error('Get collaborations error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching collaborations',
    });
  }
};

// @desc    Get collaboration by ID
// @route   GET /api/collaborations/:id
// @access  Private (Business users only)
export const getCollaborationById = async (req, res) => {
  try {
    if (req.user.userType !== 'business') {
      return res.status(403).json({
        success: false,
        message: 'Only business users can access collaborations',
      });
    }

    const collaboration = await Collaboration.findById(req.params.id).populate([
      {
        path: 'sender',
        select: 'name email phone businessProfile',
      },
      {
        path: 'receiver',
        select: 'name email phone businessProfile',
      },
    ]);

    if (!collaboration) {
      return res.status(404).json({
        success: false,
        message: 'Collaboration not found',
      });
    }

    // Check if user is part of this collaboration
    if (
      collaboration.sender._id.toString() !== req.user._id.toString() &&
      collaboration.receiver._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this collaboration',
      });
    }

    res.status(200).json({
      success: true,
      data: collaboration,
    });
  } catch (error) {
    console.error('Get collaboration error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching collaboration',
    });
  }
};

// @desc    Respond to collaboration request (accept/reject)
// @route   PUT /api/collaborations/:id/respond
// @access  Private (Receiver only)
export const respondToCollaboration = async (req, res) => {
  try {
    const { status, responseMessage } = req.body;

    // Validation
    if (!status || !['accepted', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide valid response status (accepted or rejected)',
      });
    }

    const collaboration = await Collaboration.findById(req.params.id);

    if (!collaboration) {
      return res.status(404).json({
        success: false,
        message: 'Collaboration not found',
      });
    }

    // Check if user is the receiver
    if (collaboration.receiver.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Only the receiver can respond to this request',
      });
    }

    // Check if already responded
    if (collaboration.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'This collaboration request has already been responded to',
      });
    }

    // Update collaboration
    collaboration.status = status;
    collaboration.responseMessage = responseMessage || '';
    collaboration.responseDate = new Date();

    await collaboration.save();

    await collaboration.populate([
      {
        path: 'sender',
        select: 'name businessProfile.businessName',
      },
      {
        path: 'receiver',
        select: 'name businessProfile.businessName',
      },
    ]);

    res.status(200).json({
      success: true,
      message: `Collaboration request ${status}`,
      data: collaboration,
    });
  } catch (error) {
    console.error('Respond to collaboration error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error responding to collaboration',
    });
  }
};

// @desc    Mark collaboration as completed
// @route   PUT /api/collaborations/:id/complete
// @access  Private (Sender or Receiver)
export const completeCollaboration = async (req, res) => {
  try {
    const collaboration = await Collaboration.findById(req.params.id);

    if (!collaboration) {
      return res.status(404).json({
        success: false,
        message: 'Collaboration not found',
      });
    }

    // Check if user is part of collaboration
    if (
      collaboration.sender.toString() !== req.user._id.toString() &&
      collaboration.receiver.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this collaboration',
      });
    }

    // Check if collaboration was accepted
    if (collaboration.status !== 'accepted') {
      return res.status(400).json({
        success: false,
        message: 'Only accepted collaborations can be marked as completed',
      });
    }

    collaboration.status = 'completed';
    await collaboration.save();

    res.status(200).json({
      success: true,
      message: 'Collaboration marked as completed',
      data: collaboration,
    });
  } catch (error) {
    console.error('Complete collaboration error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error completing collaboration',
    });
  }
};

// @desc    Cancel collaboration request
// @route   DELETE /api/collaborations/:id
// @access  Private (Sender only)
export const cancelCollaboration = async (req, res) => {
  try {
    const collaboration = await Collaboration.findById(req.params.id);

    if (!collaboration) {
      return res.status(404).json({
        success: false,
        message: 'Collaboration not found',
      });
    }

    // Check if user is the sender
    if (collaboration.sender.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Only the sender can cancel this request',
      });
    }

    // Can only cancel pending requests
    if (collaboration.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Can only cancel pending collaboration requests',
      });
    }

    await collaboration.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Collaboration request cancelled',
    });
  } catch (error) {
    console.error('Cancel collaboration error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error cancelling collaboration',
    });
  }
};

// @desc    Get collaboration statistics
// @route   GET /api/collaborations/stats
// @access  Private (Business users only)
export const getCollaborationStats = async (req, res) => {
  try {
    if (req.user.userType !== 'business') {
      return res.status(403).json({
        success: false,
        message: 'Only business users can access collaboration stats',
      });
    }

    const stats = {
      sent: {
        total: 0,
        pending: 0,
        accepted: 0,
        rejected: 0,
        completed: 0,
      },
      received: {
        total: 0,
        pending: 0,
        accepted: 0,
        rejected: 0,
        completed: 0,
      },
    };

    // Sent collaborations
    const sentCollabs = await Collaboration.find({ sender: req.user._id });
    stats.sent.total = sentCollabs.length;
    stats.sent.pending = sentCollabs.filter((c) => c.status === 'pending').length;
    stats.sent.accepted = sentCollabs.filter((c) => c.status === 'accepted').length;
    stats.sent.rejected = sentCollabs.filter((c) => c.status === 'rejected').length;
    stats.sent.completed = sentCollabs.filter((c) => c.status === 'completed').length;

    // Received collaborations
    const receivedCollabs = await Collaboration.find({ receiver: req.user._id });
    stats.received.total = receivedCollabs.length;
    stats.received.pending = receivedCollabs.filter((c) => c.status === 'pending').length;
    stats.received.accepted = receivedCollabs.filter((c) => c.status === 'accepted').length;
    stats.received.rejected = receivedCollabs.filter((c) => c.status === 'rejected').length;
    stats.received.completed = receivedCollabs.filter((c) => c.status === 'completed').length;

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error('Get collaboration stats error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching collaboration stats',
    });
  }
};