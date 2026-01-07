import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const ChatAssistant = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `Hello ${user?.name}! I'm your AI growth assistant for ${user?.businessProfile?.businessName}. I'm here to help you with marketing strategies, customer engagement, and business growth. 

I understand your business operates in ${user?.businessProfile?.location?.city} with a budget of ₹${user?.businessProfile?.monthlyBudget}/month and ${user?.businessProfile?.weeklyTime} hours/week available.

How can I help you today?`,
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

    try {
      // Call Gemini API through backend
      const response = await api.post('/chat', { message: userMessage });

      if (response.data.success) {
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: response.data.data.message },
        ]);
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Sorry, I encountered an error. Please try again.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const quickQuestions = [
    'How do I get more customers?',
    'What social media should I use?',
    'How to get more reviews?',
    'Should I create a website?',
    'How to use WhatsApp for business?',
    'How to increase my online visibility?',
  ];

  const handleQuickQuestion = (question) => {
    setInput(question);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-t-xl shadow-md p-6 border-b">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            💬 AI Growth Assistant
          </h1>
          <p className="text-sm text-gray-600">
            Powered by Google Gemini • Context-aware advice for{' '}
            {user?.businessProfile?.businessName}
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
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
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
                onClick={() => handleQuickQuestion(question)}
                disabled={loading}
                className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-full transition disabled:opacity-50"
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
              {loading ? 'Sending...' : 'Send'}
            </button>
          </div>
        </form>

        {/* Info Box */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-900">
            <strong>💡 Context-Aware:</strong> I understand your business is a{' '}
            {user?.businessProfile?.businessType} in{' '}
            {user?.businessProfile?.location?.city} with ₹
            {user?.businessProfile?.monthlyBudget}/month budget and{' '}
            {user?.businessProfile?.weeklyTime} hours/week. All my advice is
            tailored specifically for your situation!
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatAssistant;