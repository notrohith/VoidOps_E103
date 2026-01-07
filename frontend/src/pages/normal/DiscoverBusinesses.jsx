import { useState, useEffect } from 'react';
import api from '../../services/api';

const DiscoverBusinesses = () => {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    query: '',
    businessType: '',
    city: '',
    state: '',
  });

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
    searchBusinesses();
  }, []);

  const searchBusinesses = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      
      if (filters.query) queryParams.append('query', filters.query);
      if (filters.businessType) queryParams.append('businessType', filters.businessType);
      if (filters.city) queryParams.append('city', filters.city);
      if (filters.state) queryParams.append('state', filters.state);

      const response = await api.get(`/business/search?${queryParams.toString()}`);
      if (response.data.success) {
        setBusinesses(response.data.data);
      }
    } catch (err) {
      console.error('Error searching businesses:', err);
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
      query: '',
      businessType: '',
      city: '',
      state: '',
    });
    setTimeout(searchBusinesses, 100);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Discover Local Businesses
          </h1>
          <p className="text-gray-600">
            Find and connect with family-run businesses in your area
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {/* Search Query */}
            <input
              type="text"
              name="query"
              value={filters.query}
              onChange={handleFilterChange}
              placeholder="Search by name..."
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />

            {/* Business Type */}
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

            {/* City */}
            <input
              type="text"
              name="city"
              value={filters.city}
              onChange={handleFilterChange}
              placeholder="City..."
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />

            {/* State */}
            <input
              type="text"
              name="state"
              value={filters.state}
              onChange={handleFilterChange}
              placeholder="State..."
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={searchBusinesses}
              disabled={loading}
              className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition"
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
            <button
              onClick={clearFilters}
              className="px-6 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-4">
          <p className="text-gray-600">
            Found <span className="font-semibold">{businesses.length}</span>{' '}
            {businesses.length === 1 ? 'business' : 'businesses'}
          </p>
        </div>

        {/* Business Cards */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          </div>
        ) : businesses.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              No Businesses Found
            </h2>
            <p className="text-gray-600">
              Try adjusting your search filters or explore all businesses
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {businesses.map((business) => (
              <div
                key={business._id}
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition overflow-hidden"
              >
                {/* Business Type Badge */}
                <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-4 py-2">
                  <span className="text-sm font-medium">
                    {business.businessProfile?.businessType}
                  </span>
                </div>

                <div className="p-6">
                  {/* Business Name */}
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {business.businessProfile?.businessName}
                  </h3>

                  {/* Owner Name */}
                  <p className="text-sm text-gray-600 mb-3">
                    by {business.name}
                  </p>

                  {/* Location */}
                  <div className="flex items-center text-sm text-gray-600 mb-4">
                    <span className="mr-1">📍</span>
                    <span>
                      {business.businessProfile?.location?.city},{' '}
                      {business.businessProfile?.location?.state}
                    </span>
                  </div>

                  {/* Business Info */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Years Operating:</span>
                      <span className="font-medium">
                        {business.businessProfile?.yearsInOperation} years
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Team Size:</span>
                      <span className="font-medium">
                        {business.businessProfile?.teamSize}
                      </span>
                    </div>
                  </div>

                  {/* Primary Goal */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                    <p className="text-xs text-blue-600 mb-1">Primary Goal</p>
                    <p className="text-sm font-medium text-blue-900">
                      {business.businessProfile?.primaryGoal}
                    </p>
                  </div>

                  {/* Contact Button */}
                  <button className="w-full bg-green-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-green-700 transition">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DiscoverBusinesses;