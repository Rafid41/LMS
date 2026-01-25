import React, { createContext, useState, useContext, useEffect } from 'react';
import * as authService from '../services/authService';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  // Initialize from localStorage if available
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme === 'dark';
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTheme = async () => {
      // Basic check if user is logged in (has token)
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await authService.getTheme();
          const serverTheme = res.data.theme === 'dark';
          setIsDarkMode(serverTheme);
          localStorage.setItem('theme', res.data.theme); // Sync local storage
        } catch (error) {
          console.error("Failed to fetch theme", error);
        }
      }
      setLoading(false);
    };
    fetchTheme();
  }, []);

  const toggleTheme = async () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem('theme', newMode ? 'dark' : 'light'); // Save immediately
    
    // Sync with backend if logged in
    const token = localStorage.getItem('token');
    if (token) {
        try {
            await authService.updateTheme(newMode ? 'dark' : 'light');
        } catch (error) {
            console.error("Failed to update theme", error);
        }
    }
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
