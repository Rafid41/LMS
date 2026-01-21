import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import courses from "../../data/courses.json";
import { Clock, ArrowLeft, ArrowRight, Send, XCircle } from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";

const Quiz = () => {
  const { courseId, moduleId } = useParams();
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const course = courses.courses.find((c) => c.id === courseId);
  const module = course.modules.find((m) => m.id === moduleId);
  const quiz = module.quiz;

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handleFinalSubmit = useCallback(() => {
    let score = 0;
    quiz.questions.forEach((q, index) => {
      if (selectedAnswers[index] === q.answer) score++;
    });
    navigate(`/courses/${courseId}/quiz/${moduleId}/review`, {
      state: {
        score,
        total: quiz.questions.length,
        selectedAnswers,
        questions: quiz.questions,
        courseId,
      },
    });
  }, [courseId, moduleId, navigate, quiz.questions, selectedAnswers]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          let score = 0;
          quiz.questions.forEach((q, index) => {
            if (selectedAnswers[index] === q.answer) score++;
          });
          navigate(`/courses/${courseId}/quiz/${moduleId}/result`, {
            state: {
              score,
              total: quiz.questions.length,
              courseId,
            },
          });
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [courseId, moduleId, navigate, quiz.questions, selectedAnswers]);

  const handleAnswerSelect = (questionIndex, optionIndex) => {
    setSelectedAnswers((prev) => ({ ...prev, [questionIndex]: optionIndex }));
  };

  const currentQuestion = quiz.questions[currentQuestionIndex];

  return (
    <div className={`min-h-screen flex justify-center items-center py-10 px-4 ${isDarkMode ? "bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-gray-900" : "bg-[#fe588] text-black"} relative`}>
      <motion.div
        className={`rounded-3xl shadow-2xl p-8 max-w-2xl w-full relative z-10 ${isDarkMode ? "bg-white" : "bg-white"}`}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className={`text-2xl font-bold ${isDarkMode ? "text-indigo-700" : "text-indigo-900"}`}>
            {module.title} - Quiz
          </h2>
          <div className={`flex items-center px-3 py-1 rounded-full font-semibold ${isDarkMode ? "bg-indigo-100 text-indigo-700" : "bg-indigo-700 text-white"}`}>
            <Clock className="mr-2" size={18} />
            {Math.floor(timeLeft / 60)}:{("0" + (timeLeft % 60)).slice(-2)}
          </div>
        </div>

        {/* Question */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestionIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.4 }}
          >
            <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? "text-gray-800" : "text-gray-900"}`}>
              {currentQuestionIndex + 1}. {currentQuestion.question}
            </h3>

            <div className="grid gap-3">
              {currentQuestion.options.map((option, index) => {
                const isSelected =
                  selectedAnswers[currentQuestionIndex] === index;
                return (
                  <label
                    key={index}
                    className={`flex items-center gap-3 border rounded-xl p-3 cursor-pointer transition-all ${isDarkMode
                        ? isSelected
                          ? "border-indigo-600 bg-indigo-50"
                          : "border-gray-300 hover:bg-gray-50"
                        : isSelected
                          ? "border-indigo-900 bg-indigo-100"
                          : "border-gray-400 hover:bg-gray-200"
                    }`}
                  >
                    <input
                      type="radio"
                      name={`q${currentQuestionIndex}`}
                      checked={isSelected}
                      onChange={() =>
                        handleAnswerSelect(currentQuestionIndex, index)
                      }
                      className={`${isDarkMode ? "accent-indigo-600" : "accent-indigo-900"}`}
                    />
                    <span>{option}</span>
                  </label>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Footer Buttons */}
        <div className="flex justify-between mt-8">
          {currentQuestionIndex > 0 ? (
            <button
              onClick={() => setCurrentQuestionIndex((prev) => prev - 1)}
              className={`flex items-center gap-2 px-5 py-2 rounded-full font-medium transition ${isDarkMode ? "bg-gray-200 text-gray-700 hover:bg-gray-300" : "bg-gray-700 text-white hover:bg-gray-800"}`}
            >
              <ArrowLeft size={18} /> Previous
            </button>
          ) : (
            <div />
          )}

          {currentQuestionIndex < quiz.questions.length - 1 ? (
            <button
              onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
              className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2 rounded-full font-medium hover:bg-indigo-700 transition"
            >
              Next <ArrowRight size={18} />
            </button>
          ) : (
            <button
              onClick={() => setShowConfirmModal(true)}
              className="flex items-center gap-2 bg-green-600 text-white px-5 py-2 rounded-full font-medium hover:bg-green-700 transition"
            >
              Submit <Send size={18} />
            </button>
          )}
        </div>
      </motion.div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showConfirmModal && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className={`rounded-2xl p-8 shadow-xl max-w-sm w-full text-center ${isDarkMode ? "bg-white" : "bg-white"}`}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <XCircle className={`mx-auto mb-3 ${isDarkMode ? "text-indigo-600" : "text-indigo-900"}`} size={48} />
              <h3 className={`text-xl font-bold mb-2 ${isDarkMode ? "text-gray-800" : "text-gray-900"}`}>
                Submit Quiz?
              </h3>
              <p className={`mb-6 ${isDarkMode ? "text-gray-600" : "text-gray-700"}`}>
                Are you sure you want to submit your answers? You can’t change them later.
              </p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className={`px-5 py-2 rounded-full font-medium transition ${isDarkMode ? "bg-gray-200 text-gray-700 hover:bg-gray-300" : "bg-gray-700 text-white hover:bg-gray-800"}`}
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowConfirmModal(false);
                    handleFinalSubmit();
                  }}
                  className="px-5 py-2 rounded-full bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition"
                >
                  Yes, Submit
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Quiz;
