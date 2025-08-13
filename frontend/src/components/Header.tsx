// frontend\src\components\Header.tsx
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Sun, Moon, MapPin, User, LogOut, Settings } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { isDark, toggleTheme } = useTheme();
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

const navItems = [
  { name: 'Home', path: '/' },
  { name: 'Report Issue', path: '/report' },
  { name: 'Map View', path: '/map' },
  { name: 'Dashboard', path: '/dashboard' },
  { name: 'Civic Updates', path: '/updates' },
  { name: 'About', path: '/about' },
   ...(user?.role === 'authority' ? [{ name: 'Authority Dashboard', path: '/authority' }] : [])
];

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    logout();
    setIsProfileOpen(false);
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm dark:bg-gray-900 dark:border-gray-700">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="p-2 bg-blue-600 rounded-lg">
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">CivicLens</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden space-x-8 md:flex">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive(item.path)
                    ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                    : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="p-2 text-gray-600 transition-colors bg-gray-100 rounded-lg dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center justify-center w-10 h-10 text-gray-600 transition-colors bg-gray-100 rounded-full dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                  aria-label="User profile"
                >
                  {user?.profilePicture ? (
                    <img 
                      src={user.profilePicture} 
                      alt="Profile" 
                      className="object-cover w-full h-full rounded-full"
                    />
                  ) : (
                    <User className="w-5 h-5" />
                  )}
                </button>

                {/* Profile dropdown */}
                {isProfileOpen && (
                  <div className="absolute right-0 z-10 w-48 mt-2 origin-top-right bg-white rounded-md shadow-lg dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="py-1">
                      <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{user?.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email}</p>
                      </div>
                      <Link
                        to="/profile"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <User className="w-4 h-4 mr-2" />
                        Profile
                      </Link>
                      <Link
                        to="/settings"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <Settings className="w-4 h-4 mr-2" />
                        Settings
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="hidden px-4 py-2 font-medium text-white transition-colors bg-blue-600 rounded-lg md:inline-flex hover:bg-blue-700"
              >
                Login
              </Link>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-gray-600 transition-colors rounded-lg md:hidden dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="py-4 border-t border-gray-200 md:hidden dark:border-gray-700">
            <nav className="flex flex-col space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive(item.path)
                      ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                      : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              {isAuthenticated ? (
                <>
                  <Link
                    to="/profile"
                    className="px-3 py-2 text-sm font-medium text-gray-700 rounded-md dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="px-3 py-2 text-sm font-medium text-left text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    Sign out
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="px-4 py-2 mt-4 font-medium text-center text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;