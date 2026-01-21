import React from "react";
import { FaCog, FaMoon, FaSun } from "react-icons/fa";
import { useTheme } from "../contexts/ThemeContext";

const WebsiteSettings = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <div className={`min-h-screen p-6 ${isDarkMode ? "bg-gray-900 text-white" : "bg-white text-black"}`}>
      <h1 className="text-3xl font-extrabold mb-6">Settings</h1>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <div className="w-full lg:w-1/4">
          <ul className="space-y-2">
            <li>
              <a
                href="#general"
                className={`flex items-center gap-2 p-3 rounded-lg transition-colors ${
                  isDarkMode
                    ? "hover:bg-gray-700 bg-gray-800 text-white"
                    : "hover:bg-[#3d348b] bg-white text-black"
                }`}
              >
                <FaCog /> General
              </a>
            </li>
            <li>
              <a
                href="#appearance"
                className={`flex items-center gap-2 p-3 rounded-lg transition-colors ${
                  isDarkMode
                    ? "hover:bg-gray-700 bg-gray-800 text-white"
                    : "hover:bg-[#3d348b] bg-white text-black"
                }`}
              >
                <FaMoon /> Appearance
              </a>
            </li>
          </ul>
        </div>

        {/* Content */}
        <div className={`w-full lg:w-3/4 rounded-2xl shadow-lg p-6 transition-colors ${isDarkMode ? "bg-gray-800 text-white" : "bg-white text-black"}`}>
          {/* General Section */}
          <div id="general" className="mb-8">
            <h2 className="text-2xl font-bold mb-4">General</h2>
            <div className="flex items-center gap-4">
              <span className="font-medium">Dark Mode</span>
              <button
                onClick={toggleTheme}
                className={`w-14 h-7 flex items-center rounded-full p-1 transition-colors duration-300 ${
                  isDarkMode ? "bg-emerald-500 justify-end" : "bg-[#7678ed] justify-start"
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform duration-300`}
                ></div>
              </button>
            </div>
          </div>

          {/* Appearance Section */}
          <div id="appearance">
            <h2 className="text-2xl font-bold mb-4">Appearance</h2>
            <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-700"}`}>
              Customize the look and feel of your website.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WebsiteSettings;
