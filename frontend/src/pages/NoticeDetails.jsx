import React from "react";
import { useParams, Link } from "react-router-dom";
import notices from "../data/notices.json";
import { ArrowLeft } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";

const NoticeDetails = () => {
    const { noticeId } = useParams();
    const { isDarkMode } = useTheme();
    const notice = notices.notices.find((n) => n.id === parseInt(noticeId));

    if (!notice) {
        return (
            <div className={`min-h-screen w-full px-4 md:px-[8rem] pt-16 ${isDarkMode ? "bg-gradient-to-br from-emerald-800 via-teal-900 to-gray-900 text-white" : "bg-[#fe588] text-black"}`}>
                {" "}
                <h2 className="text-3xl font-extrabold mb-4 drop-shadow-lg text-center">
                    Notice Not Found
                </h2>{" "}
                <div className="text-center">
                    {" "}
                    <Link
                        to="/courses"
                        className="text-emerald-400 hover:underline font-semibold"
                    >
                        Go back to Courses{" "}
                    </Link>{" "}
                </div>{" "}
            </div>
        );
    }

    return (
        <div className={`min-h-screen w-full px-4 md:px-[8rem] pt-16 relative ${isDarkMode ? "bg-gradient-to-br from-emerald-800 via-teal-900 to-gray-900 text-white" : "bg-[#fe588] text-black"}`}>
            {" "}
            <div className="relative w-full">
                {" "}
                <h2 className={`text-3xl md:text-4xl font-extrabold mb-4 mt-10 drop-shadow-lg text-center ${isDarkMode ? "text-emerald-400" : "text-emerald-700"}`}>
                    {notice.title}{" "}
                </h2>{" "}
                <p className={`text-sm mb-6 italic text-center ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                    Published: {notice.date}
                </p>{" "}
                <p className={`leading-relaxed text-lg text-justify ${isDarkMode ? "text-gray-200" : "text-gray-800"}`}>
                    {notice.content}{" "}
                </p>
            </div>
        </div>
    );
};

export default NoticeDetails;
