import React, { useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react"; // you can change icon
import { useTheme } from "../contexts/ThemeContext";

const NoticeTicker = ({ notices, speed = 1.8 }) => {
    const { isDarkMode } = useTheme();
    const tickerRef = useRef(null);
    const containerRef = useRef(null);
    const animationRef = useRef(null);
    const posXRef = useRef(0);
    const isPaused = useRef(false);

    useEffect(() => {
        const ticker = tickerRef.current;
        const container = containerRef.current;
        if (!ticker) return;

        const totalWidth = ticker.scrollWidth;

        const step = () => {
            if (!isPaused.current) {
                posXRef.current -= speed;
                if (Math.abs(posXRef.current) >= totalWidth / 2) {
                    posXRef.current = 0;
                }
                ticker.style.transform = `translateX(${posXRef.current}px)`;
            }
            animationRef.current = requestAnimationFrame(step);
        };

        animationRef.current = requestAnimationFrame(step);
        return () => cancelAnimationFrame(animationRef.current);
    }, [speed]);

    const handleMouseEnter = () => (isPaused.current = true);
    const handleMouseLeave = () => (isPaused.current = false);

    const noticeArray = Array.isArray(notices)
        ? notices
        : notices.notices || [];

    return (
        <div
            ref={containerRef}
            className={`w-full flex items-center px-4 py-1 md:py-2 ${isDarkMode ? "bg-gradient-to-r from-slate-900 via-indigo-900 to-black" : "bg-[#fe588]"}`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {/* Fixed left panel */}{" "}
            <div className={`flex-shrink-0 flex items-center px-4 py-2 mr-4 shadow-lg border ${isDarkMode ? "bg-slate-800/70 border-white/10" : "bg-white border-gray-300"}`}>
                {" "}
                <span className={`font-semibold text-lg ${isDarkMode ? "text-white" : "text-black"}`}>
                    📢 Notices
                </span>{" "}
            </div>
            {/* Scrolling ticker */}
            <div className="flex-1 overflow-hidden">
                <div
                    ref={tickerRef}
                    className="flex whitespace-nowrap"
                    style={{ display: "inline-flex" }}
                >
                    {[...noticeArray, ...noticeArray].map((notice, idx) => (
                        <Link
                            key={idx}
                            to={`/notice/${notice.id}`}
                            className={`hover:text-emerald-400 transition-colors px-8 font-medium text-lg flex-shrink-0 ${isDarkMode ? "text-gray-200" : "text-gray-800"}`}
                        >
                             {notice.title}
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default NoticeTicker;

