import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import StudentDashboard from '../features/dashboards/StudentDashboard';
import TeacherDashboard from '../features/dashboards/TeacherDashboard';
import AdminDashboard from '../features/dashboards/AdminDashboard';
import { Navigate } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" />;
  }

  switch (user.role) {
    case 'student':
      return <StudentDashboard />;
    case 'teacher':
      return <TeacherDashboard />;
    case 'admin':
      return <AdminDashboard />;
    default:
      return <Navigate to="/login" />;
  }
};

export default Dashboard;
