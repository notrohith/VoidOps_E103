import Fundraiser from '../models/Fundraiser.js';
import BusinessUser from '../models/BusinessUser.js';
import NormalUser from '../models/NormalUser.js';

// @desc    Create a new fundraiser
// @route   POST /api/fundraisers
// @access  Private (Business users only)
export const createFundraiser = async (req, res) => {
  try {
    const { title, description, goalAmount, purpose, duration } = req.body;

    // Validation
    if (!title || !description || !goalAmount || !purpose || !duration) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields',
      });
    }

    // Check if business user
    if (req.user.userType !== 'business') {
      return res.status(403).json({
        success: false,
        message: 'Only business users can create fundraisers',
      });
    }

    // Check for active fundraiser
    const existingFundraiser = await Fundraiser.findOne({
      businessOwner: req.user._id,
      status: 'active',
    });

    if (existingFundraiser) {
      return res.status(400).json({
        success: false,
        message: 'You already have an active fundraiser. Complete or cancel it first.',
      });
    }

    // Create fundraiser
    const fundraiser = await Fundraiser.create({
      businessOwner: req.user._id,
      title,
      description,
      goalAmount,
      purpose,
      duration,
    });

    // Populate business owner details
    await fundraiser.populate('businessOwner', 'name businessProfile');

    res.status(201).json({
      success: true,
      message: 'Fundraiser created successfully',
      data: fundraiser,
    });
  } catch (error) {
    console.error('Create fundraiser error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error creating fundraiser',
    });
  }
};

// @desc    Get all fundraisers (with filters)
// @route   GET /api/fundraisers
// @access  Public
export const getAllFundraisers = async (req, res) => {
  try {
    const { status, city, state, businessType, search } = req.query;

    let filter = {};

    // Filter by status
    if (status) {
      filter.status = status;
    } else {
      filter.status = 'active'; // Default to active
    }

    const fundraisers = await Fundraiser.find(filter)
      .populate({
        path: 'businessOwner',
        select: 'name businessProfile',
      })
      .sort({ createdAt: -1 });

    // Apply additional filters after population
    let filteredFundraisers = fundraisers;

    if (city) {
      filteredFundraisers = filteredFundraisers.filter(
        (f) =>
          f.businessOwner.businessProfile.location.city
            .toLowerCase()
            .includes(city.toLowerCase())
      );
    }

    if (state) {
      filteredFundraisers = filteredFundraisers.filter(
        (f) =>
          f.businessOwner.businessProfile.location.state
            .toLowerCase()
            .includes(state.toLowerCase())
      );
    }

    if (businessType) {
      filteredFundraisers = filteredFundraisers.filter(
        (f) => f.businessOwner.businessProfile.businessType === businessType
      );
    }

    if (search) {
      filteredFundraisers = filteredFundraisers.filter(
        (f) =>
          f.title.toLowerCase().includes(search.toLowerCase()) ||
          f.businessOwner.businessProfile.businessName
            .toLowerCase()
            .includes(search.toLowerCase())
      );
    }

    res.status(200).json({
      success: true,
      count: filteredFundraisers.length,
      data: filteredFundraisers,
    });
  } catch (error) {
    console.error('Get fundraisers error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching fundraisers',
    });
  }
};

// @desc    Get single fundraiser
// @route   GET /api/fundraisers/:id
// @access  Public
export const getFundraiserById = async (req, res) => {
  try {
    const fundraiser = await Fundraiser.findById(req.params.id).populate({
      path: 'businessOwner',
      select: 'name email phone businessProfile',
    });

    if (!fundraiser) {
      return res.status(404).json({
        success: false,
        message: 'Fundraiser not found',
      });
    }

    res.status(200).json({
      success: true,
      data: fundraiser,
    });
  } catch (error) {
    console.error('Get fundraiser error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching fundraiser',
    });
  }
};

// @desc    Get user's own fundraisers
// @route   GET /api/fundraisers/my/all
// @access  Private (Business users only)
export const getMyFundraisers = async (req, res) => {
  try {
    if (req.user.userType !== 'business') {
      return res.status(403).json({
        success: false,
        message: 'Only business users can access this route',
      });
    }

    const fundraisers = await Fundraiser.find({
      businessOwner: req.user._id,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: fundraisers.length,
      data: fundraisers,
    });
  } catch (error) {
    console.error('Get my fundraisers error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching fundraisers',
    });
  }
};

// @desc    Update fundraiser
// @route   PUT /api/fundraisers/:id
// @access  Private (Owner only)
export const updateFundraiser = async (req, res) => {
  try {
    const fundraiser = await Fundraiser.findById(req.params.id);

    if (!fundraiser) {
      return res.status(404).json({
        success: false,
        message: 'Fundraiser not found',
      });
    }

    // Check ownership
    if (fundraiser.businessOwner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this fundraiser',
      });
    }

    // Only allow updates to active fundraisers
    if (fundraiser.status !== 'active') {
      return res.status(400).json({
        success: false,
        message: 'Cannot update a completed or cancelled fundraiser',
      });
    }

    // Update allowed fields
    const { title, description, purpose } = req.body;

    if (title) fundraiser.title = title;
    if (description) fundraiser.description = description;
    if (purpose) fundraiser.purpose = purpose;

    await fundraiser.save();

    res.status(200).json({
      success: true,
      message: 'Fundraiser updated successfully',
      data: fundraiser,
    });
  } catch (error) {
    console.error('Update fundraiser error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error updating fundraiser',
    });
  }
};

// @desc    Cancel fundraiser
// @route   PUT /api/fundraisers/:id/cancel
// @access  Private (Owner only)
export const cancelFundraiser = async (req, res) => {
  try {
    const fundraiser = await Fundraiser.findById(req.params.id);

    if (!fundraiser) {
      return res.status(404).json({
        success: false,
        message: 'Fundraiser not found',
      });
    }

    // Check ownership
    if (fundraiser.businessOwner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this fundraiser',
      });
    }

    if (fundraiser.status !== 'active') {
      return res.status(400).json({
        success: false,
        message: 'Fundraiser is not active',
      });
    }

    fundraiser.status = 'cancelled';
    await fundraiser.save();

    res.status(200).json({
      success: true,
      message: 'Fundraiser cancelled successfully',
      data: fundraiser,
    });
  } catch (error) {
    console.error('Cancel fundraiser error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error cancelling fundraiser',
    });
  }
};

// @desc    Support/Donate to fundraiser
// @route   POST /api/fundraisers/:id/support
// @access  Private (Normal users only)
export const supportFundraiser = async (req, res) => {
  try {
    const { amount, message } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid donation amount',
      });
    }

    // Check if normal user
    if (req.user.userType !== 'normal') {
      return res.status(403).json({
        success: false,
        message: 'Only normal users can donate to fundraisers',
      });
    }

    const fundraiser = await Fundraiser.findById(req.params.id);

    if (!fundraiser) {
      return res.status(404).json({
        success: false,
        message: 'Fundraiser not found',
      });
    }

    if (fundraiser.status !== 'active') {
      return res.status(400).json({
        success: false,
        message: 'This fundraiser is not accepting donations',
      });
    }

    // Check if fundraiser has ended
    if (new Date() > fundraiser.endDate) {
      fundraiser.status = 'completed';
      await fundraiser.save();
      return res.status(400).json({
        success: false,
        message: 'This fundraiser has ended',
      });
    }

    // Add supporter to fundraiser
    fundraiser.supporters.push({
      user: req.user._id,
      amount,
      message: message || '',
    });

    // Update current amount
    fundraiser.currentAmount += amount;

    // Check if goal reached
    if (fundraiser.currentAmount >= fundraiser.goalAmount) {
      fundraiser.status = 'completed';
    }

    await fundraiser.save();

    // Add to user's donation history
    const normalUser = await NormalUser.findById(req.user._id);
    normalUser.donationHistory.push({
      fundraiserId: fundraiser._id,
      amount,
    });
    await normalUser.save();

    res.status(200).json({
      success: true,
      message: 'Thank you for your support!',
      data: {
        fundraiser,
        totalRaised: fundraiser.currentAmount,
        goalReached: fundraiser.currentAmount >= fundraiser.goalAmount,
      },
    });
  } catch (error) {
    console.error('Support fundraiser error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error processing donation',
    });
  }
};

// @desc    Get user's donation history
// @route   GET /api/fundraisers/donations/history
// @access  Private (Normal users only)
export const getDonationHistory = async (req, res) => {
  try {
    if (req.user.userType !== 'normal') {
      return res.status(403).json({
        success: false,
        message: 'Only normal users can access donation history',
      });
    }

    const normalUser = await NormalUser.findById(req.user._id).populate({
      path: 'donationHistory.fundraiserId',
      select: 'title businessOwner status',
      populate: {
        path: 'businessOwner',
        select: 'businessProfile.businessName',
      },
    });

    res.status(200).json({
      success: true,
      count: normalUser.donationHistory.length,
      data: normalUser.donationHistory,
    });
  } catch (error) {
    console.error('Get donation history error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching donation history',
    });
  }
};