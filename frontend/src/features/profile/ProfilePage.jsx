import React, { useState, useEffect } from "react";
import CommonProfileForm from "./CommonProfileForm";
import InstructorProfileForm from "./InstructorProfileForm";
import LearnerProfileForm from "./LearnerProfileForm";
import { getProfile } from "../../services/profileService";
import { useTheme } from "../../contexts/ThemeContext";
import { User, BookOpen, Shield } from "lucide-react";

const ProfilePage = () => {
    const { isDarkMode } = useTheme();
    const [profileData, setProfileData] = useState(null);
    const [learnerData, setLearnerData] = useState(null);
    const [instructorData, setInstructorData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("common"); // 'common', 'learner', 'instructor'

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const data = await getProfile();
            // Data structure: { common_profile: {...}, learner_profile: {...}, instructor_profile: {...}, role: '...' }
            setProfileData(data.common_profile);
            setLearnerData(data.learner_profile);
            setInstructorData(data.instructor_profile);
        } catch (error) {
            console.error("Failed to load profile", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
         return (
            <div className={`min-h-screen pt-24 p-8 flex justify-center items-center ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
            </div>
        );
    }
    
    // Determine Role (assuming it's available in common profile or parent data)
    const role = profileData?.role || 'student'; 

    return (
        <div className={`min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300 ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold">Profile Settings</h1>
                    <p className={`mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Manage your account settings and preferences.
                    </p>
                </div>

                {/* Tabs */}
                <div className="flex space-x-1 mb-8 bg-gray-200/50 dark:bg-gray-800/50 p-1 rounded-xl w-fit">
                    <button
                        onClick={() => setActiveTab("common")}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
                            activeTab === "common" 
                            ? 'bg-white text-indigo-700 shadow-md ring-1 ring-black/5 dark:bg-gray-700 dark:text-indigo-400' 
                            : 'text-gray-700 hover:text-gray-900 hover:bg-gray-300/50 dark:text-gray-400 dark:hover:text-gray-200'
                        }`}
                    >
                        <User size={18} />
                        Personal Info
                    </button>
                    
                    <button
                        onClick={() => setActiveTab("learner")}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
                            activeTab === "learner" 
                            ? 'bg-white text-indigo-700 shadow-md ring-1 ring-black/5 dark:bg-gray-700 dark:text-indigo-400' 
                            : 'text-gray-700 hover:text-gray-900 hover:bg-gray-300/50 dark:text-gray-400 dark:hover:text-gray-200'
                        }`}
                    >
                        <BookOpen size={18} />
                        Learner Profile
                    </button>

                    {(role === 'admin' || role === 'teacher') && (
                         <button
                            onClick={() => setActiveTab("instructor")}
                            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
                                activeTab === "instructor" 
                                ? 'bg-white text-indigo-700 shadow-md ring-1 ring-black/5 dark:bg-gray-700 dark:text-indigo-400' 
                                : 'text-gray-700 hover:text-gray-900 hover:bg-gray-300/50 dark:text-gray-400 dark:hover:text-gray-200'
                            }`}
                        >
                            <Shield size={18} />
                            Instructor Profile
                        </button>
                    )}
                </div>

                {/* Content */}
                <div className="min-h-[400px]">
                    {activeTab === "common" && profileData && (
                        <CommonProfileForm 
                            profileData={profileData} 
                            setProfileData={setProfileData} 
                        />
                    )}
                    {activeTab === "common" && !profileData && (
                         <div className="text-center py-8 text-red-500">Failed to load personal info.</div>
                    )}
                    
                    {activeTab === "learner" && learnerData && (
                        <LearnerProfileForm 
                            learnerData={learnerData}
                            setLearnerData={setLearnerData}
                        />
                    )}
                    {activeTab === "instructor" && instructorData ? (
                        <InstructorProfileForm 
                            instructorData={instructorData}
                            setInstructorData={setInstructorData}
                        />
                    ) : activeTab === "instructor" && (
                        <div className="text-center py-12">
                            <p className="text-gray-500">Instructor profile not initialized.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
