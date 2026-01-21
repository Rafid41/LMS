import React from "react";
import { useLocation, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Trophy, ArrowLeft, Star } from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";

const QuizResult = () => {
  const location = useLocation();
  const { score, total } = location.state || { score: 0, total: 0 };
  const { isDarkMode } = useTheme();

  const percentage = (score / total) * 100;
  const isPassed = percentage >= 60;

  return (
    <div className={`min-h-screen flex items-center justify-center px-4 ${isDarkMode ? "bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500" : "bg-[#fe588]"}`}>
      <motion.div
        className={`shadow-2xl rounded-3xl p-10 max-w-lg w-full text-center ${isDarkMode ? "bg-white" : "bg-white"}`}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div
          className={`mx-auto w-24 h-24 flex items-center justify-center rounded-full shadow-lg mb-6 ${
            isPassed ? "bg-green-100" : "bg-red-100"
          }`}
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
        >
          <Trophy
            className={`w-12 h-12 ${
              isPassed ? "text-green-600" : "text-red-600"
            }`}
          />
        </motion.div>

        <h1 className={`text-3xl font-bold mb-2 ${isDarkMode ? "text-gray-800" : "text-gray-900"}`}>Quiz Result</h1>
        <p className={`mb-6 ${isDarkMode ? "text-gray-600" : "text-gray-700"}`}>
          You scored{" "}
          <span className={`font-semibold ${isDarkMode ? "text-indigo-700" : "text-indigo-900"}`}>
            {score} / {total}
          </span>
        </p>

        {/* Progress bar */}
        <div className={`w-full rounded-full h-4 mb-6 ${isDarkMode ? "bg-gray-200" : "bg-gray-300"}`}>
          <motion.div
            className={`h-4 rounded-full ${
              isPassed ? "bg-green-500" : "bg-red-500"
            }`}
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 1 }}
          />
        </div>

        {/* Message */}
        <motion.p
          className={`text-lg font-medium mb-6 ${
            isPassed ? "text-green-600" : "text-red-600"
          }`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          {isPassed ? "Congratulations! You passed 🎉" : "Keep trying! You can do better 💪"}
        </motion.p>

        {/* Stars animation */}
        <div className="flex justify-center mb-8">
          {[...Array(total)].map((_, i) => (
            <Star
              key={i}
              className={`w-6 h-6 mx-1 ${
                i < score ? "text-yellow-400" : "text-gray-300"
              }`}
              fill={i < score ? "#FACC15" : "none"}
            />
          ))}
        </div>

        <Link
          to={`/courses/${location.state.courseId}`}
          className="inline-flex items-center justify-center gap-2 bg-indigo-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-indigo-700 transition"
        >
          <ArrowLeft size={18} /> Back to Course
        </Link>
      </motion.div>
    </div>
  );
};

export default QuizResult;
