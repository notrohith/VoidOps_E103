import { Link } from 'react-router-dom';

const UserTypeSelection = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your Account Type
          </h1>
          <p className="text-lg text-gray-600">
            Select the option that best describes you
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Business User Card */}
          <Link
            to="/register/business"
            className="bg-white rounded-xl shadow-lg p-8 hover:shadow-2xl transition transform hover:-translate-y-2"
          >
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-5xl">🏪</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Business Owner
              </h2>
              <p className="text-gray-600 mb-6">
                I own or manage a small business and want to grow
              </p>

              <div className="text-left space-y-3 mb-6">
                <div className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span className="text-sm text-gray-700">
                    Get personalized growth guidance
                  </span>
                </div>
                <div className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span className="text-sm text-gray-700">
                    Create fundraising campaigns
                  </span>
                </div>
                <div className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span className="text-sm text-gray-700">
                    Collaborate with other businesses
                  </span>
                </div>
                <div className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span className="text-sm text-gray-700">
                    AI-powered business analysis
                  </span>
                </div>
              </div>

              <div className="bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition">
                Register as Business
              </div>
            </div>
          </Link>

          {/* Normal User Card */}
          <Link
            to="/register/normal"
            className="bg-white rounded-xl shadow-lg p-8 hover:shadow-2xl transition transform hover:-translate-y-2"
          >
            <div className="text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-5xl">👤</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Supporter
              </h2>
              <p className="text-gray-600 mb-6">
                I want to discover and support local businesses
              </p>

              <div className="text-left space-y-3 mb-6">
                <div className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span className="text-sm text-gray-700">
                    Discover local businesses
                  </span>
                </div>
                <div className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span className="text-sm text-gray-700">
                    Support business fundraisers
                  </span>
                </div>
                <div className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span className="text-sm text-gray-700">
                    Track your contributions
                  </span>
                </div>
                <div className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span className="text-sm text-gray-700">
                    Help your community grow
                  </span>
                </div>
              </div>

              <div className="bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition">
                Register as Supporter
              </div>
            </div>
          </Link>
        </div>

        {/* Already have account */}
        <div className="text-center mt-8">
          <p className="text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 font-semibold hover:underline">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserTypeSelection;