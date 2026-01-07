import { GoogleGenerativeAI } from '@google/generative-ai';
import BusinessUser from '../models/BusinessUser.js';

// @desc    Chat with AI assistant
// @route   POST /api/chat
// @access  Private (Business users only)
export const chatWithAI = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a message',
      });
    }

    const businessUser = await BusinessUser.findById(req.user._id);

    if (!businessUser) {
      return res.status(404).json({
        success: false,
        message: 'Business user not found',
      });
    }

    const { businessProfile } = businessUser;

    // Try Gemini first, fallback to rule-based if quota exceeded
    let aiResponse;
    
    try {
      if (process.env.GEMINI_API_KEY) {
        const systemPrompt = `You are a helpful AI growth assistant for small businesses in India. You provide practical, actionable advice.

BUSINESS CONTEXT:
- Business: ${businessProfile.businessName} (${businessProfile.businessType})
- Location: ${businessProfile.location.city}, ${businessProfile.location.state}
- Budget: ₹${businessProfile.monthlyBudget}/month
- Time: ${businessProfile.weeklyTime} hours/week
- Tech Level: ${businessProfile.techComfort}/5
- Goal: ${businessProfile.primaryGoal}

USER QUESTION: ${message}

Give practical, India-specific advice in 3-4 paragraphs.`;

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ 
  model: 'gemini-1.5-flash',
  generationConfig: {
    temperature: 0.7,
    maxOutputTokens: 1024,
  }
});
        
        const result = await model.generateContent(systemPrompt);
        const response = await result.response;
        aiResponse = response.text();
        
        console.log('✓ Gemini response generated');
      }
    } catch (error) {
      console.log('⚠ Gemini unavailable, using rule-based fallback');
      console.log('Error:', error.message);
      aiResponse = generateRuleBasedResponse(message.toLowerCase(), businessProfile);
    }

    res.status(200).json({
      success: true,
      data: {
        message: aiResponse,
      },
    });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing chat message',
    });
  }
};

// Rule-based fallback responses
function generateRuleBasedResponse(question, profile) {
  // Social media questions
  if (question.includes('social media') || question.includes('instagram') || question.includes('facebook')) {
    return `For ${profile.businessType} businesses in ${profile.location.city}, I recommend:

1. **Start with Instagram** if you're in Food, Retail, or Handicrafts (visual businesses)
2. **Start with Facebook** if you're in Services (build trust with reviews)

With your ${profile.weeklyTime} hours per week:
- Post 2-3 times per week (not daily - quality over quantity)
- Use local hashtags: #${profile.location.city}Business #${profile.location.city}${profile.businessType.replace(/ /g, '')}
- Respond to ALL comments within 24 hours

Budget tip: With ₹${profile.monthlyBudget}/month, focus on organic (free) content first. Save paid ads until you have consistent posting.

Step 1: Set up your profile today
Step 2: Post your first 3 pieces of content this week
Step 3: Engage with 10 local businesses daily`;
  }

  // Google/Search questions
  if (question.includes('google') || question.includes('search') || question.includes('seo')) {
    return `Google Business Profile is FREE and the #1 priority for local businesses in India.

**Setup (Takes 2 hours initially):**
1. Go to google.com/business
2. Claim your business listing
3. Add: Photos (min 10), Hours, Services, Phone
4. Verify your business (Google will send a postcard)

**Weekly maintenance (30 minutes):**
- Post 1 update per week
- Respond to ALL reviews (good or bad)
- Add new photos monthly

With your budget of ₹${profile.monthlyBudget}, this is perfect - it's 100% FREE but extremely effective for ${profile.location.city} customers searching for ${profile.businessType}.

Your tech comfort (${profile.techComfort}/5) is enough to handle this - it's very user-friendly!`;
  }

  // Customer/Review questions
  if (question.includes('customer') || question.includes('review') || question.includes('testimonial')) {
    return `Getting customer reviews is crucial for ${profile.businessType} businesses. Here's how:

**Free method (Best for ₹${profile.monthlyBudget} budget):**
1. After EVERY satisfied customer interaction, ask: "Would you mind leaving us a quick Google review?"
2. Make it easy: Send them a direct link via WhatsApp
3. Ask within 24 hours while the experience is fresh

**System for your team of ${profile.teamSize}:**
- Assign someone to follow up with customers within 2 days
- Create a Google Review link (I'll show you how)
- Send via WhatsApp: "Hi [Name], thank you for choosing us! We'd love a quick review: [link]"

**Incentive (optional):**
- Small thank you: "Get ₹50 off next purchase for leaving a review"
- This costs less than paid advertising and builds trust

With ${profile.weeklyTime} hours/week, dedicate 1 hour weekly to review collection. 10 reviews can increase customers by 30%!`;
  }

  // WhatsApp questions
  if (question.includes('whatsapp')) {
    return `WhatsApp Business is PERFECT for Indian small businesses and it's 100% FREE!

**Setup (30 minutes):**
1. Download "WhatsApp Business" app (green icon)
2. Use a separate number or convert your personal number
3. Set up your business profile (name, hours, address, website)

**Essential features for ${profile.businessType}:**
- **Catalog:** Upload products/services with prices
- **Quick Replies:** Save common responses (saves time!)
- **Away Message:** Auto-reply when closed
- **Labels:** Organize customers (New, Paid, Interested)

**With your ${profile.weeklyTime} hrs/week:**
- Respond within 1 hour during business hours
- Use broadcast lists for offers (NOT groups - that's spam)
- Save product photos in catalog for quick sharing

Your tech comfort (${profile.techComfort}/5) is good enough - WhatsApp Business is very intuitive and used by millions of Indian businesses!

Cost: ₹0 (saves you ₹${Math.min(1000, profile.monthlyBudget)} from your monthly budget)`;
  }

  // Website questions
  if (question.includes('website') || question.includes('online')) {
    return `For a ${profile.businessType} business with ₹${profile.monthlyBudget}/month budget, here's my advice:

**You DON'T need a website initially!** Here's why:
- Google Business Profile acts as a mini-website (FREE)
- Instagram/Facebook page is your storefront (FREE)
- WhatsApp Business has a catalog feature (FREE)

**If you still want a website later:**
- Free option: Google Sites (literally ₹0)
- Budget option: Wix/WordPress (₹3,000-5,000/year)
- When?: Only after you've mastered Google + WhatsApp + Social Media

**Better use of your ${profile.weeklyTime} hrs/week RIGHT NOW:**
1. Perfect your Google Business listing (2 hours)
2. Set up WhatsApp Business catalog (2 hours)
3. Post consistently on 1 social platform (${profile.weeklyTime - 4} hours)

Tech comfort ${profile.techComfort}/5 is enough for Google Sites, but honestly, focus on Google Business Profile first. 90% of ${profile.location.city} customers will find you there!`;
  }

  // Budget/Money questions
  if (question.includes('budget') || question.includes('money') || question.includes('cost') || question.includes('cheap')) {
    return `With ₹${profile.monthlyBudget}/month, here's your smart spending plan:

**FREE (₹0) - Start here:**
- Google Business Profile ✓
- WhatsApp Business ✓
- Organic social media posts ✓
- Customer referrals ✓

**Low-cost (₹500-1000/month) - Only if you've maxed out free:**
${profile.monthlyBudget >= 500 ? '- Local Facebook ads targeting ' + profile.location.city + ' (₹500)' : ''}
${profile.monthlyBudget >= 1000 ? '- Google Ads for high-intent searches (₹1000)' : ''}

**DON'T spend on:**
- Expensive websites (₹10,000+) - Not needed yet
- Bulk SMS services - Low ROI
- Social media management tools - Manage manually first

**Your ${profile.businessType} business priority:**
Focus 100% on FREE methods for 3 months. With ${profile.weeklyTime} hours/week on free tactics, you'll see results before spending money.

Only spend money AFTER you've consistently used free methods. Most ${profile.location.city} businesses see 50-100 customers from just Google + WhatsApp!`;
  }

  // Getting customers / sales
  if (question.includes('customer') || question.includes('more sales') || question.includes('grow') || question.includes('increase')) {
    return `To get more customers for your ${profile.businessType} business in ${profile.location.city}, follow this exact plan:

**Week 1 (Foundation):**
1. Set up Google Business Profile (2 hours)
2. Create WhatsApp Business account (1 hour)
3. Ask 5 existing customers for Google reviews (1 hour)

**Week 2-4 (Growth):**
1. Post on social media 2x per week (${Math.min(3, profile.weeklyTime)} hours)
2. Share updates on WhatsApp status (30 min)
3. Partner with 2 complementary local businesses (${Math.min(2, profile.weeklyTime)} hours)

**With your resources:**
- Budget: ₹${profile.monthlyBudget}/month → Focus on FREE methods
- Time: ${profile.weeklyTime} hrs/week → Very doable!
- Tech: ${profile.techComfort}/5 → You can handle this
- Goal: ${profile.primaryGoal} → This plan aligns perfectly

**Expected results (3 months):**
- 50-100 new customers from Google searches
- 30-50 customers from WhatsApp sharing
- 20-30 customers from social media

The key is CONSISTENCY. With ${profile.teamSize} team members, assign tasks and stick to the schedule!`;
  }

  // Default response
  return `Great question about your ${profile.businessType} business in ${profile.location.city}!

Based on your situation:
- Budget: ₹${profile.monthlyBudget}/month
- Time: ${profile.weeklyTime} hours/week  
- Tech comfort: ${profile.techComfort}/5
- Goal: ${profile.primaryGoal}

**My top recommendations:**

1. **Google Business Profile** (FREE, 2 hours setup)
   - Essential for local visibility in ${profile.location.city}
   - Customers can find you when searching for ${profile.businessType}

2. **WhatsApp Business** (FREE, 1 hour setup)
   - Perfect for Indian businesses
   - Direct communication with customers
   - Share product catalog easily

3. **Customer Reviews** (FREE, 1 hour/week)
   - Ask EVERY happy customer for a Google review
   - 10 reviews = 30% more customers

With ${profile.weeklyTime} hours per week, focus on these 3 things before anything else. They're free, effective, and match your tech comfort level.

Want specific steps for any of these? Just ask!`;
}