import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Loader2 } from 'lucide-react';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
        <div className="flex justify-center items-center min-h-screen">
            <Loader2 className="animate-spin text-emerald-500" size={40} />
        </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // If user is not authorized, redirect to their main dashboard or home
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
