import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Load saved session on app start
  useEffect(() => {
    const saved = localStorage.getItem("lms_session");
    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch (err) {
        console.error("Invalid session format:", err);
      }
    }
  }, []);

  const login = (sessionData) => {
    setUser(sessionData);
    localStorage.setItem("lms_session", JSON.stringify(sessionData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("lms_session");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
