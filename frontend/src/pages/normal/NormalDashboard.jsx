import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const NormalDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalDonations: 0,
    totalAmount: 0,
    businessesSupported: 0,
  });
  const [recentDonations, setRecentDonations] = useState([]);
  const [activeFundraisers, setActiveFundraisers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch donation history
      const donationResponse = await api.get('/fundraisers/donations/history');
      if (donationResponse.data.success) {
        const donations = donationResponse.data.data;
        setRecentDonations(donations.slice(0, 5));
        
        // Calculate stats
        const totalAmount = donations.reduce((sum, d) => sum + d.amount, 0);
        const uniqueBusinesses = new Set(donations.map(d => d.fundraiserId?._id)).size;
        
        setStats({
          totalDonations: donations.length,
          totalAmount,
          businessesSupported: uniqueBusinesses,
        });
      }

      // Fetch active fundraisers
      const fundraiserResponse = await api.get('/fundraisers?status=active');
      if (fundraiserResponse.data.success) {
        setActiveFundraisers(fundraiserResponse.data.data.slice(0, 3));
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const calculateProgress = (current, goal) => {
    return Math.min((current / goal) * 100, 100);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
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
            Thank you for supporting local businesses in your community
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-md p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium opacity-90">Total Donations</h3>
              <span className="text-3xl">💰</span>
            </div>
            <p className="text-3xl font-bold">{stats.totalDonations}</p>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-md p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium opacity-90">Amount Contributed</h3>
              <span className="text-3xl">💵</span>
            </div>
            <p className="text-3xl font-bold">₹{stats.totalAmount.toLocaleString()}</p>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-md p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium opacity-90">Businesses Supported</h3>
              <span className="text-3xl">🏪</span>
            </div>
            <p className="text-3xl font-bold">{stats.businessesSupported}</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Link
            to="/normal/discover"
            className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition"
          >
            <div className="text-3xl mb-3">🔍</div>
            <h3 className="font-semibold text-gray-900 mb-1">Discover</h3>
            <p className="text-sm text-gray-600">Find local businesses</p>
          </Link>

          <Link
            to="/normal/fundraisers"
            className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition"
          >
            <div className="text-3xl mb-3">🎯</div>
            <h3 className="font-semibold text-gray-900 mb-1">Active Fundraisers</h3>
            <p className="text-sm text-gray-600">Support campaigns</p>
          </Link>

          <Link
            to="/normal/fundraisers"
            className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition"
          >
            <div className="text-3xl mb-3">📊</div>
            <h3 className="font-semibold text-gray-900 mb-1">My Impact</h3>
            <p className="text-sm text-gray-600">View donation history</p>
          </Link>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Featured Fundraisers */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                🔥 Featured Fundraisers
              </h2>
              <Link
                to="/normal/fundraisers"
                className="text-blue-600 text-sm font-semibold hover:underline"
              >
                View All
              </Link>
            </div>

            {activeFundraisers.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-2">🎯</div>
                <p className="text-gray-600 text-sm">
                  No active fundraisers at the moment
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {activeFundraisers.map((fundraiser) => (
                  <Link
                    key={fundraiser._id}
                    to={`/normal/fundraisers`}
                    className="block border border-gray-200 rounded-lg p-4 hover:border-green-300 transition"
                  >
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {fundraiser.title}
                    </h3>
                    <p className="text-xs text-gray-600 mb-2">
                      by {fundraiser.businessOwner?.businessProfile?.businessName}
                    </p>
                    
                    {/* Progress Bar */}
                    <div className="mb-2">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-600">
                          ₹{fundraiser.currentAmount.toLocaleString()} raised
                        </span>
                        <span className="font-medium">
                          {calculateProgress(
                            fundraiser.currentAmount,
                            fundraiser.goalAmount
                          ).toFixed(0)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-600 h-2 rounded-full transition-all"
                          style={{
                            width: `${calculateProgress(
                              fundraiser.currentAmount,
                              fundraiser.goalAmount
                            )}%`,
                          }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-gray-600">
                      <span>Goal: ₹{fundraiser.goalAmount.toLocaleString()}</span>
                      <span>
                        {Math.max(
                          0,
                          Math.ceil(
                            (new Date(fundraiser.endDate) - new Date()) /
                              (1000 * 60 * 60 * 24)
                          )
                        )}{' '}
                        days left
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Recent Donations */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              📜 Recent Donations
            </h2>

            {recentDonations.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-2">💚</div>
                <p className="text-gray-600 text-sm mb-4">
                  You haven't made any donations yet
                </p>
                <Link
                  to="/normal/fundraisers"
                  className="inline-block bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 transition"
                >
                  Start Supporting
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {recentDonations.map((donation, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 text-sm">
                          {donation.fundraiserId?.title || 'Fundraiser'}
                        </h3>
                        <p className="text-xs text-gray-600">
                          {donation.fundraiserId?.businessOwner?.businessProfile
                            ?.businessName || 'Business'}
                        </p>
                      </div>
                      <span className="text-green-600 font-bold">
                        ₹{donation.amount.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>
                        {new Date(donation.date).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                      <span
                        className={`px-2 py-1 rounded-full ${
                          donation.fundraiserId?.status === 'completed'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-green-100 text-green-700'
                        }`}
                      >
                        {donation.fundraiserId?.status || 'active'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Your Interests */}
        {user?.interests && user.interests.length > 0 && (
          <div className="mt-8 bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Your Interests
            </h2>
            <div className="flex flex-wrap gap-2">
              {user.interests.map((interest, index) => (
                <span
                  key={index}
                  className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium"
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Impact Message */}
        {stats.totalDonations > 0 && (
          <div className="mt-8 bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-xl p-6 text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Thank You for Making a Difference! 🎉
            </h3>
            <p className="text-gray-700">
              You've supported {stats.businessesSupported}{' '}
              {stats.businessesSupported === 1 ? 'business' : 'businesses'} with a
              total of ₹{stats.totalAmount.toLocaleString()}. Your contributions
              help local entrepreneurs grow and strengthen the community.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NormalDashboard;