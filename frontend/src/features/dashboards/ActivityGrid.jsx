import React from "react";
import { useTheme } from "../../contexts/ThemeContext";

const ActivityGrid = ({ activityData }) => {
    const { isDarkMode } = useTheme();
    const today = new Date("2025-11-02");
    const days = Array.from({ length: 366 }, (_, i) => {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        return date;
    }).reverse();

    const firstDay = days[0];
    const blanks = Array(firstDay.getDay()).fill(null);
    const allDays = [...blanks, ...days];

    const getColor = (level) => {
        switch (level) {
            case 1:
                return "bg-emerald-600";
            case 2:
                return "bg-emerald-500";
            case 3:
                return "bg-emerald-400";
            case 4:
                return "bg-emerald-300";
            default:
                return isDarkMode ? "bg-slate-700" : "bg-gray-300";
        }
    };

    const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    return (
        <div className={`p-6 rounded-xl shadow-lg border ${isDarkMode ? "bg-slate-800/70 backdrop-blur-md border-emerald-400/30 hover:shadow-emerald-400/20" : "bg-white border-gray-200 hover:shadow-gray-300/20"}`}>
            {" "}
            <div className="flex items-center justify-between mb-4">
                {" "}
                <h2 className={`text-2xl font-bold ${isDarkMode ? "text-emerald-300" : "text-emerald-600"}`}>
                    Activity Grid
                </h2>{" "}
                <span className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>Past 12 months</span>{" "}
            </div>
            <div className="overflow-x-auto pb-2">
                <div className="grid grid-cols-[auto_1fr] gap-1">
                    {/* Empty corner for alignment */}
                    <div></div>

                    {/* Month Labels */}
                    <div className="flex justify-around text-xs mb-1">
                        {monthNames.map((month, index) => {
                            // Calculate if this month should be displayed based on the days array
                            // This is a simplified approach, a more accurate one would involve checking the actual dates in allDays
                            if (index % 2 === 0) { // Display every other month for brevity
                                return <span key={month} className="font-semibold">{month}</span>;
                            }
                            return <span key={month}></span>;
                        })}
                    </div>

                    {/* Day Labels and Activity Squares */}
                    <div className="grid grid-rows-7 gap-[3px]">
                        {dayNames.map((day, index) => (
                            <div key={day} className="text-xs text-right pr-1 font-semibold">
                                {index % 2 === 0 ? day : ""} {/* Display every other day for brevity */}
                            </div>
                        ))}
                    </div>

                    {/* Activity Squares */}
                    <div className="grid grid-rows-7 grid-flow-col gap-[3px]">
                        {allDays.map((day, i) => {
                            if (!day)
                                return (
                                    <div
                                        key={`blank-${i}`}
                                        className="w-4 h-4 rounded-sm bg-transparent"
                                    ></div>
                                );

                            const dateString = day.toISOString().split("T")[0];
                            const level = activityData[dateString] || 0;
                            const color = getColor(level);

                            return (
                                <div
                                    key={dateString}
                                    title={`${dateString} — Activity Level: ${level}`}
                                    className={`w-4 h-4 rounded-sm ${color} hover:scale-110 hover:brightness-125 transition-transform duration-200 cursor-pointer`}
                                ></div>
                            );
                        })}
                    </div>
                </div>
            </div>
            {/* Legend */}
            <div className={`flex items-center justify-end gap-2 mt-4 text-xs ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                <span>Less</span>
                {[0, 1, 2, 3, 4].map((level) => (
                    <div
                        key={level}
                        className={`w-4 h-4 rounded-sm ${getColor(
                            level
                        )} ${isDarkMode ? "border border-slate-600" : "border border-gray-400"}`}
                    ></div>
                ))}
                <span>More</span>
            </div>
        </div>
    );
};

export default ActivityGrid;
