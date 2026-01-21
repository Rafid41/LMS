import React from 'react';
import { useParams } from 'react-router-dom';
import CourseCard from '../components/CourseCard';
import courses from '../data/courses.json';
import { useTheme } from '../contexts/ThemeContext';

const CategoryCourses = () => {
  const { categoryName } = useParams();
  const { isDarkMode } = useTheme();
  const filteredCourses = courses.courses.filter(course =>
    course.category.map(c => c.toLowerCase()).includes(categoryName)
  );

  const formattedName =
    categoryName.charAt(0).toUpperCase() + categoryName.slice(1);

  return (
    <div className={`min-h-screen w-full pt-28 pb-12 ${isDarkMode ? "bg-gradient-to-br from-green-800 via-emerald-900 to-slate-900" : "bg-[#fe588]"}`}>
      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <h1 className={`text-4xl font-extrabold mb-10 ${isDarkMode ? "text-gray-100" : "text-gray-900"}`}>
          {formattedName} <span className="text-green-400">Courses</span>
        </h1>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCourses.length > 0 ? (
            filteredCourses.map((course) => (
              <div
                key={course.id}
                className="transform transition-all duration-300 hover:scale-105 hover:-translate-y-2"
              >
                <div className={`backdrop-blur-md rounded-2xl shadow-2xl border p-2 ${isDarkMode ? "bg-green-900/70 border-white/10" : "bg-white border-gray-200"}`}>
                  <CourseCard course={course} />
                </div>
              </div>
            ))
          ) : (
            <p className={`text-lg col-span-full ${isDarkMode ? "text-gray-200" : "text-gray-700"}`}>
              No courses found in this category.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryCourses;
