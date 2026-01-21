import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Github } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const Footer = () => {
  const { isDarkMode } = useTheme();
  return (
    <footer className={`relative overflow-hidden ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
      {/* Gradient background with soft glow */}
      <div className={`absolute inset-0 ${isDarkMode ? "bg-gradient-to-br from-gray-900 via-gray-950 to-indigo-950" : "bg-[#fe588]"}`}></div>
      <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-indigo-700/20 blur-3xl rounded-full animate-pulse"></div>
      <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-blue-600/20 blur-3xl rounded-full animate-pulse"></div>

      <div className="relative container mx-auto px-6 pt-16 pb-10 z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand / About Section */}
          <div className="md:col-span-2">
            <h3 className={`text-3xl font-extrabold mb-5 tracking-wide ${isDarkMode ? "text-white" : "text-black"}`}>
              LMS <span className="text-indigo-400">Platform</span>
            </h3>
            <p className={`leading-relaxed max-w-md ${isDarkMode ? "text-gray-400" : "text-gray-700"}`}>
              Empower your learning journey with modern, interactive courses crafted by top professionals. Upgrade your skills, your way.
            </p>
            <div className="mt-6 flex space-x-4">
              <a
                href="#"
                className={`p-2.5 rounded-full transition-all duration-300 hover:scale-110 ${isDarkMode ? "bg-gray-800 hover:bg-indigo-600" : "bg-gray-200 hover:bg-indigo-600"}`}
              >
                <Facebook size={20} className={`${isDarkMode ? "text-gray-300 hover:text-white" : "text-gray-700 hover:text-white"}`} />
              </a>
              <a
                href="#"
                className={`p-2.5 rounded-full transition-all duration-300 hover:scale-110 ${isDarkMode ? "bg-gray-800 hover:bg-sky-500" : "bg-gray-200 hover:bg-sky-500"}`}
              >
                <Twitter size={20} className={`${isDarkMode ? "text-gray-300 hover:text-white" : "text-gray-700 hover:text-white"}`} />
              </a>
              <a
                href="#"
                className={`p-2.5 rounded-full transition-all duration-300 hover:scale-110 ${isDarkMode ? "bg-gray-800 hover:bg-pink-500" : "bg-gray-200 hover:bg-pink-500"}`}
              >
                <Instagram size={20} className={`${isDarkMode ? "text-gray-300 hover:text-white" : "text-gray-700 hover:text-white"}`} />
              </a>
              <a
                href="#"
                className={`p-2.5 rounded-full transition-all duration-300 hover:scale-110 ${isDarkMode ? "bg-gray-800 hover:bg-blue-700" : "bg-gray-200 hover:bg-blue-700"}`}
              >
                <Linkedin size={20} className={`${isDarkMode ? "text-gray-300 hover:text-white" : "text-gray-700 hover:text-white"}`} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className={`text-lg font-semibold mb-5 border-l-4 pl-3 ${isDarkMode ? "text-white border-indigo-500" : "text-black border-indigo-700"}`}>
              Quick Links
            </h4>
            <ul className="space-y-3">
              <li>
                <Link to="/courses" className={`${isDarkMode ? "hover:text-indigo-400" : "hover:text-indigo-700"} transition`}>
                  Courses
                </Link>
              </li>
              <li>
                <Link to="/categories" className={`${isDarkMode ? "hover:text-indigo-400" : "hover:text-indigo-700"} transition`}>
                  Categories
                </Link>
              </li>
              <li>
                <Link to="/about" className={`${isDarkMode ? "hover:text-indigo-400" : "hover:text-indigo-700"} transition`}>
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className={`${isDarkMode ? "hover:text-indigo-400" : "hover:text-indigo-700"} transition`}>
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className={`text-lg font-semibold mb-5 border-l-4 pl-3 ${isDarkMode ? "text-white border-indigo-500" : "text-black border-indigo-700"}`}>
              Legal
            </h4>
            <ul className="space-y-3">
              <li>
                <Link to="/privacy" className={`${isDarkMode ? "hover:text-indigo-400" : "hover:text-indigo-700"} transition`}>
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className={`${isDarkMode ? "hover:text-indigo-400" : "hover:text-indigo-700"} transition`}>
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider Line */}
        <div className={`mt-12 mb-8 h-[1px] ${isDarkMode ? "bg-gradient-to-r from-transparent via-gray-700 to-transparent" : "bg-gray-400"}`}></div>

        {/* Footer Bottom */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className={`text-sm mb-4 md:mb-0 ${isDarkMode ? "text-gray-500" : "text-gray-700"}`}>
            © {new Date().getFullYear()} LMS Platform. All rights reserved.
          </p>
          <p className={`text-sm flex items-center space-x-2 ${isDarkMode ? "text-gray-400" : "text-gray-700"}`}>
            <span>Crafted by</span>
            <a
              href="https://github.com/Rafid41"
              target="_blank"
              rel="noopener noreferrer"
              className={`${isDarkMode ? "text-indigo-400 hover:text-indigo-300" : "text-indigo-700 hover:text-indigo-900"} font-medium transition`}
            >
              <Github size={18} />
              <span>Rafid41</span>
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
