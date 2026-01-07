import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const Collaboration = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('search'); // search, sent, received
  const [businesses, setBusinesses] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [receivedRequests, setReceivedRequests] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [collaborationForm, setCollaborationForm] = useState({
    collaborationType: '',
    message: '',
  });

  const collaborationTypes = [
    'Joint Marketing',
    'Cross Promotion',
    'Resource Sharing',
    'Event Partnership',
    'Product Bundling',
    'Other',
  ];

  useEffect(() => {
    fetchCollaborations();
  }, []);

  const fetchCollaborations = async () => {
    try {
      const [sentResponse, receivedResponse] = await Promise.all([
        api.get('/collaborations?type=sent'),
        api.get('/collaborations?type=received'),
      ]);

      if (sentResponse.data.success) {
        setSentRequests(sentResponse.data.data);
      }
      if (receivedResponse.data.success) {
        setReceivedRequests(receivedResponse.data.data);
      }
    } catch (err) {
      console.error('Error fetching collaborations:', err);
    }
  };

  const searchBusinesses = async () => {
    if (!searchQuery.trim()) {
      setBusinesses([]);
      return;
    }

    try {
      setLoading(true);
      setError('');
      const response = await api.get(`/business/search?query=${searchQuery}`);
      if (response.data.success) {
        setBusinesses(response.data.data);
      }
    } catch (err) {
      setError('Failed to search businesses');
    } finally {
      setLoading(false);
    }
  };

  const openCollaborationModal = (business) => {
    setSelectedBusiness(business);
    setShowModal(true);
    setCollaborationForm({
      collaborationType: '',
      message: '',
    });
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setCollaborationForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const sendCollaborationRequest = async () => {
    if (!collaborationForm.collaborationType || !collaborationForm.message.trim()) {
      setError('Please fill all fields');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const response = await api.post('/collaborations', {
        receiverId: selectedBusiness._id,
        collaborationType: collaborationForm.collaborationType,
        message: collaborationForm.message,
      });

      if (response.data.success) {
        setSuccess('Collaboration request sent successfully!');
        setShowModal(false);
        setSelectedBusiness(null);
        fetchCollaborations();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send request');
    } finally {
      setLoading(false);
    }
  };

  const respondToRequest = async (id, status, responseMessage = '') => {
    try {
      setLoading(true);
      setError('');
      const response = await api.put(`/collaborations/${id}/respond`, {
        status,
        responseMessage,
      });

      if (response.data.success) {
        setSuccess(`Request ${status}!`);
        fetchCollaborations();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to respond');
    } finally {
      setLoading(false);
    }
  };

  const cancelRequest = async (id) => {
    if (!confirm('Are you sure you want to cancel this request?')) return;

    try {
      const response = await api.delete(`/collaborations/${id}`);
      if (response.data.success) {
        setSuccess('Request cancelled');
        fetchCollaborations();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to cancel');
    }
  };

  const markAsCompleted = async (id) => {
    try {
      const response = await api.put(`/collaborations/${id}/complete`);
      if (response.data.success) {
        setSuccess('Collaboration marked as completed!');
        fetchCollaborations();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Business Collaboration
          </h1>
          <p className="text-gray-600">
            Partner with other local businesses for mutual growth
          </p>
        </div>

        {/* Messages */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
            <button
              onClick={() => setError('')}
              className="float-right font-bold"
            >
              ×
            </button>
          </div>
        )}
        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
            {success}
            <button
              onClick={() => setSuccess('')}
              className="float-right font-bold"
            >
              ×
            </button>
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-md mb-6">
          <div className="border-b">
            <div className="flex">
              <button
                onClick={() => setActiveTab('search')}
                className={`flex-1 py-4 px-6 font-semibold transition ${
                  activeTab === 'search'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                🔍 Find Businesses
              </button>
              <button
                onClick={() => setActiveTab('sent')}
                className={`flex-1 py-4 px-6 font-semibold transition ${
                  activeTab === 'sent'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                📤 Sent ({sentRequests.length})
              </button>
              <button
                onClick={() => setActiveTab('received')}
                className={`flex-1 py-4 px-6 font-semibold transition ${
                  activeTab === 'received'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                📥 Received ({receivedRequests.filter(r => r.status === 'pending').length})
              </button>
            </div>
          </div>

          <div className="p-6">
            {/* Search Tab */}
            {activeTab === 'search' && (
              <div>
                {/* Search Bar */}
                <div className="mb-6">
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && searchBusinesses()}
                      placeholder="Search by business name, type, or location..."
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                      onClick={searchBusinesses}
                      disabled={loading}
                      className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
                    >
                      Search
                    </button>
                  </div>
                </div>

                {/* Search Results */}
                {loading ? (
                  <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                  </div>
                ) : businesses.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">🔍</div>
                    <p className="text-gray-600">
                      {searchQuery
                        ? 'No businesses found. Try a different search.'
                        : 'Search for businesses to collaborate with'}
                    </p>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-4">
                    {businesses.map((business) => (
                      <div
                        key={business._id}
                        className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition"
                      >
                        <h3 className="font-bold text-gray-900 mb-1">
                          {business.businessProfile?.businessName}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">
                          {business.businessProfile?.businessType}
                        </p>
                        <p className="text-xs text-gray-500 mb-3">
                          📍 {business.businessProfile?.location?.city},{' '}
                          {business.businessProfile?.location?.state}
                        </p>
                        <button
                          onClick={() => openCollaborationModal(business)}
                          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-700 transition text-sm"
                        >
                          Send Collaboration Request
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Sent Requests Tab */}
            {activeTab === 'sent' && (
              <div>
                {sentRequests.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">📤</div>
                    <p className="text-gray-600">
                      You haven't sent any collaboration requests yet.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {sentRequests.map((request) => (
                      <div
                        key={request._id}
                        className="border border-gray-200 rounded-lg p-4"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-bold text-gray-900">
                              {request.receiver?.businessProfile?.businessName}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {request.collaborationType}
                            </p>
                          </div>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              request.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-700'
                                : request.status === 'accepted'
                                ? 'bg-green-100 text-green-700'
                                : request.status === 'rejected'
                                ? 'bg-red-100 text-red-700'
                                : 'bg-blue-100 text-blue-700'
                            }`}
                          >
                            {request.status}
                          </span>
                        </div>

                        <p className="text-sm text-gray-700 mb-3">
                          {request.message}
                        </p>

                        {request.responseMessage && (
                          <div className="bg-gray-50 rounded-lg p-3 mb-3">
                            <p className="text-xs text-gray-600 mb-1">Response:</p>
                            <p className="text-sm text-gray-700">
                              {request.responseMessage}
                            </p>
                          </div>
                        )}

                        <div className="flex gap-2">
                          {request.status === 'pending' && (
                            <button
                              onClick={() => cancelRequest(request._id)}
                              className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-700 transition"
                            >
                              Cancel Request
                            </button>
                          )}
                          {request.status === 'accepted' && (
                            <button
                              onClick={() => markAsCompleted(request._id)}
                              className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-700 transition"
                            >
                              Mark as Completed
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Received Requests Tab */}
            {activeTab === 'received' && (
              <div>
                {receivedRequests.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">📥</div>
                    <p className="text-gray-600">
                      You haven't received any collaboration requests yet.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {receivedRequests.map((request) => (
                      <div
                        key={request._id}
                        className="border border-gray-200 rounded-lg p-4"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-bold text-gray-900">
                              {request.sender?.businessProfile?.businessName}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {request.collaborationType}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              📍 {request.sender?.businessProfile?.location?.city}
                            </p>
                          </div>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              request.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-700'
                                : request.status === 'accepted'
                                ? 'bg-green-100 text-green-700'
                                : request.status === 'rejected'
                                ? 'bg-red-100 text-red-700'
                                : 'bg-blue-100 text-blue-700'
                            }`}
                          >
                            {request.status}
                          </span>
                        </div>

                        <p className="text-sm text-gray-700 mb-3">
                          {request.message}
                        </p>

                        {request.status === 'pending' && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                const response = prompt(
                                  'Add a message (optional):'
                                );
                                respondToRequest(
                                  request._id,
                                  'accepted',
                                  response || ''
                                );
                              }}
                              className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-700 transition"
                            >
                              Accept
                            </button>
                            <button
                              onClick={() => {
                                const response = prompt(
                                  'Add a message (optional):'
                                );
                                respondToRequest(
                                  request._id,
                                  'rejected',
                                  response || ''
                                );
                              }}
                              className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-700 transition"
                            >
                              Decline
                            </button>
                          </div>
                        )}

                        {request.status === 'accepted' && (
                          <button
                            onClick={() => markAsCompleted(request._id)}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition"
                          >
                            Mark as Completed
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Collaboration Request Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Send Collaboration Request
            </h2>

            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-1">To:</p>
              <p className="font-semibold">
                {selectedBusiness?.businessProfile?.businessName}
              </p>
              <p className="text-sm text-gray-600">
                {selectedBusiness?.businessProfile?.businessType}
              </p>
            </div>

            <div className="space-y-4">
              {/* Collaboration Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Collaboration Type *
                </label>
                <select
                  name="collaborationType"
                  value={collaborationForm.collaborationType}
                  onChange={handleFormChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select type</option>
                  {collaborationTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Message *
                </label>
                <textarea
                  name="message"
                  value={collaborationForm.message}
                  onChange={handleFormChange}
                  rows={4}
                  maxLength={500}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Explain how you'd like to collaborate and the mutual benefits..."
                />
                <p className="text-xs text-gray-500 mt-1">
                  {collaborationForm.message.length}/500 characters
                </p>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowModal(false);
                  setSelectedBusiness(null);
                }}
                className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={sendCollaborationRequest}
                disabled={loading}
                className={`flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition ${
                  loading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {loading ? 'Sending...' : 'Send Request'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Collaboration;