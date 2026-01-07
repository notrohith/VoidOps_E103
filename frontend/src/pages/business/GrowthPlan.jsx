import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const GrowthPlan = () => {
  const { user } = useAuth();
  const [growthPlan, setGrowthPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchGrowthPlan();
  }, []);

  const fetchGrowthPlan = async () => {
    try {
      setLoading(true);
      const response = await api.get('/business/growth-plan');
      if (response.data.success) {
        setGrowthPlan(response.data.data.growthPlan);
      }
    } catch (err) {
      console.log('No growth plan found');
    } finally {
      setLoading(false);
    }
  };

  const generateNewPlan = async () => {
    try {
      setGenerating(true);
      setError('');
      const response = await api.post('/business/growth-plan');
      if (response.data.success) {
        setGrowthPlan(response.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate plan');
    } finally {
      setGenerating(false);
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
            Your Personalized Growth Plan
          </h1>
          <p className="text-gray-600">
            AI-powered recommendations based on your resources and goals
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* No Plan - Generate Button */}
        {!growthPlan && !loading && (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <div className="text-6xl mb-4">🚀</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Ready to Grow Your Business?
            </h2>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Generate your personalized growth plan based on your business profile,
              available time, budget, and technical comfort level.
            </p>
            <button
              onClick={generateNewPlan}
              disabled={generating}
              className={`bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition ${
                generating ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {generating ? 'Generating Plan...' : 'Generate Growth Plan'}
            </button>
          </div>
        )}

        {/* Growth Plan Display */}
        {growthPlan && (
          <div className="space-y-6">
            {/* Regenerate Button */}
            <div className="flex justify-end">
              <button
                onClick={generateNewPlan}
                disabled={generating}
                className={`bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition ${
                  generating ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {generating ? 'Regenerating...' : 'Regenerate Plan'}
              </button>
            </div>

            {/* Core Actions */}
            {growthPlan.coreActions && growthPlan.coreActions.length > 0 && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  📋 Core Actions (Max 5)
                </h2>
                <div className="space-y-4">
                  {growthPlan.coreActions.map((action, index) => (
                    <div
                      key={index}
                      className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-gray-900 flex-1">
                          {index + 1}. {action.action}
                        </h3>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            action.priority === 'High'
                              ? 'bg-red-100 text-red-700'
                              : action.priority === 'Medium'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-green-100 text-green-700'
                          }`}
                        >
                          {action.priority}
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm mt-3">
                        <div>
                          <span className="text-gray-600">Effort: </span>
                          <span className="font-medium">{action.effort}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Time/Week: </span>
                          <span className="font-medium">{action.timePerWeek}h</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Cost: </span>
                          <span className="font-medium">
                            {action.cost === 0 ? 'Free' : `₹${action.cost}`}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Timeline */}
            {growthPlan.timeline && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  📅 Execution Timeline
                </h2>
                <div className="space-y-4">
                  {growthPlan.timeline.week1 && growthPlan.timeline.week1.length > 0 && (
                    <div className="border-l-4 border-blue-500 pl-4">
                      <h3 className="font-semibold text-gray-900 mb-2">Week 1</h3>
                      <ul className="space-y-1 text-sm text-gray-700">
                        {growthPlan.timeline.week1.map((item, index) => (
                          <li key={index}>• {item}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {growthPlan.timeline.week2 && growthPlan.timeline.week2.length > 0 && (
                    <div className="border-l-4 border-green-500 pl-4">
                      <h3 className="font-semibold text-gray-900 mb-2">Week 2</h3>
                      <ul className="space-y-1 text-sm text-gray-700">
                        {growthPlan.timeline.week2.map((item, index) => (
                          <li key={index}>• {item}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {growthPlan.timeline.month1 && growthPlan.timeline.month1.length > 0 && (
                    <div className="border-l-4 border-purple-500 pl-4">
                      <h3 className="font-semibold text-gray-900 mb-2">Month 1</h3>
                      <ul className="space-y-1 text-sm text-gray-700">
                        {growthPlan.timeline.month1.map((item, index) => (
                          <li key={index}>• {item}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Content Strategy */}
            {growthPlan.contentStrategy && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  📱 Content Strategy
                </h2>
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Platforms</h3>
                    <div className="flex flex-wrap gap-2">
                      {growthPlan.contentStrategy.platforms && growthPlan.contentStrategy.platforms.length > 0 ? (
                        growthPlan.contentStrategy.platforms.map((platform, index) => (
                          <span
                            key={index}
                            className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm"
                          >
                            {platform}
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-500 text-sm">No platforms specified</span>
                      )}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Content Types</h3>
                    <ul className="text-sm text-gray-700 space-y-1">
                      {growthPlan.contentStrategy.contentTypes && growthPlan.contentStrategy.contentTypes.length > 0 ? (
                        growthPlan.contentStrategy.contentTypes.map((type, index) => (
                          <li key={index}>• {type}</li>
                        ))
                      ) : (
                        <li className="text-gray-500">No content types specified</li>
                      )}
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Frequency</h3>
                    <p className="text-sm text-gray-700">
                      {growthPlan.contentStrategy.frequency || 'Not specified'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Effort Estimate */}
            {growthPlan.effortEstimate && (
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                  <h3 className="font-semibold text-gray-900 mb-2">⏰ Time Required</h3>
                  <p className="text-2xl font-bold text-blue-600">
                    {growthPlan.effortEstimate.timePerWeek}
                  </p>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                  <h3 className="font-semibold text-gray-900 mb-2">💰 Monthly Cost</h3>
                  <p className="text-2xl font-bold text-green-600">
                    {growthPlan.effortEstimate.monthlyCost}
                  </p>
                </div>
                <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
                  <h3 className="font-semibold text-gray-900 mb-2">⚠️ Risk Level</h3>
                  <p className="text-2xl font-bold text-purple-600">
                    {growthPlan.effortEstimate.riskLevel}
                  </p>
                </div>
              </div>
            )}

            {/* Automation Suggestions */}
            {growthPlan.automationSuggestions && growthPlan.automationSuggestions.length > 0 && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  🤖 Automation Suggestions
                </h2>
                <div className="space-y-4">
                  {growthPlan.automationSuggestions.map((suggestion, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {suggestion.task}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        Tool: {suggestion.tool}
                      </p>
                      <p className="text-sm text-green-600">
                        ✓ {suggestion.benefit}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* What NOT To Do */}
            {growthPlan.avoidList && growthPlan.avoidList.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  ⛔ What NOT To Do (Right Now)
                </h2>
                <div className="space-y-3">
                  {growthPlan.avoidList.map((item, index) => (
                    <div key={index} className="bg-white rounded-lg p-4">
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {item.item}
                      </h3>
                      <p className="text-sm text-gray-600">{item.reason}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default GrowthPlan;