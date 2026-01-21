import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, FileText, Video, UploadCloud } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar as fasFaStar } from "@fortawesome/free-solid-svg-icons";
import { faStar as farFaStar } from "@fortawesome/free-regular-svg-icons";
import courses from "../data/courses.json";
import progress from "../data/progress_bar.json";
import courseComments from "../data/course_comments.json";
import users from "../data/users.json";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";

const CourseDetail = () => {
  const { courseId } = useParams();
  const { user } = useAuth();
  const { isDarkMode } = useTheme();
  const [openModule, setOpenModule] = useState(null);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [newComment, setNewComment] = useState("");
  const [commentsList, setCommentsList] = useState(
    courseComments.comments.filter((c) => c.courseId === courseId)
  );

  const course = courses.courses.find((c) => c.id === courseId);
  const userProgress = progress.progress.find(
    (p) => p.courseId === courseId && p.userId === "user-1"
  );

  if (!course) return <LoadingSpinner />;

  const toggleModule = (moduleId) =>
    setOpenModule(openModule === moduleId ? null : moduleId);

  const handleRating = (value) => setRating(value);

  const handleAddComment = () => {
    if (newComment.trim() === "") return;
    const newEntry = {
      id: Date.now(),
      courseId,
      userId: user?.id || "guest",
      comment: newComment,
      rating: rating,
      time: "Just now",
    };
    setCommentsList([newEntry, ...commentsList]);
    setNewComment("");
    setRating(0);
  };

  const getUserName = (userId) => {
    const student = users.students.find((s) => s.id === userId);
    if (student) return student.name;
    const teacher = users.teachers.find((t) => t.id === userId);
    if (teacher) return teacher.name;
    return "Anonymous";
  };

  return (
    <div className={`relative min-h-screen pt-28 pb-20 overflow-hidden ${isDarkMode ? "bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-800 text-gray-200" : "bg-[#fe588] text-black"}`}>
      {/* Glowing Backgrounds */}
      <div className="absolute top-[-100px] right-[-120px] w-96 h-96 bg-indigo-500/30 blur-3xl rounded-full animate-pulse"></div>
      <div className="absolute bottom-[-120px] left-[-100px] w-[400px] h-[400px] bg-emerald-500/20 blur-3xl rounded-full animate-pulse"></div>

      {/* Container */}
      <div className="relative container mx-auto px-4 z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative mb-14"
        >
          <div className="relative h-80 w-full rounded-3xl overflow-hidden shadow-2xl border border-slate-700/50">
            <img
              src={course.image}
              alt={course.title}
              className="w-full h-full object-cover opacity-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
            <div className="absolute bottom-6 left-6 text-white">
              <h1 className="text-4xl md:text-5xl font-bold drop-shadow-lg">
                {course.title}
              </h1>
              <p className="text-sm opacity-90">By {course.author}</p>
            </div>
          </div>
          <p className={`mt-6 text-lg md:text-xl leading-relaxed max-w-3xl ${isDarkMode ? "text-gray-300" : "text-gray-800"}`}>
            {course.description}
          </p>
        </motion.div>

        {/* Progress */}
        {userProgress && (
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-emerald-400 mb-2">
              Your Progress
            </h3>
            <div className={`rounded-full h-5 overflow-hidden border ${isDarkMode ? "bg-slate-800 border-slate-700" : "bg-gray-200 border-gray-300"}`}>
              <motion.div
                className="h-5 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400"
                initial={{ width: 0 }}
                animate={{ width: `${userProgress.progress}%` }}
                transition={{ duration: 1, ease: "easeInOut" }}
              />
            </div>
            <p className={`text-right text-sm mt-1 ${isDarkMode ? "text-gray-400" : "text-gray-700"}`}>
              {userProgress.progress}% Complete
            </p>
          </div>
        )}

        {/* Course Modules */}
        <motion.h2
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className={`text-3xl font-bold mb-8 border-l-4 pl-3 ${isDarkMode ? "text-indigo-300 border-indigo-600" : "text-indigo-700 border-indigo-900"}`}
        >
          Course Modules
        </motion.h2>

        <div className="space-y-6">
          {course.modules.map((module) => (
            <motion.div
              key={module.id}
              layout
              className={`backdrop-blur-md rounded-2xl shadow-lg border transition-all ${isDarkMode ? "bg-slate-800/70 border-slate-700 hover:border-emerald-500/40" : "bg-white border-gray-200 hover:border-emerald-500/40"}`}
            >
              <button
                className={`w-full text-left px-6 py-5 flex justify-between items-center font-semibold text-lg transition ${isDarkMode ? "text-gray-100 hover:bg-slate-700/50" : "text-gray-800 hover:bg-gray-100"}`}
                onClick={() => toggleModule(module.id)}
              >
                <span>{module.title}</span>
                {openModule === module.id ? (
                  <ChevronUp className="w-5 h-5 text-emerald-400" />
                ) : (
                  <ChevronDown className={`w-5 h-5 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`} />
                )}
              </button>

              <AnimatePresence>
                {openModule === module.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.4 }}
                    className={`px-6 py-6 border-t space-y-8 ${isDarkMode ? "bg-slate-900/60 border-slate-700" : "bg-gray-50 border-gray-200"}`}
                  >
                    {/* Resources */}
                    {module.resources?.length > 0 && (
                      <div>
                        <h3 className="text-xl font-semibold text-emerald-400 mb-4">
                          Resources
                        </h3>

                        {/* Video Resources */}
                        {module.resources
                          .filter((r) => r.type === "video")
                          .map((resource) => (
                            <motion.div
                              key={resource.id}
                              className={`mb-6 rounded-2xl overflow-hidden shadow-md border ${isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200"}`}
                            >
                              <div className={`flex items-center gap-2 px-4 py-3 border-b ${isDarkMode ? "bg-slate-900 border-slate-700" : "bg-gray-100 border-gray-200"}`}>
                                <Video className="text-emerald-400 w-5 h-5" />
                                <span className={`font-medium ${isDarkMode ? "text-gray-100" : "text-gray-800"}`}>
                                  {resource.title}{" "}
                                  <span className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                                    ({resource.points} pts)
                                  </span>
                                </span>
                              </div>
                              <div className="flex justify-center p-4">
                                <video controls className="rounded-b-2xl w-11/12">
                                  <source src={resource.src} type="video/mp4" />
                                </video>
                              </div>
                              <div className={`p-4 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                                {resource.description}
                              </div>
                            </motion.div>
                          ))}

                        {/* Non-video Resources */}
                        <div className="grid sm:grid-cols-2 gap-5">
                          {module.resources
                            .filter((r) => r.type !== "video")
                            .map((resource) => (
                              <motion.div
                                key={resource.id}
                                whileHover={{ scale: 1.02 }}
                                className={`p-5 rounded-2xl shadow-sm border transition ${isDarkMode ? "bg-slate-800 border-slate-700 hover:border-indigo-500/40" : "bg-white border-gray-200 hover:border-indigo-500/40"}`}
                              >
                                <div className="flex items-center space-x-2 mb-3">
                                  <FileText className="text-emerald-400 w-5 h-5" />
                                  <span className={`font-medium ${isDarkMode ? "text-gray-100" : "text-gray-800"}`}>
                                    {resource.title}{" "}
                                    <span className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                                      ({resource.type})
                                    </span>
                                  </span>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                                    {resource.points} pts
                                  </span>
                                  <a
                                    href={resource.src}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-indigo-400 font-medium hover:underline"
                                  >
                                    View
                                  </a>
                                </div>
                              </motion.div>
                            ))}
                        </div>
                      </div>
                    )}

                    {/* Assignment */}
                    {module.assignment && (
                      <motion.div
                        whileHover={{ scale: 1.01 }}
                        className={`p-5 rounded-2xl shadow-md border ${isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200"}`}
                      >
                        <div className="flex justify-between items-center">
                          <h3 className="text-2xl font-bold text-emerald-400 mb-3">
                            Assignment
                          </h3>
                          <p className={`text-sm mb-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                            Points: {module.assignment.points}
                          </p>
                        </div>
                        <p className={`mb-3 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                          {module.assignment.description}
                        </p>
                        <p className={`text-sm mb-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                          Deadline: {module.assignment.deadline}
                        </p>
                        {module.assignment.file && (
                          <div className="flex items-center justify-center w-full">
                            <label
                              htmlFor="file-upload"
                              className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition ${isDarkMode ? "border-slate-600 bg-slate-900 hover:bg-slate-800" : "border-gray-300 bg-gray-100 hover:bg-gray-200"}`}
                            >
                              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <UploadCloud className="w-10 h-10 mb-3 text-emerald-400" />
                                <p className={`mb-2 text-sm ${isDarkMode ? "text-gray-400" : "text-gray-700"}`}>
                                  <span className={`font-semibold ${isDarkMode ? "text-gray-300" : "text-gray-900"}`}>
                                    Click to upload
                                  </span>{" "}
                                  or drag and drop
                                </p>
                                <p className={`text-xs ${isDarkMode ? "text-gray-500" : "text-gray-600"}`}>
                                  ZIP, RAR, or other formats
                                </p>
                              </div>
                              <input id="file-upload" type="file" className="hidden" />
                            </label>
                          </div>
                        )}
                      </motion.div>
                    )}

                    {/* Quiz */}
                    {module.quiz && (
                      <motion.div
                        whileHover={{ scale: 1.01 }}
                        className={`p-5 rounded-2xl shadow-md border ${isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200"}`}
                      >
                        <h3 className="text-xl font-semibold text-indigo-300 mb-2">
                          Quiz
                        </h3>
                        <p className={`mb-1 ${isDarkMode ? "text-gray-400" : "text-gray-700"}`}>
                          Questions: {module.quiz.questions.length}
                        </p>
                        <p className={`mb-3 ${isDarkMode ? "text-gray-400" : "text-gray-700"}`}>
                          Total Points: {module.quiz.points}
                        </p>
                        <Link
                          to={`/courses/${courseId}/quiz/${module.id}`}
                          className="inline-block px-5 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-full hover:from-indigo-500 hover:to-purple-500 transition"
                        >
                          Start Quiz
                        </Link>
                      </motion.div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* Feedback Section */}
        <div className={`mt-16 backdrop-blur-md p-8 rounded-3xl shadow-xl border ${isDarkMode ? "bg-slate-800/80 border-slate-700" : "bg-white border-gray-200"}`}>
          <h3 className="text-2xl font-bold text-emerald-400 mb-4">
            Leave Your Feedback
          </h3>
          <div className="flex items-center space-x-2 mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <FontAwesomeIcon
                key={star}
                icon={star <= (hoverRating || rating) ? fasFaStar : farFaStar}
                className="text-yellow-400 text-2xl cursor-pointer transition-transform transform hover:scale-110"
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => handleRating(star)}
              />
            ))}
          </div>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Share your experience..."
            className={`w-full p-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-emerald-400 mb-4 ${isDarkMode ? "bg-slate-900 border-slate-700 text-gray-100" : "bg-gray-100 border-gray-300 text-gray-900"}`}
            rows={4}
          ></textarea>
          <button
            onClick={handleAddComment}
            className="px-6 py-2 bg-gradient-to-r from-emerald-500 to-indigo-600 text-white font-medium rounded-full hover:from-emerald-400 hover:to-indigo-500 transition"
          >
            Submit Feedback
          </button>
        </div>

        {/* Comments Section */}
        <div className="mt-12">
          <h3 className={`text-2xl font-bold mb-6 border-l-4 pl-3 ${isDarkMode ? "text-emerald-400 border-emerald-500" : "text-emerald-700 border-emerald-900"}`}>
            Student Comments
          </h3>
          <div className="space-y-5">
            {commentsList.length > 0 ? (
              commentsList.map((comment) => (
                <motion.div
                  key={comment.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-5 rounded-2xl shadow-sm border transition ${isDarkMode ? "bg-slate-800 border-slate-700 hover:border-emerald-500/40" : "bg-white border-gray-200 hover:border-emerald-500/40"}`}
                >
                  <div className="flex items-center mb-2">
                    <p className={`font-semibold ${isDarkMode ? "text-indigo-300" : "text-indigo-700"}`}>
                      {getUserName(comment.userId)}
                    </p>
                    <div className="flex items-center ml-auto">
                      {[...Array(comment.rating)].map((_, i) => (
                        <FontAwesomeIcon key={i} icon={fasFaStar} className="text-yellow-400" />
                      ))}
                      {[...Array(5 - comment.rating)].map((_, i) => (
                        <FontAwesomeIcon key={i} icon={farFaStar} className="text-gray-500" />
                      ))}
                    </div>
                  </div>
                  <p className={`mt-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>{comment.comment}</p>
                </motion.div>
              ))
            ) : (
              <p className={`text-gray-400 ${isDarkMode ? "text-gray-400" : "text-gray-700"}`}>No comments yet. Be the first!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
