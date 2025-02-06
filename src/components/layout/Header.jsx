// src/components/layout/Header.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const Header = () => {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-white shadow-md">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo, Brand, and Welcome Section */}
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-2">
              <img 
                src="/assets/elogo1.jpg" 
                alt="Event Manager Logo" 
                className="h-10 w-10 rounded-full object-cover"
              />
              <span className="text-2xl font-bold-italic text-purple-700 hidden sm:block">
                Event Manager
              </span>
            </Link>
            
            {user && (
              <div className="hidden sm:flex items-center space-x-4">
                <div className="bg-teal-50 px-4 py-2 rounded-full flex items-center space-x-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-teal-600" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                  <p className="text-sm font-semibold text-teal-700">
                    Welcome, {user.name.split(' ')[0]}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="sm:hidden">
            <button 
              onClick={toggleMenu}
              className="text-teal-600 focus:outline-none"
            >
              {isMenuOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>

          {/* Desktop and Mobile Menu */}
          <div className={`
            fixed inset-0 bg-white z-50 transform transition-transform duration-300 ease-in-out
            ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}
            sm:static sm:translate-x-0 sm:flex sm:items-center sm:space-x-4 sm:bg-transparent sm:z-auto
          `}>
            <div className="flex flex-col sm:flex-row items-center justify-center h-full space-y-6 sm:space-y-0 sm:space-x-4">
              {/* Show brand on mobile */}
              <Link 
                to="/" 
                className="sm:hidden text-2xl font-bold-italic text-purple-700 mb-8"
              >
                Event Manager
              </Link>

              {/* Close button for mobile */}
              <button 
                onClick={toggleMenu}
                className="sm:hidden absolute top-4 right-4 text-teal-600"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {user ? (
                <>
                  {/* Welcome Message for Mobile */}
                  <div className="sm:hidden bg-teal-50 px-4 py-2 rounded-full mb-4 flex items-center space-x-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-teal-600" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                    <p className="text-sm font-semibold text-teal-700">
                      Welcome, {user.name.split(' ')[0]}
                    </p>
                  </div>

                  {/* Navigation Links */}
                  <Link 
                    to="/dashboard" 
                    onClick={toggleMenu}
                    className="group relative inline-block text-teal-600 hover:text-purple-600 transition-colors w-full sm:w-auto text-center"
                  >
                    <div className="absolute -inset-0.5 bg-teal-200 group-hover:bg-purple-200 rounded-lg opacity-50 group-hover:opacity-75 transition-all"></div>
                    <div className="relative flex items-center space-x-2 bg-white sm:bg-transparent px-4 py-2 rounded-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                      </svg>
                      <span>Dashboard</span>
                    </div>
                  </Link>

                  <Link 
                    to="/create-event" 
                    onClick={toggleMenu}
                    className="group relative inline-block text-teal-600 hover:text-purple-600 transition-colors w-full sm:w-auto text-center"
                  >
                    <div className="absolute -inset-0.5 bg-teal-200 group-hover:bg-purple-200 rounded-lg opacity-50 group-hover:opacity-75 transition-all"></div>
                    <div className="relative flex items-center space-x-2 bg-white sm:bg-transparent px-4 py-2 rounded-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                      </svg>
                      <span>Add New Event</span>
                    </div>
                  </Link>

                  <button
                    onClick={() => {
                      logout();
                      toggleMenu();
                    }}
                    className="bg-teal-400 text-white px-4 py-2 rounded-full hover:bg-purple-600 transition-colors w-full sm:w-auto flex items-center space-x-2 group"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transform group-hover:translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H5a1 1 0 100 2h9.586l-1.293 1.293z" clipRule="evenodd" />
                    </svg>
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    to="/login" 
                    onClick={toggleMenu}
                    className="group relative inline-block text-teal-600 hover:text-purple-600 transition-colors w-full sm:w-auto text-center"
                  >
                    <div className="absolute -inset-0.5 bg-teal-200 group-hover:bg-purple-200 rounded-lg opacity-50 group-hover:opacity-75 transition-all"></div>
                    <div className="relative flex items-center space-x-2 bg-white sm:bg-transparent px-4 py-2 rounded-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H5a1 1 0 100 2h9.586l-1.293 1.293z" clipRule="evenodd" />
                      </svg>
                      <span>Login</span>
                    </div>
                  </Link>
                  <Link 
                    to="/register" 
                    onClick={toggleMenu}
                    className="group relative inline-block text-teal-600 hover:text-purple-600 transition-colors w-full sm:w-auto text-center"
                  >
                    <div className="absolute -inset-0.5 bg-teal-200 group-hover:bg-purple-200 rounded-lg opacity-50 group-hover:opacity-75 transition-all"></div>
                    <div className="relative flex items-center space-x-2 bg-white sm:bg-transparent px-4 py-2 rounded-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
                      </svg>
                      <span>Register</span>
                    </div>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;