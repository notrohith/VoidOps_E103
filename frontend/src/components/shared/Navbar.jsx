import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, logout, isAuthenticated, isBusiness, isNormal } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold text-blue-600">GrowMe</span>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center space-x-4">
            {!isAuthenticated ? (
              <>
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-md text-sm font-medium"
                >
                  Register
                </Link>
              </>
            ) : (
              <>
                {/* Business User Menu */}
                {isBusiness && (
                  <>
                    <Link
                      to="/business/dashboard"
                      className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/business/growth-plan"
                      className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
                    >
                      Growth Plan
                    </Link>
                    <Link
                      to="/business/fundraiser"
                      className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
                    >
                      Fundraiser
                    </Link>
                    <Link
                      to="/business/collaboration"
                      className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
                    >
                      Collaborate
                    </Link>
                  </>
                )}

                {/* Normal User Menu */}
                {isNormal && (
                  <>
                    <Link
                      to="/normal/dashboard"
                      className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/normal/discover"
                      className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
                    >
                      Discover
                    </Link>
                    <Link
                      to="/normal/fundraisers"
                      className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
                    >
                      Fundraisers
                    </Link>
                  </>
                )}

                {/* User Profile Dropdown */}
                <div className="relative group">
                  <button className="flex items-center space-x-2 text-gray-700 hover:text-blue-600">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium">
                      {user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm font-medium">{user?.name}</span>
                  </button>

                  {/* Dropdown Menu */}
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 hidden group-hover:block z-10">
                    <div className="px-4 py-2 text-sm text-gray-700 border-b">
                      <p className="font-medium">{user?.name}</p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;