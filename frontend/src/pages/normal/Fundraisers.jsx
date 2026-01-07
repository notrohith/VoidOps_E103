import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const Fundraisers = () => {
  const { user } = useAuth();
  const [fundraisers, setFundraisers] = useState([]);
  const [myDonations, setMyDonations] = useState([]);
  const [activeTab, setActiveTab] = useState('active'); // active, history
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    businessType: '',
    city: '',
    state: '',
  });

  const [showDonateModal, setShowDonateModal] = useState(false);
  const [selectedFundraiser, setSelectedFundraiser] = useState(null);
  const [donationAmount, setDonationAmount] = useState('');
  const [donationMessage, setDonationMessage] = useState('');
  const [donating, setDonating] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const businessTypes = [
    'Food & Beverage',
    'Retail & Shopping',
    'Services',
    'Handicrafts',
    'Agriculture',
    'Manufacturing',
    'Technology',
    'Healthcare',
    'Education',
    'Other',
  ];

  useEffect(() => {
    if (activeTab === 'active') {
      fetchFundraisers();
    } else {
      fetchMyDonations();
    }
  }, [activeTab]);

  const fetchFundraisers = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      queryParams.append('status', 'active');
      
      if (filters.search) queryParams.append('search', filters.search);
      if (filters.businessType) queryParams.append('businessType', filters.businessType);
      if (filters.city) queryParams.append('city', filters.city);
      if (filters.state) queryParams.append('state', filters.state);

      const response = await api.get(`/fundraisers?${queryParams.toString()}`);
      if (response.data.success) {
        setFundraisers(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching fundraisers:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMyDonations = async () => {
    try {
      setLoading(true);
      const response = await api.get('/fundraisers/donations/history');
      if (response.data.success) {
        setMyDonations(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching donations:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      businessType: '',
      city: '',
      state: '',
    });
    setTimeout(fetchFundraisers, 100);
  };

  const openDonateModal = (fundraiser) => {
    setSelectedFundraiser(fundraiser);
    setShowDonateModal(true);
    setDonationAmount('');
    setDonationMessage('');
    setError('');
  };

  const handleDonate = async () => {
    if (!donationAmount || donationAmount < 100) {
      setError('Minimum donation amount is ₹100');
      return;
    }

    try {
      setDonating(true);
      setError('');
      const response = await api.post(
        `/fundraisers/${selectedFundraiser._id}/support`,
        {
          amount: parseInt(donationAmount),
          message: donationMessage,
        }
      );

      if (response.data.success) {
        setSuccess('Thank you for your donation! 🎉');
        setShowDonateModal(false);
        setSelectedFundraiser(null);
        fetchFundraisers();
        
        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to process donation');
    } finally {
      setDonating(false);
    }
  };

  const calculateProgress = (current, goal) => {
    return Math.min((current / goal) * 100, 100);
  };

  const calculateDaysLeft = (endDate) => {
    return Math.max(
      0,
      Math.ceil((new Date(endDate) - new Date()) / (1000 * 60 * 60 * 24))
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Support Local Businesses
          </h1>
          <p className="text-gray-600">
            Help small businesses grow by contributing to their fundraising campaigns
          </p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
            {success}
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-md mb-6">
          <div className="border-b">
            <div className="flex">
              <button
                onClick={() => setActiveTab('active')}
                className={`flex-1 py-4 px-6 font-semibold transition ${
                  activeTab === 'active'
                    ? 'text-green-600 border-b-2 border-green-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                🎯 Active Fundraisers ({fundraisers.length})
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`flex-1 py-4 px-6 font-semibold transition ${
                  activeTab === 'history'
                    ? 'text-green-600 border-b-2 border-green-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                📜 My Donations ({myDonations.length})
              </button>
            </div>
          </div>
        </div>

        {/* Active Fundraisers Tab */}
        {activeTab === 'active' && (
          <>
            {/* Filters */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <input
                  type="text"
                  name="search"
                  value={filters.search}
                  onChange={handleFilterChange}
                  placeholder="Search campaigns..."
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />

                <select
                  name="businessType"
                  value={filters.businessType}
                  onChange={handleFilterChange}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">All Business Types</option>
                  {businessTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>

                <input
                  type="text"
                  name="city"
                  value={filters.city}
                  onChange={handleFilterChange}
                  placeholder="City..."
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />

                <input
                  type="text"
                  name="state"
                  value={filters.state}
                  onChange={handleFilterChange}
                  placeholder="State..."
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={fetchFundraisers}
                  disabled={loading}
                  className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition"
                >
                  {loading ? 'Searching...' : 'Search'}
                </button>
                <button
                  onClick={clearFilters}
                  className="px-6 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition"
                >
                  Clear
                </button>
              </div>
            </div>

            {/* Fundraiser Cards */}
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
              </div>
            ) : fundraisers.length === 0 ? (
              <div className="bg-white rounded-xl shadow-md p-12 text-center">
                <div className="text-6xl mb-4">🎯</div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  No Active Fundraisers
                </h2>
                <p className="text-gray-600">
                  Check back later for new campaigns from local businesses
                </p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {fundraisers.map((fundraiser) => (
                  <div
                    key={fundraiser._id}
                    className="bg-white rounded-xl shadow-md hover:shadow-lg transition overflow-hidden"
                  >
                    {/* Business Type Badge */}
                    <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-4 py-2">
                      <span className="text-sm font-medium">
                        {fundraiser.businessOwner?.businessProfile?.businessType}
                      </span>
                    </div>

                    <div className="p-6">
                      {/* Title */}
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {fundraiser.title}
                      </h3>

                      {/* Business Name */}
                      <p className="text-sm text-gray-600 mb-1">
                        by {fundraiser.businessOwner?.businessProfile?.businessName}
                      </p>

                      {/* Location */}
                      <p className="text-xs text-gray-500 mb-4">
                        📍{' '}
                        {fundraiser.businessOwner?.businessProfile?.location?.city},{' '}
                        {fundraiser.businessOwner?.businessProfile?.location?.state}
                      </p>

                      {/* Purpose */}
                      <div className="bg-blue-50 rounded-lg p-3 mb-4">
                        <p className="text-xs text-blue-600 mb-1">Purpose</p>
                        <p className="text-sm text-blue-900">{fundraiser.purpose}</p>
                      </div>

                      {/* Description */}
                      <p className="text-sm text-gray-700 mb-4 line-clamp-3">
                        {fundraiser.description}
                      </p>

                      {/* Progress Bar */}
                      <div className="mb-4">
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-600">
                            ₹{fundraiser.currentAmount.toLocaleString()} raised
                          </span>
                          <span className="font-medium text-green-600">
                            {calculateProgress(
                              fundraiser.currentAmount,
                              fundraiser.goalAmount
                            ).toFixed(0)}
                            %
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div
                            className="bg-green-600 h-3 rounded-full transition-all"
                            style={{
                              width: `${calculateProgress(
                                fundraiser.currentAmount,
                                fundraiser.goalAmount
                              )}%`,
                            }}
                          />
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-3 gap-2 mb-4 text-center">
                        <div className="bg-gray-50 rounded-lg p-2">
                          <p className="text-xs text-gray-600">Goal</p>
                          <p className="text-sm font-bold text-gray-900">
                            ₹{fundraiser.goalAmount.toLocaleString()}
                          </p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-2">
                          <p className="text-xs text-gray-600">Supporters</p>
                          <p className="text-sm font-bold text-gray-900">
                            {fundraiser.supporters?.length || 0}
                          </p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-2">
                          <p className="text-xs text-gray-600">Days Left</p>
                          <p className="text-sm font-bold text-gray-900">
                            {calculateDaysLeft(fundraiser.endDate)}
                          </p>
                        </div>
                      </div>

                      {/* Donate Button */}
                      <button
                        onClick={() => openDonateModal(fundraiser)}
                        className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-700 transition"
                      >
                        💚 Support This Business
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Donation History Tab */}
        {activeTab === 'history' && (
          <>
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
              </div>
            ) : myDonations.length === 0 ? (
              <div className="bg-white rounded-xl shadow-md p-12 text-center">
                <div className="text-6xl mb-4">💚</div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  No Donations Yet
                </h2>
                <p className="text-gray-600 mb-6">
                  Start supporting local businesses today!
                </p>
                <button
                  onClick={() => setActiveTab('active')}
                  className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition"
                >
                  Browse Fundraisers
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Summary Card */}
                <div className="bg-gradient-to-r from-green-500 to-blue-500 rounded-xl shadow-md p-6 text-white">
                  <h2 className="text-xl font-bold mb-4">Your Impact 🎉</h2>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm opacity-90">Total Donations</p>
                      <p className="text-3xl font-bold">{myDonations.length}</p>
                    </div>
                    <div>
                      <p className="text-sm opacity-90">Total Amount</p>
                      <p className="text-3xl font-bold">
                        ₹
                        {myDonations
                          .reduce((sum, d) => sum + d.amount, 0)
                          .toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm opacity-90">Businesses Supported</p>
                      <p className="text-3xl font-bold">
                        {new Set(myDonations.map((d) => d.fundraiserId?._id)).size}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Donation List */}
                <div className="bg-white rounded-xl shadow-md p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">
                    Donation History
                  </h2>
                  <div className="space-y-4">
                    {myDonations.map((donation, index) => (
                      <div
                        key={index}
                        className="border border-gray-200 rounded-lg p-4 hover:border-green-300 transition"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="font-bold text-gray-900 mb-1">
                              {donation.fundraiserId?.title || 'Fundraiser'}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {donation.fundraiserId?.businessOwner?.businessProfile
                                ?.businessName || 'Business'}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-green-600">
                              ₹{donation.amount.toLocaleString()}
                            </p>
                            <span
                              className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 ${
                                donation.fundraiserId?.status === 'completed'
                                  ? 'bg-blue-100 text-blue-700'
                                  : donation.fundraiserId?.status === 'cancelled'
                                  ? 'bg-red-100 text-red-700'
                                  : 'bg-green-100 text-green-700'
                              }`}
                            >
                              {donation.fundraiserId?.status || 'active'}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-sm text-gray-600">
                          <span>
                            {new Date(donation.date).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric',
                            })}
                          </span>
                          <span>
                            📍{' '}
                            {donation.fundraiserId?.businessOwner?.businessProfile
                              ?.location?.city || 'N/A'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Donation Modal */}
      {showDonateModal && selectedFundraiser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Support This Business 💚
            </h2>

            {/* Fundraiser Info */}
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <h3 className="font-bold text-gray-900 mb-1">
                {selectedFundraiser.title}
              </h3>
              <p className="text-sm text-gray-600">
                by{' '}
                {selectedFundraiser.businessOwner?.businessProfile?.businessName}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                {selectedFundraiser.purpose}
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Donation Amount */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Donation Amount (₹) *
              </label>
              <input
                type="number"
                value={donationAmount}
                onChange={(e) => setDonationAmount(e.target.value)}
                min="100"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Minimum ₹100"
              />
            </div>

            {/* Quick Amount Buttons */}
            <div className="grid grid-cols-4 gap-2 mb-4">
              {[100, 500, 1000, 5000].map((amount) => (
                <button
                  key={amount}
                  onClick={() => setDonationAmount(amount.toString())}
                  className="bg-gray-100 hover:bg-green-100 text-gray-700 hover:text-green-700 px-3 py-2 rounded-lg text-sm font-medium transition"
                >
                  ₹{amount}
                </button>
              ))}
            </div>

            {/* Message */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message (Optional)
              </label>
              <textarea
                value={donationMessage}
                onChange={(e) => setDonationMessage(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Words of encouragement..."
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDonateModal(false);
                  setSelectedFundraiser(null);
                  setError('');
                }}
                className="flex-1 bg-gray-200 text-gray-700 px-4 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDonate}
                disabled={donating}
                className={`flex-1 bg-green-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-green-700 transition ${
                  donating ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {donating ? 'Processing...' : 'Donate Now'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Fundraisers;