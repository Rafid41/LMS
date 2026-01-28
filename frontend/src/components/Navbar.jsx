import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Menu, X, Search, Bell } from 'lucide-react';
import courses from '../data/courses.json';
import notifications from '../data/notifications.json';
import { useTheme } from '../contexts/ThemeContext';
import useClickOutside from '../hooks/useClickOutside';

const Navbar = () => {
  const { user } = useAuth();
  const { isDarkMode } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const notificationRef = useClickOutside(() => setNotificationOpen(false));
  const profileRef = useClickOutside(() => setProfileOpen(false));

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query.length > 1) {
      const filtered = courses.courses.filter(
        (course) =>
          course.title.toLowerCase().includes(query.toLowerCase()) ||
          course.author.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(filtered);
    } else {
      setSearchResults([]);
    }
  };

  const getDashboardPath = () => {
    if (!user) return '/login';
    switch (user.role) {
      case 'student': return '/student';
      case 'teacher': return '/teacher';
      case 'admin': return '/admin';
      default: return '/login';
    }
  };

  return (
    <nav
      className={`fixed top-0 w-full z-50 border-b shadow-md ${
        isDarkMode
          ? 'bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800/90 backdrop-blur-md border-slate-600'
          : 'bg-white border-gray-200 shadow-sm'
      }`}
    >
      <div className="container mx-auto flex justify-between items-center px-6 py-3">
        {/* Left Side: Logo + Search */}
        <div className="flex items-center space-x-6">
          <Link to="/courses" className="flex items-center space-x-2">
            <img
              src="/assets/logo/main_logo.png"
              alt="LMS Logo"
              className="h-10 w-auto"
            />
          </Link>

          {/* Search Box */}
          <div className="relative w-64 hidden md:block">
            <div
              className={`relative focus-within:text-gray-100 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}
            >
              <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <Search size={18} />
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearch}
                placeholder="Search courses or instructors..."
                className={`w-full pl-10 pr-4 py-2 text-sm rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition ${
                  isDarkMode
                    ? 'bg-slate-700/80 text-gray-100 border border-slate-600'
                    : 'bg-gray-50 text-gray-900 border border-gray-200'
                }`}
              />
            </div>

            {/* Search Results */}
            {searchResults.length > 0 && (
              <ul
                className={`absolute top-full left-0 w-full mt-2 rounded-xl shadow-lg z-50 max-h-64 overflow-y-auto ${
                  isDarkMode
                    ? 'bg-slate-700/90 border border-slate-600 text-gray-100'
                    : 'bg-white border border-gray-200 text-gray-900'
                }`}
              >
                {searchResults.map((course) => (
                  <li
                    key={course.id}
                    className={`px-4 py-3 transition cursor-pointer ${
                      isDarkMode ? 'hover:bg-slate-600' : 'hover:bg-gray-100'
                    }`}
                  >
                    <Link
                      to={`/courses/${course.id}`}
                      onClick={() => {
                        setSearchQuery('');
                        setSearchResults([]);
                      }}
                    >
                      <p className="font-medium">{course.title}</p>
                      <p
                        className={`text-xs ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-600'
                        }`}
                      >
                        by {course.author}
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Right Side: Menu Tabs + Notification + Profile */}
        <div className="flex items-center space-x-6 ml-auto">
          {/* Menu Tabs */}
          <ul
            className={`hidden md:flex items-center space-x-8 text-[15px] font-semibold ${
              isDarkMode ? 'text-gray-100' : 'text-gray-800'
            }`}
          >
            <li>
              <Link
                to="/courses"
                className="hover:text-emerald-500 transition-colors duration-300"
              >
                Courses
              </Link>
            </li>
            <li>
              <Link
                to="/categories"
                className="hover:text-emerald-500 transition-colors duration-300"
              >
                Categories
              </Link>
            </li>
            {user && (
              <li>
                <Link
                  to="/student"
                  className="hover:text-emerald-500 transition-colors duration-300"
                >
                  Dashboard
                </Link>
              </li>
            )}
            {(user?.role === 'teacher' || user?.role === 'admin') && (
              <li>
                <Link
                  to="/teacher"
                  className="hover:text-emerald-500 transition-colors duration-300"
                >
                  Instructor Dashboard
                </Link>
              </li>
            )}
            {user?.role === 'admin' && (
              <li>
                <Link
                  to="/admin"
                  className="hover:text-emerald-500 transition-colors duration-300"
                >
                  Admin Dashboard
                </Link>
              </li>
            )}
          </ul>

          {/* Notification */}
          <div className="relative" ref={notificationRef}>
            <button
              onClick={() => setNotificationOpen(!notificationOpen)}
              className={`relative hover:text-emerald-500 transition focus:outline-none ${
                isDarkMode ? 'text-gray-100' : 'text-gray-800'
              }`}
            >
              <Bell size={22} />
              {notifications.student_1.some((n) => n.read === 0) && (
                <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
              )}
            </button>
            {notificationOpen && (
              <div
                className={`absolute right-0 mt-3 w-64 md:w-80 rounded-lg shadow-lg border overflow-hidden z-50 ${
                  isDarkMode
                    ? 'bg-slate-700/90 border-slate-600 text-gray-100'
                    : 'bg-white border-gray-200 text-gray-900'
                }`}
              >
                <div
                  className={`p-3 font-semibold border-b ${
                    isDarkMode
                      ? 'text-gray-100 bg-slate-800'
                      : 'text-gray-900 bg-gray-100'
                  }`}
                >
                  Notifications
                </div>
                <ul className="max-h-60 overflow-y-auto">
                  {notifications.student_1.map((notification) => (
                    <li
                      key={notification.id}
                      className={`p-3 border-b transition ${
                        notification.read === 0
                          ? isDarkMode
                            ? 'bg-indigo-900/30'
                            : 'bg-indigo-50'
                          : ''
                      } ${
                        isDarkMode ? 'hover:bg-slate-600' : 'hover:bg-gray-100'
                      }`}
                    >
                      <p className="text-sm">{notification.message}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Profile Dropdown */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="focus:outline-none"
            >
              <img
                src={user?.profile_photo || "http://127.0.0.1:8000/media/profile_picture/default_profile_picture.png"}
                alt="Profile"
                className={`h-9 w-9 rounded-full object-cover border transition ${
                  isDarkMode
                    ? 'border-slate-600 hover:ring-2 hover:ring-emerald-400'
                    : 'border-gray-300 hover:ring-2 hover:ring-emerald-400'
                }`}
              />
            </button>
            {profileOpen && (
              <div
                className={`absolute right-0 mt-3 w-48 rounded-lg shadow-lg border z-50 ${
                  isDarkMode
                    ? 'bg-slate-700/90 border-slate-600 text-gray-100'
                    : 'bg-white border-gray-200'
                }`}
              >
                <Link
                  to="/profile"
                  onClick={() => setProfileOpen(false)}
                  className={`block px-4 py-2 text-sm transition ${
                    isDarkMode
                      ? 'text-gray-100 hover:bg-slate-600'
                      : 'hover:bg-gray-100 text-gray-800'
                  }`}
                >
                  Profile
                </Link>
                <Link
                  to="/settings"
                  onClick={() => setProfileOpen(false)}
                  className={`block px-4 py-2 text-sm transition ${
                    isDarkMode
                      ? 'text-gray-100 hover:bg-slate-600'
                      : 'hover:bg-gray-100 text-gray-800'
                  }`}
                >
                  Settings
                </Link>
                {user ? (
                  <Link
                    to="/logout"
                    onClick={() => setProfileOpen(false)}
                    className={`block px-4 py-2 text-sm transition ${
                      isDarkMode
                        ? 'text-gray-100 hover:bg-red-800 hover:text-red-400'
                        : 'hover:bg-red-800 hover:text-red-400'
                    }`}
                  >
                    Logout
                  </Link>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setProfileOpen(false)}
                    className={`block px-4 py-2 text-sm transition ${
                      isDarkMode
                        ? 'text-gray-100 hover:bg-slate-600'
                        : 'hover:bg-gray-100 text-gray-800'
                    }`}
                  >
                    Login
                  </Link>
                )}
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className={`md:hidden focus:outline-none ml-3 ${
              isDarkMode ? 'text-gray-100' : 'text-gray-800'
            }`}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div
          className={`md:hidden border-t shadow-lg ${
            isDarkMode
              ? 'bg-gradient-to-b from-slate-800 via-slate-700 to-slate-800/90 border-slate-600'
              : 'bg-white border-gray-200'
          }`}
        >
          <ul
            className={`flex flex-col text-center space-y-3 py-4 font-semibold ${
              isDarkMode ? 'text-gray-100' : 'text-gray-800'
            }`}
          >
            <li>
              <Link
                to="/courses"
                onClick={() => setMenuOpen(false)}
                className="block hover:text-emerald-500 transition"
              >
                Courses
              </Link>
            </li>
            <li>
              <Link
                to="/categories"
                onClick={() => setMenuOpen(false)}
                className="block hover:text-emerald-500 transition"
              >
                Categories
              </Link>
            </li>
            {user && (
              <li>
                <Link
                  to="/student"
                  onClick={() => setMenuOpen(false)}
                  className="block hover:text-emerald-500 transition"
                >
                  Dashboard
                </Link>
              </li>
            )}
            {(user?.role === 'teacher' || user?.role === 'admin') && (
              <li>
                <Link
                  to="/teacher"
                  onClick={() => setMenuOpen(false)}
                  className="block hover:text-emerald-500 transition"
                >
                  Instructor Dashboard
                </Link>
              </li>
            )}
            {user?.role === 'admin' && (
              <li>
                <Link
                  to="/admin"
                  onClick={() => setMenuOpen(false)}
                  className="block hover:text-emerald-500 transition"
                >
                  Admin Dashboard
                </Link>
              </li>
            )}
            {!user && (
              <li>
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="block hover:text-emerald-500 transition"
                >
                  Login
                </Link>
              </li>
            )}
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
