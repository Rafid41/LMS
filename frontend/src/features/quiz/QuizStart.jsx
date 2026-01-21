import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import courses from "../../data/courses.json";
import { Clock, HelpCircle, Award } from "lucide-react"; // icons
import { useTheme } from "../../contexts/ThemeContext";


const QuizStart = () => {
  const { courseId, moduleId } = useParams();
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const course = courses.courses.find((c) => c.id === courseId);
  const module = course.modules.find((m) => m.id === moduleId);
  const quiz = module.quiz;

  const handleStartQuiz = () => {
    navigate(`/courses/${courseId}/quiz/${moduleId}/exam`);
  };

  return (
    <motion.div
      className={`min-h-screen flex flex-col items-center justify-center p-6 ${isDarkMode ? "bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white" : "bg-[#fe588] text-black"}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        className={`rounded-3xl shadow-2xl p-10 w-full max-w-lg text-center relative overflow-hidden ${isDarkMode ? "bg-white text-gray-900" : "bg-white text-black"}`}
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className={`absolute inset-0 ${isDarkMode ? "bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 opacity-40" : "bg-gray-100 opacity-70"}`} />
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2">{module.title}</h1>
          <p className={`text-lg font-medium mb-6 ${isDarkMode ? "text-indigo-700" : "text-indigo-900"}`}>
            Get ready for your quiz!
          </p>

          <div className={`flex flex-col gap-4 text-left rounded-2xl p-5 mb-8 ${isDarkMode ? "bg-indigo-50" : "bg-gray-100"}`}>
            <div className="flex items-center gap-3">
              <HelpCircle className={`size={24} ${isDarkMode ? "text-indigo-500" : "text-indigo-700"}`} />
              <p className={`text-gray-700 ${isDarkMode ? "text-gray-700" : "text-gray-800"}`}>
                <strong>Questions:</strong> {quiz.questions.length}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Clock className={`size={24} ${isDarkMode ? "text-indigo-500" : "text-indigo-700"}`} />
              <p className={`text-gray-700 ${isDarkMode ? "text-gray-700" : "text-gray-800"}`}>
                <strong>Time:</strong> 10 Minutes
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Award className={`size={24} ${isDarkMode ? "text-indigo-500" : "text-indigo-700"}`} />
              <p className={`text-gray-700 ${isDarkMode ? "text-gray-700" : "text-gray-800"}`}>
                <strong>Total Points:</strong> {quiz.points}
              </p>
            </div>
          </div>

          <motion.button
            onClick={handleStartQuiz}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-indigo-600 hover:bg-indigo-700 transition-colors text-white font-semibold px-8 py-3 rounded-full shadow-lg"
          >
            🚀 Start Exam
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default QuizStart;
