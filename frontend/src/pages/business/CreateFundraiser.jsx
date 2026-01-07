import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

const ChatAssistant = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `Hello ${user?.name}! I'm your AI growth assistant for ${user?.businessProfile?.businessName}. I'm here to help you with marketing strategies, customer engagement, and business growth. How can I help you today?`,
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');

    // Add user message
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    // Simulate AI response (replace with actual API call later)
    setTimeout(() => {
      const aiResponse = generateResponse(userMessage);
      setMessages((prev) => [...prev, { role: 'assistant', content: aiResponse }]);
      setLoading(false);
    }, 1000);
  };

  const generateResponse = (question) => {
    const lowerQuestion = question.toLowerCase();

    // Simple rule-based responses (you can replace this with Claude API integration)
    if (lowerQuestion.includes('social media') || lowerQuestion.includes('instagram') || lowerQuestion.includes('facebook')) {
      return `For ${user?.businessProfile?.businessType} businesses, I recommend:\n\n1. Post 2-3 times per week with photos of your products/services\n2. Use local hashtags like #${user?.businessProfile?.location?.city}Business\n3. Respond to all comments within 24 hours\n4. Share customer testimonials and behind-the-scenes content\n\nWith your ${user?.businessProfile?.weeklyTime} hours per week, focus on quality over quantity!`;
    }

    if (lowerQuestion.includes('google') || lowerQuestion.includes('search')) {
      return `Setting up Google Business Profile is FREE and crucial:\n\n1. Claim your business at google.com/business\n2. Add photos, hours, and services\n3. Respond to all reviews\n4. Post updates weekly\n\nThis takes about 2 hours initially, then 30 minutes per week. Given your budget of ₹${user?.businessProfile?.monthlyBudget}, this is the best free option!`;
    }

    if (lowerQuestion.includes('customer') || lowerQuestion.includes('review')) {
      return `Getting customer reviews is essential:\n\n1. Ask satisfied customers directly after service\n2. Send a follow-up WhatsApp message with a review link\n3. Offer a small thank you (discount on next purchase)\n4. Make it easy - provide direct links\n\nWith your team of ${user?.businessProfile?.teamSize}, assign someone to follow up with customers within 2 days of service.`;
    }

    if (lowerQuestion.includes('whatsapp')) {
      return `WhatsApp Business is perfect for small businesses:\n\n1. Download WhatsApp Business (free)\n2. Set up automated greeting and away messages\n3. Create a product catalog\n4. Use broadcast lists for promotions\n5. Quick replies for common questions\n\nThis requires minimal technical skills (you rated ${user?.businessProfile?.techComfort}/5, so you can definitely do this!).`;
    }

    if (lowerQuestion.includes('budget') || lowerQuestion.includes('money') || lowerQuestion.includes('cost')) {
      return `With your monthly budget of ₹${user?.businessProfile?.monthlyBudget}, here's my recommendation:\n\n• ₹0 - Google Business Profile (FREE)\n• ₹0 - WhatsApp Business (FREE)\n• ₹0 - Social media posting (FREE)\n${user?.businessProfile?.monthlyBudget >= 500 ? `• ₹${Math.min(500, user?.businessProfile?.monthlyBudget)} - Local Facebook ads\n` : ''}${user?.businessProfile?.monthlyBudget >= 1000 ? `• ₹${user?.businessProfile?.monthlyBudget - 500} - Google Ads for local searches\n` : ''}\nFocus on free methods first to build a foundation!`;
    }

    if (lowerQuestion.includes('website') || lowerQuestion.includes('online')) {
      return `For a ${user?.businessProfile?.businessType} business, you don't need an expensive website initially:\n\n1. Start with Google Business Profile (acts as a mini-website)\n2. Create an Instagram/Facebook page\n3. Use WhatsApp Business catalog\n\nIf you want a website later, consider:\n• Free: Google Sites, Wix (basic)\n• Budget: ₹3,000-5,000/year with WordPress\n\nBut honestly, with your current resources, focus on Google + WhatsApp first!`;
    }

    // Default response
    return `That's a great question! Based on your business profile:\n\n• Business Type: ${user?.businessProfile?.businessType}\n• Location: ${user?.businessProfile?.location?.city}, ${user?.businessProfile?.location?.state}\n• Weekly Time: ${user?.businessProfile?.weeklyTime} hours\n• Monthly Budget: ₹${user?.businessProfile?.monthlyBudget}\n• Primary Goal: ${user?.businessProfile?.primaryGoal}\n\nI recommend focusing on low-cost, high-impact activities. Could you be more specific about what aspect you'd like help with? For example:\n- Social media marketing\n- Customer reviews\n- Local visibility\n- WhatsApp Business\n- Google Business Profile`;
  };

  const quickQuestions = [
    'How do I get more customers?',
    'What social media should I use?',
    'How to get more reviews?',
    'Should I create a website?',
    'How to use WhatsApp for business?',
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-t-xl shadow-md p-6 border-b">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            💬 AI Growth Assistant
          </h1>
          <p className="text-sm text-gray-600">
            Ask me anything about growing your business. I understand your budget,
            time, and goals.
          </p>
        </div>

        {/* Chat Messages */}
        <div className="bg-white shadow-md p-6 h-96 overflow-y-auto">
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-3/4 rounded-lg p-4 ${
                    message.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <p className="text-sm whitespace-pre-line">{message.content}</p>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-lg p-4">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Quick Questions */}
        <div className="bg-white shadow-md p-4 border-t">
          <p className="text-xs text-gray-500 mb-2">Quick questions:</p>
          <div className="flex flex-wrap gap-2">
            {quickQuestions.map((question, index) => (
              <button
                key={index}
                onClick={() => setInput(question)}
                className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-full transition"
              >
                {question}
              </button>
            ))}
          </div>
        </div>

        {/* Input Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-b-xl shadow-md p-6"
        >
          <div className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything about growing your business..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className={`bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition ${
                loading || !input.trim() ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              Send
            </button>
          </div>
        </form>

        {/* Info Box */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-900">
            <strong>💡 Tip:</strong> I provide advice specifically tailored to your{' '}
            {user?.businessProfile?.businessType} business in{' '}
            {user?.businessProfile?.location?.city}. All recommendations consider
            your ₹{user?.businessProfile?.monthlyBudget} monthly budget and{' '}
            {user?.businessProfile?.weeklyTime} hours per week.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatAssistant;