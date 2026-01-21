import React from "react";
import { useLocation, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle, XCircle, ArrowLeft, HelpCircle } from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";

const QuizReview = () => {
  const location = useLocation();
  const { score, total, selectedAnswers, questions } =
    location.state || { score: 0, total: 0, selectedAnswers: {}, questions: [] };
  const { isDarkMode } = useTheme();

  return (
    <div className={`min-h-screen flex items-center justify-center px-4 py-8 ${isDarkMode ? "bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500" : "bg-[#fe588]"}`}>
      <motion.div
        className={`shadow-2xl rounded-3xl p-10 max-w-4xl w-full ${isDarkMode ? "bg-white" : "bg-white"}`}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className={`text-3xl font-bold mb-2 ${isDarkMode ? "text-gray-800" : "text-gray-900"}`}>
            Quiz Review
          </h1>
          <p className={`text-gray-600 ${isDarkMode ? "text-gray-600" : "text-gray-700"}`}>
            You scored{" "}
            <span className={`font-semibold ${isDarkMode ? "text-indigo-600" : "text-indigo-900"}`}>
              {score} / {total}
            </span>
          </p>
        </div>

        {/* Questions Review */}
        <div className="space-y-6">
          {questions.map((q, index) => {
            const isCorrect = selectedAnswers[index] === q.answer;
            const userChoice = selectedAnswers[index];
            return (
              <motion.div
                key={index}
                className={`rounded-2xl p-6 border-2 transition ${
                  isCorrect
                    ? isDarkMode ? "border-green-300 bg-green-50" : "border-green-500 bg-green-100"
                    : isDarkMode ? "border-red-300 bg-red-50" : "border-red-500 bg-red-100"
                }`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-center mb-3">
                  {isCorrect ? (
                    <CheckCircle className="text-green-500 w-6 h-6 mr-2" />
                  ) : (
                    <XCircle className="text-red-500 w-6 h-6 mr-2" />
                  )}
                  <h3 className={`text-lg font-semibold ${isDarkMode ? "text-gray-800" : "text-gray-900"}`}>
                    Q{index + 1}: {q.question}
                  </h3>
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                  {q.options.map((option, i) => {
                    const isAnswer = i === q.answer;
                    const isUserAnswer = i === userChoice;
                    return (
                      <div
                        key={i}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${
                          isAnswer
                            ? "bg-green-100 border-green-400"
                            : isUserAnswer && !isAnswer
                            ? "bg-red-100 border-red-400"
                            : isDarkMode ? "bg-white border-gray-200" : "bg-gray-100 border-gray-300"
                        }`}
                      >
                        <HelpCircle
                          className={`w-4 h-4 ${
                            isAnswer
                              ? "text-green-600"
                              : isUserAnswer && !isAnswer
                              ? "text-red-600"
                              : "text-gray-400"
                          }`}
                        />
                        <span className={`text-gray-700 ${isDarkMode ? "text-gray-700" : "text-gray-800"}`}>{option}</span>
                      </div>
                    );
                  })}
                </div>

                {!isCorrect && (
                  <p className={`mt-3 text-sm ${isDarkMode ? "text-gray-500" : "text-gray-700"}`}>
                    ✅ Correct answer:{" "}
                    <span className="font-medium text-green-700">
                      {q.options[q.answer]}
                    </span>
                  </p>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="text-center mt-10">
          <Link
            to={`/courses/${location.state.courseId}`}
            className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-indigo-700 transition"
          >
            <ArrowLeft size={18} /> Back to Course
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default QuizReview;
