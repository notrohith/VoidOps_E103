import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { validateRegistration } from '../../utils/validation';

const RegisterNormal = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    userType: 'normal',
    location: '',
    interests: [],
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const { register } = useAuth();
  const navigate = useNavigate();

  const interestOptions = [
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear errors
    setErrors((prev) => ({
      ...prev,
      [name]: '',
    }));
    setApiError('');
  };

  const handleInterestToggle = (interest) => {
    setFormData((prev) => {
      const interests = prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest];
      return { ...prev, interests };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    const validationErrors = validateRegistration(formData, 'normal');
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    setApiError('');

    try {
      const result = await register(formData);

      if (result.success) {
        navigate('/normal/dashboard');
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Supporter Registration
            </h1>
            <p className="text-gray-600">
              Join our community and support local businesses
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

              <div className="space-y-4">
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
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
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
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
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
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
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
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                      errors.password ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Min 6 characters"
                  />
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-500">{errors.password}</p>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password *
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
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

            {/* Optional Information */}
            <div className="border-b pb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Additional Information (Optional)
              </h2>

              {/* Location */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="City, State"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Helps us show you local businesses
                </p>
              </div>

              {/* Interests */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Your Interests
                </label>
                <p className="text-xs text-gray-500 mb-3">
                  Select business types you're interested in supporting
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {interestOptions.map((interest) => (
                    <button
                      key={interest}
                      type="button"
                      onClick={() => handleInterestToggle(interest)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                        formData.interests.includes(interest)
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {interest}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Benefits Section */}
            <div className="bg-green-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                As a Supporter, you can:
              </h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span>Discover and connect with local businesses</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span>Support business fundraising campaigns</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span>Track your contributions and impact</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span>Help your community grow</span>
                </li>
              </ul>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Registering...' : 'Create Account'}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-green-600 font-semibold hover:underline"
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

export default RegisterNormal;