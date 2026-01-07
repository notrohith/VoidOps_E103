import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useEffect } from 'react';

const LandingPage = () => {
  const { user, isBusiness, isNormal } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect if already logged in
    if (user) {
      if (isBusiness) {
        navigate('/business/dashboard');
      } else if (isNormal) {
        navigate('/normal/dashboard');
      }
    }
  }, [user, isBusiness, isNormal, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Empower Your Small Business
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-3xl mx-auto">
            AI-powered growth solutions for family-run businesses in India.
            Sustainable growth made simple, practical, and affordable.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
            <Link
              to="/register"
              className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition shadow-lg"
            >
              Get Started Free
            </Link>
            <Link
              to="/login"
              className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-50 transition shadow-lg border-2 border-blue-600"
            >
              Login
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8 mt-20">
          {/* Feature 1 */}
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <span className="text-3xl">📊</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Personalized Growth Plans
            </h3>
            <p className="text-gray-600">
              Get AI-powered recommendations based on your time, budget, and
              technical comfort level.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <span className="text-3xl">💰</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Fundraising Support
            </h3>
            <p className="text-gray-600">
              Create fundraising campaigns and connect with supporters in your
              community.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
              <span className="text-3xl">🤝</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Business Collaboration
            </h3>
            <p className="text-gray-600">
              Partner with other local businesses for joint marketing and
              cross-promotion.
            </p>
          </div>
        </div>

        {/* Who is it for section */}
        <div className="mt-20 bg-white rounded-xl shadow-lg p-10">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-10">
            Who is GrowMe For?
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Business Owners */}
            <div className="border-2 border-blue-200 rounded-lg p-6 hover:border-blue-400 transition">
              <h3 className="text-2xl font-bold text-blue-600 mb-4">
                🏪 Business Owners
              </h3>
              <ul className="space-y-3 text-gray-700">
                <li>✓ Get personalized growth strategies</li>
                <li>✓ AI-powered business analysis</li>
                <li>✓ Create fundraising campaigns</li>
                <li>✓ Collaborate with other businesses</li>
                <li>✓ Free and low-cost recommendations</li>
              </ul>
              <Link
                to="/register/business"
                className="mt-6 block text-center bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                Register as Business
              </Link>
            </div>

            {/* Supporters */}
            <div className="border-2 border-green-200 rounded-lg p-6 hover:border-green-400 transition">
              <h3 className="text-2xl font-bold text-green-600 mb-4">
                👤 Supporters
              </h3>
              <ul className="space-y-3 text-gray-700">
                <li>✓ Discover local businesses</li>
                <li>✓ Support small business fundraisers</li>
                <li>✓ Track your contributions</li>
                <li>✓ Help your community grow</li>
                <li>✓ Connect with entrepreneurs</li>
              </ul>
              <Link
                to="/register/normal"
                className="mt-6 block text-center bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition"
              >
                Register as Supporter
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-20 grid md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold text-blue-600 mb-2">100%</div>
            <div className="text-gray-700">Free to Start</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-blue-600 mb-2">Simple</div>
            <div className="text-gray-700">No Technical Skills Needed</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-blue-600 mb-2">AI-Powered</div>
            <div className="text-gray-700">Smart Recommendations</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;