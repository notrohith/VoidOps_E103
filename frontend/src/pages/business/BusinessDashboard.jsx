import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const BusinessDashboard = () => {
  const { user } = useAuth();
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBusinessAnalysis();
  }, []);

  const fetchBusinessAnalysis = async () => {
    try {
      setLoading(true);
      const response = await api.post('/business/analyze');
      if (response.data.success) {
        setAnalysis(response.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load analysis');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.name}! 👋
          </h1>
          <p className="text-gray-600">
            {user?.businessProfile?.businessName} - {user?.businessProfile?.businessType}
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Link
            to="/business/growth-plan"
            className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition"
          >
            <div className="text-3xl mb-3">📊</div>
            <h3 className="font-semibold text-gray-900 mb-1">Growth Plan</h3>
            <p className="text-sm text-gray-600">Get personalized recommendations</p>
          </Link>

          <Link
            to="/business/chat"
            className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition"
          >
            <div className="text-3xl mb-3">💬</div>
            <h3 className="font-semibold text-gray-900 mb-1">AI Assistant</h3>
            <p className="text-sm text-gray-600">Chat with your growth advisor</p>
          </Link>

          <Link
            to="/business/fundraiser"
            className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition"
          >
            <div className="text-3xl mb-3">💰</div>
            <h3 className="font-semibold text-gray-900 mb-1">Fundraiser</h3>
            <p className="text-sm text-gray-600">Create a campaign</p>
          </Link>

          <Link
            to="/business/collaboration"
            className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition"
          >
            <div className="text-3xl mb-3">🤝</div>
            <h3 className="font-semibold text-gray-900 mb-1">Collaborate</h3>
            <p className="text-sm text-gray-600">Partner with businesses</p>
          </Link>
        </div>

        {/* Business Analysis */}
        {analysis && (
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Business Summary */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Business Summary
              </h2>
              <p className="text-gray-700 leading-relaxed">{analysis.summary}</p>
            </div>

            {/* Growth Bottleneck */}
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                🎯 Key Bottleneck
              </h2>
              <p className="text-gray-700 leading-relaxed">{analysis.bottleneck}</p>
            </div>

            {/* Focus Area */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                📍 Focus Area
              </h2>
              <p className="text-gray-700 leading-relaxed">{analysis.focusArea}</p>
            </div>

            {/* Recommendations Preview */}
            <div className="bg-green-50 border border-green-200 rounded-xl p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                💡 Top Recommendations
              </h2>
              <ul className="space-y-2">
                {analysis.recommendations.slice(0, 3).map((rec, index) => (
                  <li key={index} className="text-sm text-gray-700">
                    • {rec}
                  </li>
                ))}
              </ul>
              <Link
                to="/business/growth-plan"
                className="text-blue-600 font-semibold text-sm mt-3 inline-block hover:underline"
              >
                View Full Growth Plan →
              </Link>
            </div>
          </div>
        )}

        {/* Business Info Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Resources */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Your Resources</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Weekly Time:</span>
                <span className="font-medium">
                  {user?.businessProfile?.weeklyTime} hours
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Monthly Budget:</span>
                <span className="font-medium">
                  ₹{user?.businessProfile?.monthlyBudget}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Team Size:</span>
                <span className="font-medium">
                  {user?.businessProfile?.teamSize}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tech Comfort:</span>
                <span className="font-medium">
                  {user?.businessProfile?.techComfort}/5
                </span>
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Location</h3>
            <div className="space-y-3 text-sm">
              <div>
                <span className="text-gray-600">City:</span>
                <p className="font-medium">
                  {user?.businessProfile?.location?.city}
                </p>
              </div>
              <div>
                <span className="text-gray-600">State:</span>
                <p className="font-medium">
                  {user?.businessProfile?.location?.state}
                </p>
              </div>
              <div>
                <span className="text-gray-600">Years in Operation:</span>
                <p className="font-medium">
                  {user?.businessProfile?.yearsInOperation} years
                </p>
              </div>
            </div>
          </div>

          {/* Goal */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Primary Goal</h3>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-blue-900 font-medium text-center">
                {user?.businessProfile?.primaryGoal}
              </p>
            </div>
            <p className="text-xs text-gray-500 mt-3 text-center">
              All recommendations are tailored to this goal
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessDashboard;