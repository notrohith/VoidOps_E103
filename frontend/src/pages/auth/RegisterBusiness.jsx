import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { validateRegistration } from '../../utils/validation';

const RegisterBusiness = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    userType: 'business',
    businessProfile: {
      businessName: '',
      businessType: '',
      location: {
        city: '',
        state: '',
      },
      yearsInOperation: 0,
      weeklyTime: '',
      monthlyBudget: '',
      teamSize: '',
      techComfort: '',
      primaryGoal: '',
    },
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const { register } = useAuth();
  const navigate = useNavigate();

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

  const indianStates = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
    'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
    'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
    'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData((prev) => ({
        ...prev,
        businessProfile: {
          ...prev.businessProfile,
          [child]: value,
        },
      }));
    } else if (name === 'city' || name === 'state') {
      setFormData((prev) => ({
        ...prev,
        businessProfile: {
          ...prev.businessProfile,
          location: {
            ...prev.businessProfile.location,
            [name]: value,
          },
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    // Clear errors
    setErrors((prev) => ({
      ...prev,
      [name]: '',
    }));
    setApiError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    const validationErrors = validateRegistration(formData, 'business');
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    setApiError('');

    try {
      const result = await register(formData);

      if (result.success) {
        navigate('/business/dashboard');
      } else {
        setApiError(result.message || 'Registration failed');
      }
    } catch (error) {
      setApiError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Business Registration
            </h1>
            <p className="text-gray-600">
              Tell us about your business to get personalized recommendations
            </p>
          </div>

          {/* API Error */}
          {apiError && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {apiError}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div className="border-b pb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Personal Information
              </h2>

              <div className="grid md:grid-cols-2 gap-4">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Your full name"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="your@email.com"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.phone ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="10-digit mobile number"
                  />
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password *
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.password ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Min 6 characters"
                  />
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-500">{errors.password}</p>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password *
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Re-enter password"
                  />
                  {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Business Details */}
            <div className="border-b pb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Business Details
              </h2>

              <div className="grid md:grid-cols-2 gap-4">
                {/* Business Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Business Name *
                  </label>
                  <input
                    type="text"
                    name="businessProfile.businessName"
                    value={formData.businessProfile.businessName}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.businessName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Your business name"
                  />
                  {errors.businessName && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.businessName}
                    </p>
                  )}
                </div>

                {/* Business Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Business Type *
                  </label>
                  <select
                    name="businessProfile.businessType"
                    value={formData.businessProfile.businessType}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.businessType ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select type</option>
                    {businessTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                  {errors.businessType && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.businessType}
                    </p>
                  )}
                </div>

                {/* City */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.businessProfile.location.city}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.city ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Your city"
                  />
                  {errors.city && (
                    <p className="mt-1 text-sm text-red-500">{errors.city}</p>
                  )}
                </div>

                {/* State */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State *
                  </label>
                  <select
                    name="state"
                    value={formData.businessProfile.location.state}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.state ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select state</option>
                    {indianStates.map((state) => (
                      <option key={state} value={state}>
                        {state}
                      </option>
                    ))}
                  </select>
                  {errors.state && (
                    <p className="mt-1 text-sm text-red-500">{errors.state}</p>
                  )}
                </div>

                {/* Years in Operation */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Years in Operation
                  </label>
                  <input
                    type="number"
                    name="businessProfile.yearsInOperation"
                    value={formData.businessProfile.yearsInOperation}
                    onChange={handleChange}
                    min="0"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0"
                  />
                </div>
              </div>
            </div>

            {/* Resources */}
            <div className="border-b pb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Available Resources
              </h2>

              <div className="grid md:grid-cols-2 gap-4">
                {/* Weekly Time */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Weekly Time (hours) *
                  </label>
                  <input
                    type="number"
                    name="businessProfile.weeklyTime"
                    value={formData.businessProfile.weeklyTime}
                    onChange={handleChange}
                    min="1"
                    max="168"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.weeklyTime ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Hours per week"
                  />
                  {errors.weeklyTime && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.weeklyTime}
                    </p>
                  )}
                </div>

                {/* Monthly Budget */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Monthly Budget (₹) *
                  </label>
                  <input
                    type="number"
                    name="businessProfile.monthlyBudget"
                    value={formData.businessProfile.monthlyBudget}
                    onChange={handleChange}
                    min="0"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.monthlyBudget ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Marketing budget"
                  />
                  {errors.monthlyBudget && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.monthlyBudget}
                    </p>
                  )}
                </div>

                {/* Team Size */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Team Size *
                  </label>
                  <input
                    type="number"
                    name="businessProfile.teamSize"
                    value={formData.businessProfile.teamSize}
                    onChange={handleChange}
                    min="1"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.teamSize ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Number of people"
                  />
                  {errors.teamSize && (
                    <p className="mt-1 text-sm text-red-500">{errors.teamSize}</p>
                  )}
                </div>

                {/* Tech Comfort */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Technical Comfort (1-5) *
                  </label>
                  <select
                    name="businessProfile.techComfort"
                    value={formData.businessProfile.techComfort}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.techComfort ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select level</option>
                    <option value="1">1 - Beginner</option>
                    <option value="2">2 - Basic</option>
                    <option value="3">3 - Comfortable</option>
                    <option value="4">4 - Advanced</option>
                    <option value="5">5 - Expert</option>
                  </select>
                  {errors.techComfort && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.techComfort}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Goals */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Primary Goal
              </h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  What's your main focus? *
                </label>
                <select
                  name="businessProfile.primaryGoal"
                  value={formData.businessProfile.primaryGoal}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.primaryGoal ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select goal</option>
                  <option value="Increase Visibility">Increase Visibility</option>
                  <option value="Boost Sales">Boost Sales</option>
                  <option value="Build Foundation">Build Foundation</option>
                </select>
                {errors.primaryGoal && (
                  <p className="mt-1 text-sm text-red-500">{errors.primaryGoal}</p>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Registering...' : 'Register'}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-blue-600 font-semibold hover:underline"
              >
                Login here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterBusiness;