import React from "react";
import { Link } from "react-router-dom";
import categories from "../data/CourseCategories.json";
import { useTheme } from "../contexts/ThemeContext";

const Categories = () => {
    const { isDarkMode } = useTheme();
    const buttonColor = "from-emerald-500 to-teal-500";

    return (
        <section className={`relative py-24 overflow-hidden ${isDarkMode ? "bg-gradient-to-br from-[#0a1324] via-[#0f1e36] to-[#162742]" : "bg-[#fe588]"}`}>
            {/* Decorative background lights */}
            <div className="absolute inset-0">
                <div className="absolute -top-20 -left-20 w-72 h-72 bg-emerald-500/20 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl"></div>
            </div>

            <div className="container mx-auto px-6 relative z-10">
                <h2 className={`text-4xl md:text-5xl font-extrabold text-center mb-14 ${isDarkMode ? "text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]" : "text-gray-900"}`}>
                    Browse by Category
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 w-full">
                    {categories.map((category, idx) => (
                        <Link
                            key={category}
                            to={`/courses/category/${category.toLowerCase()}`}
                            className="group w-full"
                        >
                            <div
                                className={`w-full text-white font-bold text-center py-6 text-lg rounded-2xl shadow-lg border transition-all duration-300 ease-out
                hover:shadow-[0_0_25px_rgba(16,185,129,0.5)] hover:scale-105 ${isDarkMode ? `bg-gradient-to-r ${buttonColor} border-emerald-400/20 hover:border-emerald-400/40` : "bg-gradient-to-r from-[#3d348b] to-[#7678ed] border-[#3d348b] hover:border-[#7678ed]"}`}
                            >
                                <div className="flex items-center justify-center gap-3">
                                    <i className={`fa-solid fa-layer-group ${isDarkMode ? "text-white/90" : "text-white"} group-hover:rotate-6 transition-transform duration-300`}></i>
                                    {category}
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Categories;
