import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './components/MainLayout';
import Courses from './pages/Courses';
import Login from './features/auth/Login';
import Register from './features/auth/Register';
import Logout from './features/auth/Logout';
import ForgotPassword from './features/auth/ForgotPassword';
import VerifyResetOtp from './features/auth/VerifyResetOtp';
import ResetPassword from './features/auth/ResetPassword';
import CourseDetail from './pages/CourseDetail';
import CategoryCourses from './pages/CategoryCourses';
import QuizStart from './features/quiz/QuizStart';
import Quiz from './features/quiz/Quiz';
import QuizResult from './features/quiz/QuizResult';
import QuizReview from './features/quiz/QuizReview';
import StudentDashboard from './features/dashboards/StudentDashboard';
import TeacherDashboard from './features/dashboards/TeacherDashboard';
import AdminDashboard from './features/dashboards/AdminDashboard';
import Profile from './pages/Profile';
import Categories from './pages/Categories';
import NoticeDetails from './pages/NoticeDetails';
import WebsiteSettings from './pages/WebsiteSettings';
import { ThemeProvider } from './contexts/ThemeContext';

function App() {
  return (
    <Router>
      <ThemeProvider>
        <MainLayout>
          <Routes>
            <Route path="/" element={<Courses />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/verify-reset-otp" element={<VerifyResetOtp />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/courses/:courseId" element={<CourseDetail />} />
            <Route path="/courses/category/:categoryName" element={<CategoryCourses />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/notice/:noticeId" element={<NoticeDetails />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/courses/:courseId/quiz/:moduleId" element={<QuizStart />} />
            <Route path="/courses/:courseId/quiz/:moduleId/exam" element={<Quiz />} />
            <Route path="/courses/:courseId/quiz/:moduleId/result" element={<QuizResult />} />
            <Route path="/courses/:courseId/quiz/:moduleId/review" element={<QuizReview />} />
            <Route path="/student" element={<StudentDashboard />} />
            <Route path="/teacher" element={<TeacherDashboard />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<WebsiteSettings />} />
          </Routes>
        </MainLayout>
      </ThemeProvider>
    </Router>
  );
}

export default App;
