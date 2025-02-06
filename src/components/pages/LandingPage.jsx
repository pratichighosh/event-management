// src/components/pages/LandingPage.jsx
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const LandingPage = () => {
  const { user } = useAuth();

  return (
    <div>
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="container mx-auto px-6 py-24 text-center">
          <h1 className="text-5xl font-bold mb-6">
            Your Event Management Platform
          </h1>
          <p className="text-xl mb-12 max-w-2xl mx-auto">
            Create, manage, and join amazing events. Connect with people who share your interests.
          </p>
          {!user && (
            <div className="space-x-4">
              <Link
                to="/register"
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Get Started
              </Link>
              <Link
                to="/login"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
              >
                Login
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Us?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-semibold mb-2">Easy Event Creation</h3>
              <p className="text-gray-600">
                Create and manage your events with just a few clicks
              </p>
            </div>
            <div className="text-center p-6">
              <div className="text-4xl mb-4">👥</div>
              <h3 className="text-xl font-semibold mb-2">Connect with Others</h3>
              <p className="text-gray-600">
                Join events and meet people with similar interests
              </p>
            </div>
            <div className="text-center p-6">
              <div className="text-4xl mb-4">📱</div>
              <h3 className="text-xl font-semibold mb-2">Real-time Updates</h3>
              <p className="text-gray-600">
                Stay updated with instant notifications
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-gray-600 mb-8">
            Join thousands of users who are already creating and joining events
          </p>
          {!user && (
            <Link
              to="/register"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Create Your Account
            </Link>
          )}
          {user && (
            <Link
              to="/events"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Browse Events
            </Link>
          )}
        </div>
      </div>

      {/* About Section */}
      <div className="py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">About Us</h2>
            <p className="text-gray-600 leading-relaxed mb-8">
              We're passionate about bringing people together through meaningful events. 
              Our platform makes it easy to discover, create, and manage events of all sizes. 
              Whether you're planning a small meetup or a large conference, we've got you covered.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;