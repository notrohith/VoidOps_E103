import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/shared/Navbar';
import Footer from './components/shared/Footer';
import ProtectedRoute from './components/shared/ProtectedRoute';

// Auth Pages
import LandingPage from './pages/auth/LandingPage';
import UserTypeSelection from './pages/auth/UserTypeSelection';
import Login from './pages/auth/Login';
import RegisterBusiness from './pages/auth/RegisterBusiness';
import RegisterNormal from './pages/auth/RegisterNormal';

// Business Pages
import BusinessDashboard from './pages/business/BusinessDashboard';
import GrowthPlan from './pages/business/GrowthPlan';
import ChatAssistant from './pages/business/ChatAssistant';
import CreateFundraiser from './pages/business/CreateFundraiser';
import Collaboration from './pages/business/Collaboration';

// Normal User Pages
import NormalDashboard from './pages/normal/NormalDashboard';
import DiscoverBusinesses from './pages/normal/DiscoverBusinesses';
import Fundraisers from './pages/normal/Fundraisers';
import SupportBusiness from './pages/normal/SupportBusiness';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen flex flex-col bg-gray-50">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/register" element={<UserTypeSelection />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register/business" element={<RegisterBusiness />} />
              <Route path="/register/normal" element={<RegisterNormal />} />

              {/* Business Routes */}
              <Route
                path="/business/dashboard"
                element={
                  <ProtectedRoute requireBusiness>
                    <BusinessDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/business/growth-plan"
                element={
                  <ProtectedRoute requireBusiness>
                    <GrowthPlan />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/business/chat"
                element={
                  <ProtectedRoute requireBusiness>
                    <ChatAssistant />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/business/fundraiser"
                element={
                  <ProtectedRoute requireBusiness>
                    <CreateFundraiser />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/business/collaboration"
                element={
                  <ProtectedRoute requireBusiness>
                    <Collaboration />
                  </ProtectedRoute>
                }
              />

              {/* Normal User Routes */}
              <Route
                path="/normal/dashboard"
                element={
                  <ProtectedRoute requireNormal>
                    <NormalDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/normal/discover"
                element={
                  <ProtectedRoute requireNormal>
                    <DiscoverBusinesses />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/normal/fundraisers"
                element={
                  <ProtectedRoute requireNormal>
                    <Fundraisers />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/normal/support/:id"
                element={
                  <ProtectedRoute requireNormal>
                    <SupportBusiness />
                  </ProtectedRoute>
                }
              />

              {/* Catch all */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;