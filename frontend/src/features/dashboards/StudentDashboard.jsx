import React from "react";
import { useAuth } from "../../contexts/AuthContext";
import dashboardData from "../../data/dashboard.json";
import studentActivityData from "../../data/student_activity.json";
import ActivityGrid from "./ActivityGrid";
import {
PieChart,
Pie,
Cell,
BarChart,
Bar,
XAxis,
YAxis,
CartesianGrid,
Tooltip,
Legend,
ResponsiveContainer,
} from "recharts";
import { FaStar, FaAward, FaChartPie, FaClipboardList } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useTheme } from "../../contexts/ThemeContext";

const COLORS = ["#00C9FF", "#00FFA3", "#FFD300", "#FF6B6B"];

export default function StudentDashboard() {
const { user } = useAuth();
const { isDarkMode } = useTheme();


if (!user) {  
    return (  
        <div className="text-center mt-10">  
            <p className="text-2xl font-bold mb-4">Please log in to view your dashboard.</p>  
            <Link to="/login" className="text-blue-600 hover:underline">Go to Login</Link>  
        </div>  
    );  
}  

const studentData = dashboardData[user.email];  

if (!studentData) {  
    return (  
        <div className="text-center mt-10 text-red-500 font-bold text-lg">No dashboard data found for this student.</div>  
    );  
}  

const courseProgressData = studentData.courses.map((course) => ({  
    name: course.title,  
    value: course.progress,  
}));  

const quizScoresData = studentData.courses.flatMap((course) =>  
    course.quiz_scores.map((quiz) => ({  
        name: `${course.title} - ${quiz.moduleId}`,  
        score: quiz.score,  
        total: quiz.total,  
    }))  
);  

return (  
    <div className={`min-h-screen w-full ${isDarkMode ? "bg-gradient-to-br from-slate-800 via-indigo-900 to-slate-700 text-gray-100" : "bg-[#fe588] text-black"}`}>  
        <div className="container mx-auto p-6">  
            {/* Dashboard Title */}  
            <h1 className={`text-4xl font-extrabold mb-8 drop-shadow-lg ${isDarkMode ? "text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300" : "text-black"}`}>  
                {studentData.name}'s Dashboard  
            </h1>  

            {/* Stats Cards */}  
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">  
                {/* Total Points */}  
                <div className={`p-6 rounded-2xl shadow-[0_0_30px_rgba(72,187,255,0.5)] hover:shadow-[0_0_50px_rgba(72,187,255,0.7)] transition duration-300 transform hover:-translate-y-1 border ${isDarkMode ? "bg-gradient-to-br from-blue-500/30 via-blue-400/25 to-indigo-500/25 backdrop-blur-md border-blue-300/30" : "bg-white border-gray-200"}`}>  
                    <div className="flex items-center justify-between">  
                        <h2 className={`text-xl font-bold flex items-center gap-2 ${isDarkMode ? "text-blue-100" : "text-black"}`}>  
                            <FaStar /> Total Points  
                        </h2>  
                        <p className={`text-3xl font-extrabold ${isDarkMode ? "text-blue-200" : "text-gray-800"}`}>{studentData.total_points}</p>  
                    </div>  
                </div>  

                {/* Badges */}  
                <div className={`p-6 rounded-2xl shadow-[0_0_30px_rgba(72,255,180,0.5)] hover:shadow-[0_0_50px_rgba(72,255,180,0.7)] transition duration-300 transform hover:-translate-y-1 border ${isDarkMode ? "bg-gradient-to-br from-green-400/30 via-emerald-400/25 to-emerald-500/25 backdrop-blur-md border-green-300/30" : "bg-white border-gray-200"}`}>  
                    <h2 className={`text-xl font-bold flex items-center gap-2 mb-2 ${isDarkMode ? "text-green-100" : "text-black"}`}>  
                        <FaAward /> Badges  
                    </h2>  
                    <div className="flex flex-wrap gap-2">  
                        {studentData.badges.map((badge, index) => (  
                            <span  
                                key={index}  
                                className={`text-xs font-semibold px-3 py-1 rounded-full border transform transition duration-200 shadow-[0_0_10px_rgba(72,255,180,0.5)] ${isDarkMode ? "bg-green-300/20 text-green-100 border-green-400/30" : "bg-green-100 text-green-800 border-green-300"}`}  
                            >  
                                {badge}  
                            </span>  
                        ))}  
                    </div>  
                </div>  
            </div>  

            {/* Charts */}  
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">  
                {/* Course Progress */}  
                <div className={`p-6 rounded-2xl shadow-[0_0_30px_rgba(0,201,255,0.5)] hover:shadow-[0_0_50px_rgba(0,201,255,0.7)] transition duration-300 transform hover:-translate-y-1 border ${isDarkMode ? "bg-gradient-to-br from-slate-700/50 via-indigo-800/40 to-slate-800/50 backdrop-blur-md border-blue-400/20" : "bg-white border-gray-200"}`}>  
                    <h2 className={`text-xl font-bold flex items-center gap-2 mb-4 ${isDarkMode ? "text-blue-200" : "text-black"}`}>  
                        <FaChartPie /> Course Progress  
                    </h2>  
                    <ResponsiveContainer width="100%" height={300}>  
                        <PieChart>  
                            <Pie  
                                data={courseProgressData}  
                                cx="50%"  
                                cy="50%"  
                                labelLine={false}  
                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}  
                                outerRadius={100}  
                                dataKey="value"  
                            >  
                                {courseProgressData.map((entry, index) => (  
                                    <Cell  
                                        key={`cell-${index}`}  
                                        fill={COLORS[index % COLORS.length]}  
                                        className="filter drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]"  
                                    />  
                                ))}  
                            </Pie>  
                            <Tooltip contentStyle={{ backgroundColor: isDarkMode ? '#333' : '#fff', borderColor: isDarkMode ? '#555' : '#ccc', color: isDarkMode ? '#fff' : '#000' }} />  
                        </PieChart>  
                    </ResponsiveContainer>  
                </div>  

                {/* Quiz Scores */}  
                <div className={`p-6 rounded-2xl shadow-[0_0_30px_rgba(0,255,163,0.5)] hover:shadow-[0_0_50px_rgba(0,255,163,0.7)] transition duration-300 transform hover:-translate-y-1 border ${isDarkMode ? "bg-gradient-to-br from-slate-700/50 via-indigo-800/40 to-slate-800/50 backdrop-blur-md border-green-400/20" : "bg-white border-gray-200"}`}>  
                    <h2 className={`text-xl font-bold flex items-center gap-2 mb-4 ${isDarkMode ? "text-green-200" : "text-black"}`}>  
                        <FaClipboardList /> Quiz Scores  
                    </h2>  
                    <ResponsiveContainer width="100%" height={300}>  
                        <BarChart data={quizScoresData}>  
                            <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? "#334155" : "#e0e0e0"} />  
                            <XAxis dataKey="name" tick={{ fontSize: 12, fill: isDarkMode ? "#cbd5e1" : "#333" }} />  
                            <YAxis tick={{ fill: isDarkMode ? "#cbd5e1" : "#333" }} />  
                            <Tooltip contentStyle={{ backgroundColor: isDarkMode ? '#333' : '#fff', borderColor: isDarkMode ? '#555' : '#ccc', color: isDarkMode ? '#fff' : '#000' }} />  
                            <Legend wrapperStyle={{ color: isDarkMode ? '#fff' : '#000' }} />  
                            <Bar dataKey="score" fill="#60a5fa" className="shadow-[0_0_8px_rgba(96,165,250,0.6)]" />  
                            <Bar dataKey="total" fill="#34d399" className="shadow-[0_0_8px_rgba(52,211,153,0.6)]" />  
                        </BarChart>  
                    </ResponsiveContainer>  
                </div>  
            </div>  

            {/* Activity Grid */}  
            <div className="lg:col-span-2">  
                <ActivityGrid activityData={studentActivityData["user-1"]} />  
            </div>  
        </div>  
    </div>  
);  


}
