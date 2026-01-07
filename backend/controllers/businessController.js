import BusinessUser from '../models/BusinessUser.js';

// @desc    Analyze business and generate insights
// @route   POST /api/business/analyze
// @access  Private (Business users only)
export const analyzeBusiness = async (req, res) => {
  try {
    const businessUser = await BusinessUser.findById(req.user._id);

    if (!businessUser) {
      return res.status(404).json({
        success: false,
        message: 'Business user not found',
      });
    }

    const { businessProfile } = businessUser;

    // Generate analysis based on business profile
    const analysis = {
      summary: `${businessProfile.businessName} is a ${businessProfile.businessType} business in ${businessProfile.location.city}, ${businessProfile.location.state}. Operating for ${businessProfile.yearsInOperation} years with a team of ${businessProfile.teamSize}.`,
      
      bottleneck: determineBottleneck(businessProfile),
      
      focusArea: determineFocusArea(businessProfile),
      
      recommendations: generateRecommendations(businessProfile),
    };

    res.status(200).json({
      success: true,
      data: analysis,
    });
  } catch (error) {
    console.error('Analyze business error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error analyzing business',
    });
  }
};

// @desc    Generate personalized growth plan
// @route   POST /api/business/growth-plan
// @access  Private (Business users only)
// @desc    Generate personalized growth plan
// @route   POST /api/business/growth-plan
// @access  Private (Business users only)
export const generateGrowthPlan = async (req, res) => {
  try {
    console.log('=== Generate Growth Plan Started ===');
    console.log('User ID:', req.user._id);
    
    const businessUser = await BusinessUser.findById(req.user._id);
    console.log('Business user found:', businessUser ? 'Yes' : 'No');

    if (!businessUser) {
      console.log('ERROR: Business user not found');
      return res.status(404).json({
        success: false,
        message: 'Business user not found',
      });
    }

    const { businessProfile } = businessUser;
    console.log('Business profile:', JSON.stringify(businessProfile, null, 2));

    // Generate each component safely
    let coreActions, timeline, effortEstimate, contentStrategy, automationSuggestions, avoidList;
    
    try {
      console.log('Generating core actions...');
      coreActions = generateCoreActions(businessProfile);
      console.log('Core actions generated:', coreActions.length);
    } catch (err) {
      console.error('Error generating core actions:', err);
      throw new Error('Failed to generate core actions: ' + err.message);
    }

    try {
      console.log('Generating timeline...');
      timeline = generateTimeline(businessProfile);
      console.log('Timeline generated:', Object.keys(timeline));
    } catch (err) {
      console.error('Error generating timeline:', err);
      throw new Error('Failed to generate timeline: ' + err.message);
    }

    try {
      console.log('Estimating effort...');
      effortEstimate = estimateEffort(businessProfile);
      console.log('Effort estimated:', effortEstimate);
    } catch (err) {
      console.error('Error estimating effort:', err);
      throw new Error('Failed to estimate effort: ' + err.message);
    }

    try {
      console.log('Generating content strategy...');
      contentStrategy = generateContentStrategy(businessProfile);
      console.log('Content strategy generated:', contentStrategy);
    } catch (err) {
      console.error('Error generating content strategy:', err);
      throw new Error('Failed to generate content strategy: ' + err.message);
    }

    try {
      console.log('Generating automation suggestions...');
      automationSuggestions = generateAutomationSuggestions(businessProfile);
      console.log('Automation suggestions generated:', automationSuggestions.length);
    } catch (err) {
      console.error('Error generating automation suggestions:', err);
      throw new Error('Failed to generate automation suggestions: ' + err.message);
    }

    try {
      console.log('Generating avoid list...');
      avoidList = generateAvoidList(businessProfile);
      console.log('Avoid list generated:', avoidList.length);
    } catch (err) {
      console.error('Error generating avoid list:', err);
      throw new Error('Failed to generate avoid list: ' + err.message);
    }

    const growthPlan = {
      coreActions,
      timeline,
      effortEstimate,
      contentStrategy,
      automationSuggestions,
      avoidList,
    };

    console.log('Growth plan assembled, saving to database...');

    // Save growth plan to database
    businessUser.growthPlan = growthPlan;
    businessUser.lastPlanUpdate = new Date();
    await businessUser.save();

    console.log('Growth plan saved successfully');
    console.log('=== Generate Growth Plan Completed ===');

    res.status(200).json({
      success: true,
      message: 'Growth plan generated successfully',
      data: growthPlan,
    });
  } catch (error) {
    console.error('=== Generate Growth Plan ERROR ===');
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    res.status(500).json({
      success: false,
      message: error.message || 'Error generating growth plan',
    });
  }
};

// @desc    Get saved growth plan
// @route   GET /api/business/growth-plan
// @access  Private (Business users only)
export const getGrowthPlan = async (req, res) => {
  try {
    const businessUser = await BusinessUser.findById(req.user._id);

    if (!businessUser) {
      return res.status(404).json({
        success: false,
        message: 'Business user not found',
      });
    }

    if (!businessUser.growthPlan) {
      return res.status(404).json({
        success: false,
        message: 'No growth plan found. Please generate one first.',
      });
    }

    res.status(200).json({
      success: true,
      data: {
        growthPlan: businessUser.growthPlan,
        lastUpdate: businessUser.lastPlanUpdate,
      },
    });
  } catch (error) {
    console.error('Get growth plan error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching growth plan',
    });
  }
};

// @desc    Search for businesses (for collaboration)
// @route   GET /api/business/search
// @access  Private
export const searchBusinesses = async (req, res) => {
  try {
    const { query, businessType, city, state } = req.query;

    let filter = { isActive: true };

    // Exclude current user from results
    if (req.user.userType === 'business') {
      filter._id = { $ne: req.user._id };
    }

    // Search by business name or type
    if (query) {
      filter.$or = [
        { 'businessProfile.businessName': { $regex: query, $options: 'i' } },
      ];
    }

    if (businessType) {
      filter['businessProfile.businessType'] = businessType;
    }

    if (city) {
      filter['businessProfile.location.city'] = { $regex: city, $options: 'i' };
    }

    if (state) {
      filter['businessProfile.location.state'] = { $regex: state, $options: 'i' };
    }

    const businesses = await BusinessUser.find(filter)
      .select('name businessProfile.businessName businessProfile.businessType businessProfile.location')
      .limit(20);

    res.status(200).json({
      success: true,
      count: businesses.length,
      data: businesses,
    });
  } catch (error) {
    console.error('Search businesses error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error searching businesses',
    });
  }
};

// @desc    Get business by ID
// @route   GET /api/business/:id
// @access  Private
export const getBusinessById = async (req, res) => {
  try {
    const business = await BusinessUser.findById(req.params.id).select('-password');

    if (!business) {
      return res.status(404).json({
        success: false,
        message: 'Business not found',
      });
    }

    res.status(200).json({
      success: true,
      data: business,
    });
  } catch (error) {
    console.error('Get business error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching business',
    });
  }
};

// ===========================================
// HELPER FUNCTIONS
// ===========================================

function determineBottleneck(profile) {
  if (profile.techComfort <= 2) {
    return 'Low technical comfort is limiting digital growth opportunities';
  }
  if (profile.monthlyBudget < 1000) {
    return 'Limited budget requires focus on free organic growth methods';
  }
  if (profile.weeklyTime < 5) {
    return 'Time constraint requires highly efficient, focused activities';
  }
  if (profile.teamSize === 1) {
    return 'Solo operation needs sustainable, manageable activities';
  }
  return 'Ready to scale with available resources';
}

function determineFocusArea(profile) {
  if (profile.primaryGoal === 'Build Foundation') {
    return 'Foundation Building - Establish online presence and basic systems';
  }
  if (profile.primaryGoal === 'Increase Visibility') {
    return 'Visibility Growth - Expand reach and brand awareness';
  }
  if (profile.primaryGoal === 'Boost Sales') {
    return 'Sales Optimization - Convert interest into revenue';
  }
  return 'Balanced Growth';
}

function generateRecommendations(profile) {
  const recommendations = [];

  // Based on primary goal
  if (profile.primaryGoal === 'Increase Visibility') {
    recommendations.push('Set up Google Business Profile immediately - it\'s free and essential');
    recommendations.push('Create a WhatsApp Business account for direct customer communication');
    
    if (profile.techComfort >= 2) {
      recommendations.push('Start posting on Instagram 2-3 times per week with local hashtags');
    }
  } else if (profile.primaryGoal === 'Boost Sales') {
    recommendations.push('Ask every satisfied customer for a Google review');
    recommendations.push('Create limited-time offers and share on WhatsApp');
    recommendations.push('Partner with nearby complementary businesses for cross-promotion');
  } else if (profile.primaryGoal === 'Build Foundation') {
    recommendations.push('Set up basic online presence: Google Business Profile + WhatsApp Business');
    recommendations.push('Collect customer phone numbers and emails systematically');
    recommendations.push('Take professional photos of your products/services');
  }

  // Based on budget
  if (profile.monthlyBudget < 1000) {
    recommendations.push('Focus on free methods: Google Business, WhatsApp, word-of-mouth');
  } else if (profile.monthlyBudget >= 1000 && profile.monthlyBudget < 5000) {
    recommendations.push('Consider small local Facebook ads (₹500-1000/month)');
  } else if (profile.monthlyBudget >= 5000) {
    recommendations.push('Invest in local Google Ads for high-intent searches');
    recommendations.push('Consider professional photography for your business');
  }

  // Based on time availability
  if (profile.weeklyTime < 5) {
    recommendations.push('Use automation: WhatsApp auto-replies, scheduled posts');
  } else if (profile.weeklyTime >= 5 && profile.weeklyTime < 10) {
    recommendations.push('Dedicate 1 hour daily for social media and customer engagement');
  } else {
    recommendations.push('Create a content calendar and post consistently across platforms');
  }

  // Based on tech comfort
  if (profile.techComfort <= 2) {
    recommendations.push('Start simple: Master WhatsApp Business before moving to other platforms');
  } else if (profile.techComfort >= 3) {
    recommendations.push('Explore tools like Canva for creating professional graphics');
  }

  // Based on business type
  if (profile.businessType === 'Food & Beverage') {
    recommendations.push('Post mouth-watering food photos daily on Instagram');
    recommendations.push('Encourage customers to tag you in their posts');
  } else if (profile.businessType === 'Services') {
    recommendations.push('Collect before/after photos and customer testimonials');
    recommendations.push('Offer first-time customer discounts to build your base');
  } else if (profile.businessType === 'Retail & Shopping') {
    recommendations.push('Showcase new arrivals and bestsellers on social media');
    recommendations.push('Run flash sales and announce them on WhatsApp');
  }

  // Location-based
  if (profile.location && profile.location.city) {
    recommendations.push(`Focus on local SEO: Use "${profile.location.city}" in all your online content`);
  }

  return recommendations.slice(0, 8);
}

function generateCoreActions(profile) {
  const actions = [];
  const weeklyTime = profile.weeklyTime || 0;
  const budget = profile.monthlyBudget || 0;
  const techComfort = profile.techComfort || 1;

  actions.push({
    action: 'Set up Google Business Profile',
    effort: 'Low',
    timePerWeek: 1,
    cost: 0,
    priority: 'High',
  });

  if (weeklyTime >= 3) {
    actions.push({
      action: 'Create WhatsApp Business account and share with existing customers',
      effort: 'Low',
      timePerWeek: 2,
      cost: 0,
      priority: 'High',
    });
  }

  if (techComfort >= 2 && weeklyTime >= 5) {
    actions.push({
      action: 'Post 2-3 times per week on Instagram/Facebook',
      effort: 'Medium',
      timePerWeek: 3,
      cost: 0,
      priority: 'Medium',
    });
  }

  if (budget >= 500 && weeklyTime >= 3) {
    actions.push({
      action: 'Run local awareness campaign',
      effort: 'Medium',
      timePerWeek: 2,
      cost: 500,
      priority: 'Medium',
    });
  }

  actions.push({
    action: 'Ask satisfied customers for reviews',
    effort: 'Low',
    timePerWeek: 1,
    cost: 0,
    priority: 'High',
  });

  return actions.slice(0, 5);
}

function generateTimeline(profile) {
  return {
    week1: ['Set up Google Business Profile', 'Create WhatsApp Business account'],
    week2: ['Start collecting customer reviews', 'Take photos of products/services'],
    month1: ['Establish posting routine', 'Build initial online presence'],
  };
}

function estimateEffort(profile) {
  const actions = generateCoreActions(profile);
  
  const totalTimePerWeek = actions.reduce((sum, action) => sum + (action.timePerWeek || 0), 0);
  const totalMonthlyCost = actions.reduce((sum, action) => sum + (action.cost || 0), 0);

  return {
    timePerWeek: `${totalTimePerWeek} hours`,
    monthlyCost: `₹${totalMonthlyCost}`,
    riskLevel: totalMonthlyCost > (profile.monthlyBudget || 0) ? 'High' : 'Low',
  };
}

function generateContentStrategy(profile) {
  const strategy = {
    platforms: [],
    contentTypes: [],
    frequency: '',
  };

  if (profile.businessType === 'Food & Beverage') {
    strategy.platforms = ['Instagram', 'WhatsApp', 'Google Business'];
    strategy.contentTypes = ['Food photos', 'Behind-the-scenes', 'Customer reviews'];
  } else if (profile.businessType === 'Services') {
    strategy.platforms = ['Google Business', 'WhatsApp', 'Facebook'];
    strategy.contentTypes = ['Service demonstrations', 'Customer testimonials', 'Before/after'];
  } else {
    strategy.platforms = ['Google Business', 'WhatsApp'];
    strategy.contentTypes = ['Product photos', 'Usage tips', 'Customer stories'];
  }

  const weeklyTime = profile.weeklyTime || 0;
  if (weeklyTime < 5) {
    strategy.frequency = '1-2 posts per week';
  } else if (weeklyTime < 10) {
    strategy.frequency = '2-3 posts per week';
  } else {
    strategy.frequency = '3-5 posts per week';
  }

  return strategy;
}

function generateAutomationSuggestions(profile) {
  const suggestions = [];
  const techComfort = profile.techComfort || 1;

  if (techComfort >= 2) {
    suggestions.push({
      task: 'Auto-reply messages',
      tool: 'WhatsApp Business auto-responses',
      benefit: 'Instant customer acknowledgment',
    });
  }

  if (techComfort >= 3) {
    suggestions.push({
      task: 'Review request reminders',
      tool: 'Google Business automated messages',
      benefit: 'Increase review collection',
    });
  }

  suggestions.push({
    task: 'Posting reminders',
    tool: 'Phone calendar alerts',
    benefit: 'Maintain consistency',
  });

  return suggestions;
}

function generateAvoidList(profile) {
  const avoidList = [];
  const monthlyBudget = profile.monthlyBudget || 0;
  const techComfort = profile.techComfort || 1;
  const weeklyTime = profile.weeklyTime || 0;
  const teamSize = profile.teamSize || 1;

  if (monthlyBudget < 5000) {
    avoidList.push({
      item: 'Paid advertising',
      reason: 'Budget too limited for effective campaigns',
    });
  }

  if (techComfort <= 2) {
    avoidList.push({
      item: 'Complex website development',
      reason: 'Beyond current technical comfort level',
    });
  }

  if (weeklyTime < 5) {
    avoidList.push({
      item: 'Multiple social media platforms',
      reason: 'Not enough time to maintain quality',
    });
  }

  if (teamSize === 1) {
    avoidList.push({
      item: 'Daily posting schedules',
      reason: 'Unsustainable for solo operation',
    });
  }

  return avoidList;
}