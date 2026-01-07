import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-xl font-bold mb-4">GrowMe</h3>
            <p className="text-gray-300 text-sm">
              Empowering small, family-run businesses in India with AI-powered
              growth solutions. Sustainable growth made simple.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-gray-300 hover:text-white">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-gray-300 hover:text-white">
                  Register
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <p className="text-gray-300 text-sm">
              Need help? We're here for you!
            </p>
            <p className="text-gray-300 text-sm mt-2">
              Email: support@growme.in
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-sm text-gray-400">
          <p>&copy; 2024 GrowMe. All rights reserved.</p>
          <p className="mt-2">Made with ❤️ for Indian Small Businesses</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;