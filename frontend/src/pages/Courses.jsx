import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import courses from "../data/courses.json";
import categories from "../data/CourseCategories.json";
import sectionTexts from "../data/course_list_top_section_texts.json";
import trendingCourseIds from "../data/trending_courses.json";
import notices from "../data/notices.json";
import upcomingCoursesData from "../data/upcoming_courses.json";
import liveClassData from "../data/live_class.json";
import websiteComments from "../data/website_comments.json";
import { motion, AnimatePresence } from "framer-motion";
import CourseCard from "../components/CourseCard";
import "../styles/fonts.css";
import NoticeTicker from "../components/NoticeTicker";
import { useTheme } from "../contexts/ThemeContext";

const Courses = () => {
    const { isDarkMode } = useTheme();
    const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
    const [currentTextIndex, setCurrentTextIndex] = useState(0);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [currentNoticeIndex, setCurrentNoticeIndex] = useState(0);
    const [newlyAddedIndex, setNewlyAddedIndex] = useState(0);
    const [currentUpcomingCourseIndex, setCurrentUpcomingCourseIndex] =
        useState(0);
    const [currentLiveClassNoticeIndex, setCurrentLiveClassNoticeIndex] =
        useState(0);
    const [currentCommentIndex, setCurrentCommentIndex] = useState(0);

    const newlyAddedCourses = [...courses.courses].sort(
        (a, b) => new Date(b.date) - new Date(a.date)
    );

    const upcomingCourses = upcomingCoursesData.upcoming_courses;
    const liveClasses = liveClassData.live_classes;

    useEffect(() => {
        const newlyAddedInterval = setInterval(() => {
            setNewlyAddedIndex(
                (prev) => (prev + 1) % (newlyAddedCourses.length - 3)
            );
        }, 5000);
        return () => clearInterval(newlyAddedInterval);
    }, [newlyAddedCourses.length]);

    useEffect(() => {
        const catInterval = setInterval(() => {
            setCurrentCategoryIndex((prev) => (prev + 1) % categories.length);
        }, 4000);
        return () => clearInterval(catInterval);
    }, []);

    const categoryImageBaseUrl = "/assets/images/category_list/";
    useEffect(() => {
        categories.forEach((cat) => {
            const img = new Image();
            img.src = `${categoryImageBaseUrl}${cat}.png`;
        });
    }, []);

    useEffect(() => {
        const txtInterval = setInterval(() => {
            setCurrentTextIndex((prev) => (prev + 1) % sectionTexts.length);
        }, 5000);
        return () => clearInterval(txtInterval);
    }, []);

    useEffect(() => {
        const noticeInterval = setInterval(() => {
            setCurrentNoticeIndex(
                (prev) => (prev + 4) % notices.notices.length
            );
        }, 10000);
        return () => clearInterval(noticeInterval);
    }, []);

    useEffect(() => {
        const upcomingCourseInterval = setInterval(() => {
            setCurrentUpcomingCourseIndex(
                (prev) => (prev + 1) % upcomingCourses.length
            );
        }, 4000);
        return () => clearInterval(upcomingCourseInterval);
    }, [upcomingCourses.length]);

    useEffect(() => {
        const liveClassInterval = setInterval(() => {
            setCurrentLiveClassNoticeIndex(
                (prev) => (prev + 4) % liveClasses.length
            );
        }, 4000);
        return () => clearInterval(liveClassInterval);
    }, [liveClasses.length]);

    useEffect(() => {
        const commentInterval = setInterval(() => {
            setCurrentCommentIndex(
                (prev) => (prev + 1) % websiteComments.comments.length
            );
        }, 4000);
        return () => clearInterval(commentInterval);
    }, []);

    const trendingCourses = courses.courses.filter((course) =>
        trendingCourseIds.includes(course.id)
    );

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % trendingCourses.length);
        }, 4000);
        return () => clearInterval(interval);
    }, [trendingCourses.length]);

    const currentCategoryName = categories[currentCategoryIndex];
    const currentSectionText = sectionTexts[currentTextIndex];

    const getVisibleCourses = () => {
        const prev =
            (currentIndex - 1 + trendingCourses.length) %
            trendingCourses.length;
        const next = (currentIndex + 1) % trendingCourses.length;
        return [
            trendingCourses[prev],
            trendingCourses[currentIndex],
            trendingCourses[next],
        ];
    };

    const visibleCourses = getVisibleCourses();
    const visibleNotices = [...notices.notices]
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(currentNoticeIndex, currentNoticeIndex + 4);

    return (
        <div
            className="w-full overflow-hidden"
            style={{
                backgroundColor: !isDarkMode ? "#fe588" : "",
            }}
        >
            {/* ---------------- HERO SECTION ---------------- */}
            <section className="relative w-full min-h-[500px] pb-16 md:h-[600px] pt-28 md:pt-32 overflow-hidden">
                {/* Preloaded and fading background */}
                <motion.div
                    key={currentCategoryName}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1 }}
                    className="absolute inset-0 bg-center bg-cover"
                    style={{
                        backgroundImage: `url(${categoryImageBaseUrl}${currentCategoryName}.png)`,
                    }}
                />

                {/* Dark overlay */}
                <div className="absolute inset-0 bg-black/70 z-10"></div>

                <div className="relative z-20 container mx-auto px-6 py-12 md:py-24 flex flex-col md:flex-row items-center justify-between h-full gap-12">
                    {/* Left text */}
                    <div className="flex-1 text-center md:text-left">
                        <AnimatePresence mode="wait">
                            <motion.h1
                                key={currentSectionText}
                                initial={{ opacity: 0, x: -40 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 40 }}
                                transition={{ duration: 0.7 }}
                                className="text-4xl md:text-6xl font-extrabold text-white mb-4 drop-shadow-lg font-graduate"
                            >
                                {currentSectionText}
                            </motion.h1>
                        </AnimatePresence>

                        <AnimatePresence mode="wait">
                            <motion.p
                                key={currentCategoryName}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.6 }}
                                className="text-xl text-indigo-200 mb-6"
                            >
                                {currentCategoryName}
                            </motion.p>
                        </AnimatePresence>

                        <Link
                            to={`/courses/category/${currentCategoryName.toLowerCase()}`}
                            className="inline-block px-8 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-full shadow-lg transition-transform hover:scale-105"
                        >
                            Explore {currentCategoryName}
                        </Link>
                    </div>

                    {/* Right image */}
                    <div className="flex-1 flex justify-center md:justify-end">
                        <motion.img
                            key={currentCategoryName + "-image"}
                            src={`${categoryImageBaseUrl}${currentCategoryName}.png`}
                            alt={currentCategoryName}
                            initial={{ opacity: 0, x: 100, scale: 0.95 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, x: -100, scale: 0.95 }}
                            transition={{ duration: 0.8 }}
                            className="max-h-[450px] md:max-h-[500px] w-auto object-contain rounded-2xl shadow-2xl border border-white/10"
                        />
                    </div>
                </div>
            </section>
            {/* ---------------- NOTICE PANEL (News Ticker) ---------------- */}
            <NoticeTicker notices={notices.notices} speed={1.8} />{" "}
            {/* ---------------- TRENDING COURSES ---------------- */}
            <section
                className={`relative py-20 overflow-hidden ${!isDarkMode ? "bg-gray-100" : "bg-gradient-to-br from-slate-900 via-indigo-900 to-black"}`}>
                <div className="container mx-auto px-6 relative z-10">
                    <h2
                        className={`text-4xl font-extrabold text-center mb-14 ${!isDarkMode ? "text-gray-900" : "text-white"}`}>
                        🔥 Trending{" "}
                        <span className="text-emerald-400">Courses</span>
                    </h2>

                    <div className="relative flex items-center justify-center h-[420px]">
                        {visibleCourses.map((course, idx) => {
                            const positions = [
                                { x: "-50%", scale: 0.8, opacity: 0.6, z: 5 },
                                { x: "0%", scale: 1, opacity: 1, z: 10 },
                                { x: "50%", scale: 0.8, opacity: 0.6, z: 5 },
                            ];
                            const { x, scale, opacity, z } = positions[idx];

                            const isSelected = idx === 1; // center card
                            const glowClass = isSelected
                                ? "shadow-[0_0_30px_rgba(72,239,120,0.6)] hover:shadow-[0_0_50px_rgba(72,239,120,0.9)]"
                                : "shadow-2xl hover:shadow-blue-600/40";

                            return (
                                <motion.div
                                    key={course.id}
                                    initial={{ opacity: 0 }}
                                    animate={{ x, scale, opacity, zIndex: z }}
                                    transition={{
                                        type: "spring",
                                        stiffness: 80,
                                        damping: 20,
                                        duration: 0.9,
                                    }}
                                    className="absolute w-72 md:w-80 lg:w-96"
                                >
                                    <div
                                        className={`bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 transition-transform duration-300 ${glowClass}`}
                                    >
                                        <CourseCard course={course} />
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>
            {/* ---------------- NEWLY ADDED COURSES ---------------- */}
            <section
                className={`relative py-28 overflow-hidden ${!isDarkMode ? "bg-gray-200" : "bg-gradient-to-br from-[#120321] via-[#24063c] to-[#4b0a61]"}`}>
                <div className="container mx-auto px-4 sm:px-8 relative z-10">
                    <h2
                        className={`text-3xl md:text-5xl font-extrabold text-center mb-16 drop-shadow-lg ${!isDarkMode ? "text-gray-900" : "text-white"}`}>
                        ✨ Newly Added{" "}
                        <span className="text-emerald-400">Courses</span>
                    </h2>

                    <div className="relative h-[28rem] sm:h-[32rem]">
                        <AnimatePresence
                            initial={false}
                            custom={newlyAddedIndex}
                        >
                            <motion.div
                                key={newlyAddedIndex}
                                className="absolute inset-0 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 px-4"
                                initial={{ opacity: 0, scale: 0.98, y: 30 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.98, y: -30 }}
                                transition={{
                                    duration: 0.6,
                                    ease: "easeInOut",
                                }}
                            >
                                {newlyAddedCourses
                                    .slice(newlyAddedIndex, newlyAddedIndex + 3)
                                    .map((course) => (
                                        <motion.div
                                            key={course.id}
                                            whileHover={{ scale: 1.05, y: -6 }}
                                            className="transition-all"
                                        >
                                            <div className="bg-gradient-to-br from-purple-800/60 via-indigo-800/50 to-pink-700/40 backdrop-blur-md rounded-3xl shadow-2xl border border-white/10 p-4 hover:shadow-[0_0_35px_rgba(72,239,120,0.5)] transition-shadow duration-300">
                                                <CourseCard course={course} />
                                            </div>
                                        </motion.div>
                                    ))}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </section>
            {/* ---------------- UPCOMING COURSES & LIVE CLASSES ---------------- */}
            <section
            className={`relative py-24 overflow-hidden ${
                !isDarkMode
                ? "bg-gray-100"
                : "bg-gradient-to-br from-[#0a1a2f] via-[#1e2140] to-[#331a4d]"
            }`}
            >
            <div className="container mx-auto px-4 sm:px-8 relative z-10">
                <h2
                className={`text-3xl md:text-5xl font-extrabold text-center mb-16 drop-shadow-lg ${!isDarkMode ? "text-gray-900" : "text-white"}`}
                >
                📅 Upcoming{" "}
                <span className="text-emerald-400">Courses & Live Classes</span>
                </h2>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* LEFT — UPCOMING COURSES */}
                <div
                    className={`relative overflow-hidden backdrop-blur-md border rounded-3xl shadow-2xl h-auto min-h-[400px] md:min-h-[520px] ${!isDarkMode
                        ? "bg-white border-gray-200 text-gray-900"
                        : "bg-gradient-to-br from-slate-800/50 via-indigo-900/40 to-purple-900/30 border-white/10"
                    }`}
                >
                    <h3
                    className={`text-2xl font-bold p-6 pb-2 flex items-center gap-2 ${
                        !isDarkMode ? "text-gray-900" : "text-white"
                    }`}
                    >
                    <i className="fa-solid fa-calendar-alt text-emerald-400"></i>{" "}
                    Upcoming Courses
                    </h3>

                    <div className="absolute inset-x-0 top-[4.5rem] bottom-0 overflow-hidden">
                    <motion.div
                        animate={{ y: ["0%", "-50%"] }}
                        transition={{
                        duration: 45, // ⬅️ slower scroll speed
                        ease: "linear",
                        repeat: Infinity,
                        }}
                        className="flex flex-col gap-4 py-6"
                    >
                        {[...upcomingCourses, ...upcomingCourses].map((course, i) => (
                        <div
                            key={i}
                            className={`mx-6 flex flex-col sm:flex-row sm:items-center justify-between rounded-xl p-4 transition-all border ${
                            !isDarkMode
                                ? "bg-gray-100 hover:bg-gray-200 border-gray-200"
                                : "bg-white/10 hover:bg-white/20 border-white/10"
                            }`}
                        >
                            <h4
                            className={`text-lg font-semibold ${
                                !isDarkMode ? "text-gray-900" : "text-white"
                            }`}
                            >
                            {course.title} by {course.author}
                            </h4>
                        </div>
                        ))}
                    </motion.div>
                    </div>
                </div>

                {/* RIGHT — LIVE CLASS UPDATES */}
                <div
                    className={`relative overflow-hidden backdrop-blur-md border rounded-3xl shadow-2xl h-auto min-h-[400px] md:min-h-[520px] ${!isDarkMode
                        ? "bg-white border-gray-200 text-gray-900"
                        : "bg-gradient-to-br from-slate-800/50 via-indigo-900/40 to-purple-900/30 border-white/10"
                    }`}
                >
                    <h3
                    className={`text-2xl font-bold p-6 pb-2 flex items-center gap-2 ${
                        !isDarkMode ? "text-gray-900" : "text-white"
                    }`}
                    >
                    <i className="fa-solid fa-video text-emerald-400"></i>{" "}
                    Live Class Updates
                    </h3>

                    <div className="absolute inset-x-0 top-[4.5rem] bottom-0 overflow-hidden">
                    <motion.div
                        animate={{ y: ["0%", "-50%"] }}
                        transition={{
                        duration: 45, // ⬅️ slower scroll speed
                        ease: "linear",
                        repeat: Infinity,
                        }}
                        className="flex flex-col gap-4 py-6"
                    >
                        {[...liveClasses, ...liveClasses].map((cls, i) => (
                        <div
                            key={i}
                            className={`mx-6 flex flex-col sm:flex-row sm:items-center justify-between rounded-xl p-4 transition-all border ${
                            !isDarkMode
                                ? "bg-gray-100 hover:bg-gray-200 border-gray-200"
                                : "bg-white/10 hover:bg-white/20 border-white/10"
                            }`}
                        >
                            <div>
                            <h4
                                className={`text-lg font-semibold ${
                                !isDarkMode ? "text-gray-900" : "text-white"
                                }`}
                            >
                                {cls.title}
                            </h4>
                            <p
                                className={`text-sm ${
                                !isDarkMode ? "text-gray-700" : "text-gray-300"
                                }`}
                            >
                                {cls.content}
                            </p>
                            </div>
                            <Link
                            to={cls.link}
                            className="mt-2 sm:mt-0 inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-sm font-bold rounded-full shadow-md transition-transform hover:scale-105"
                            >
                            <i className="fa-solid fa-play"></i> Join Now
                            </Link>
                        </div>
                        ))}
                    </motion.div>
                    </div>
                </div>
                </div>
            </div>
            </section>
            {/* ---------------- EXPLORE COURSES ---------------- */}{" "}
            <section
                className={`relative py-20 overflow-hidden ${!isDarkMode ? "bg-gray-200" : "bg-gradient-to-r from-slate-900 via-indigo-900 to-black"}`}>
                <div
                    className={`absolute inset-0 animate-gradient-x bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 opacity-20 mix-blend-overlay ${!isDarkMode ? "hidden" : ""}`}></div>

                <div className="container mx-auto px-6 relative z-10">
                    <h1
                        className={`text-4xl font-extrabold text-center mb-12 drop-shadow-lg ${!isDarkMode ? "text-gray-900" : "text-gray-100"}`}>
                        Explore Our{" "}
                        <span className="text-emerald-400">Courses</span>
                    </h1>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                        {courses.courses.map((course) => (
                            <motion.div
                                key={course.id}
                                whileHover={{ scale: 1.03, y: -5 }}
                                className="transition-all"
                            >
                                <div className="bg-slate-800/70 backdrop-blur-md rounded-2xl shadow-2xl border border-white/10 p-2 hover:shadow-[0_0_25px_rgba(72,239,120,0.5)] transition-shadow duration-300">
                                    <CourseCard course={course} />
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
            {/* ---------------- WHAT OUR USERS SAY ---------------- */}
            <section
                className={`relative py-20 overflow-hidden ${!isDarkMode ? "bg-gray-100" : "bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900"}`}>
                <div className="container mx-auto px-6 relative z-10">
                    <h3
                        className={`text-3xl md:text-4xl font-extrabold text-center mb-12 drop-shadow-lg ${!isDarkMode ? "text-gray-900" : "text-white"}`}>
                        💬 What Our Users Say
                    </h3>
                    <div className="relative h-auto min-h-[12rem]">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentCommentIndex}
                                initial={{ opacity: 0, y: 50, scale: 0.8 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -50, scale: 0.8 }}
                                transition={{
                                    duration: 0.8,
                                    ease: "easeInOut",
                                }}
                                className="absolute w-full h-full flex flex-col justify-center items-center text-center"
                            >
                                <p
                                    className={`text-xl md:text-2xl italic ${!isDarkMode ? "text-gray-800" : "text-white"}`}>
                                    "
                                    {
                                        websiteComments.comments[
                                            currentCommentIndex
                                        ].comment
                                    }
                                    "
                                </p>
                                <p className="text-lg text-emerald-400 font-semibold mt-4">
                                    -{" "}
                                    {
                                        websiteComments.comments[
                                            currentCommentIndex
                                        ].name
                                    }
                                </p>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Courses;
