import React, { useState, useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { Save, Tag, Award, Flame, Zap, X, Plus } from 'lucide-react';
import { getSubjectTags } from '../../services/adminService';
import { updateLearnerProfile } from '../../services/profileService';

const LearnerProfileForm = ({ learnerData, setLearnerData }) => {
    const { isDarkMode } = useTheme();
    const [allTags, setAllTags] = useState([]);
    const [loading, setLoading] = useState(false);
    const [tagLoading, setTagLoading] = useState(true);
    const [successMessage, setSuccessMessage] = useState("");
    const [error, setError] = useState("");
    const [searchTerm, setSearchTerm] = useState("");

    // Fetch Subject Tags on Mount
    useEffect(() => {
        const fetchTags = async () => {
            try {
                const data = await getSubjectTags();
                // Handle potential pagination or raw array
                const tags = Array.isArray(data) ? data : (data?.results || []);
                setAllTags(tags);
            } catch (err) {
                console.error("Failed to load tags", err);
                setAllTags([]); // Fallback to empty array
            } finally {
                setTagLoading(false);
            }
        };
        fetchTags();
    }, []);

    const toggleInterest = (tagId) => {
        // Handle both interests (objects from GET) and interest_ids (local updates)
        const currentInterests = learnerData.interest_ids || learnerData.interests?.map(i => i.id) || [];
        
        let newInterests;
        if (currentInterests.includes(tagId)) {
            newInterests = currentInterests.filter(id => id !== tagId);
        } else {
            newInterests = [...currentInterests, tagId];
        }
        setLearnerData({ ...learnerData, interest_ids: newInterests });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccessMessage("");

        try {
            const updated = await updateLearnerProfile(learnerData);
            // Update local state with the server response
            setLearnerData(updated); 
            setSuccessMessage("Learning preferences updated!");
        } catch (err) {
            setError("Failed to update preferences.");
        } finally {
            setLoading(false);
        }
    };

    // Filter tags safe check
    const filteredTags = (allTags || []).filter(tag => 
        tag && tag.name && tag.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <form onSubmit={handleSubmit} className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
             {/* 1. Learning Interests */}
             <div className={`p-6 rounded-2xl shadow-sm border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 border-b pb-2 border-gray-200/20">
                     <Tag size={20} className="text-indigo-500" />
                     Learning Interests
                </h3>
                <p className={`text-sm mb-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Select the topics you are interested in. We'll recommend courses based on this.
                </p>

                {/* Search Box */}
                <div className="mb-6">
                     <input 
                         type="text"
                         placeholder="Search topics..."
                         value={searchTerm}
                         onChange={(e) => setSearchTerm(e.target.value)}
                         className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'}`}
                     />
                </div>

                {/* Selected Tags Area */}
                <div className="mb-6">
                    <h4 className={`text-sm font-medium mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Selected Interests
                    </h4>
                    <div className={`flex flex-wrap gap-2 min-h-[40px] p-4 rounded-xl border ${isDarkMode ? 'border-gray-700 bg-gray-800/50' : 'border-gray-200 bg-gray-50 shadow-inner'}`}>
                        {(() => {
                            const currentInterestIds = learnerData.interest_ids || learnerData.interests?.map(i => i.id) || [];
                            const selectedTags = (allTags || []).filter(tag => currentInterestIds.includes(tag.id));
                            
                            if (selectedTags.length === 0) {
                                return <span className="text-sm text-gray-400 italic">No interests selected yet.</span>;
                            }

                            return selectedTags.map(tag => (
                                <button
                                    key={tag.id}
                                    type="button"
                                    onClick={() => toggleInterest(tag.id)}
                                    className="px-3 py-1.5 rounded-full text-sm font-medium bg-indigo-600 text-white shadow-md hover:bg-indigo-700 flex items-center gap-1 transition-all animate-in fade-in zoom-in duration-200"
                                >
                                    {tag.name}
                                    <span className="bg-indigo-500/50 rounded-full p-0.5 hover:bg-indigo-500"><X size={12} /></span>
                                </button>
                            ));
                        })()}
                    </div>
                </div>

                {/* Available Tags Area */}
                <div>
                     <h4 className={`text-sm font-medium mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Available Topics
                    </h4>
                    {tagLoading ? (
                        <div className="py-8 text-center text-gray-500">Loading topics...</div>
                    ) : (
                        <div className="flex flex-wrap gap-2 max-h-60 overflow-y-auto custom-scrollbar p-1">
                            {filteredTags.filter(tag => {
                                const currentInterestIds = learnerData.interest_ids || learnerData.interests?.map(i => i.id) || [];
                                return !currentInterestIds.includes(tag.id);
                            }).map(tag => (
                                <button
                                    key={tag.id}
                                    type="button"
                                    onClick={() => toggleInterest(tag.id)}
                                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all border ${
                                        isDarkMode 
                                            ? 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600 hover:border-gray-500' 
                                            : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-indigo-200 hover:text-indigo-600'
                                    }`}
                                >
                                    <Plus size={14} className="inline mr-1 opacity-50" />
                                    {tag.name}
                                </button>
                            ))}
                            {filteredTags.filter(tag => {
                                const currentInterestIds = learnerData.interest_ids || learnerData.interests?.map(i => i.id) || [];
                                return !currentInterestIds.includes(tag.id);
                            }).length === 0 && (
                                <div className="w-full text-center py-4 text-gray-400 text-sm">
                                    No more topics available matching "{searchTerm}"
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* 2. Gamification Stats (Read Only) */}
            <div className={`p-6 rounded-2xl shadow-sm border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                <h3 className="text-lg font-semibold mb-6 flex items-center gap-2 border-b pb-2 border-gray-200/20">
                     <Award size={20} className="text-yellow-500" />
                     Your Progress
                </h3>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                     <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-700/50' : 'bg-indigo-50/50'} flex flex-col items-center justify-center text-center`}>
                        <Zap className="text-yellow-500 mb-2" size={24} />
                        <span className="text-2xl font-bold">{learnerData.total_xp || 0}</span>
                        <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Total XP</span>
                     </div>
                     <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-700/50' : 'bg-orange-50/50'} flex flex-col items-center justify-center text-center`}>
                        <Flame className="text-orange-500 mb-2" size={24} />
                        <span className="text-2xl font-bold">{learnerData.streak_days || 0}</span>
                        <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Day Streak</span>
                     </div>
                     <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-700/50' : 'bg-green-50/50'} flex flex-col items-center justify-center text-center`}>
                        <Award className="text-green-500 mb-2" size={24} />
                        <span className="text-2xl font-bold">{learnerData.level || 1}</span>
                        <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Current Level</span>
                     </div>
                      <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-700/50' : 'bg-blue-50/50'} flex flex-col items-center justify-center text-center`}>
                        <span className="text-2xl font-bold">{learnerData.total_courses_completed || 0}</span>
                        <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Courses Done</span>
                     </div>
                </div>
            </div>

             {/* Feedback Messages */}
             {successMessage && <div className="p-4 bg-green-100 text-green-700 rounded-lg">{successMessage}</div>}
             {error && <div className="p-4 bg-red-100 text-red-700 rounded-lg">{error}</div>}

            <div className="flex justify-end">
                <button 
                    type="submit" 
                    disabled={loading}
                    className="flex items-center gap-2 px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-lg hover:shadow-indigo-500/20 transition-all disabled:opacity-70 transform active:scale-95"
                >
                    <Save size={20} />
                    {loading ? "Saving..." : "Save Preferences"}
                </button>
            </div>
        </form>
    );
};

export default LearnerProfileForm;
