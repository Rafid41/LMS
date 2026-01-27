import React, { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { Save, Plus, X } from 'lucide-react';
import { updateInstructorProfile } from '../../services/profileService';
// Assuming we might have a component or select for languages, 
// for now using a simple text input or tag input system.
// A real app might fetch available languages from backend.

const InstructorProfileForm = ({ instructorData, setInstructorData }) => {
    const { isDarkMode } = useTheme();
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [error, setError] = useState("");
    const [languageInput, setLanguageInput] = useState("");

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setInstructorData({ ...instructorData, [name]: value });
    };

    const handleExperienceChange = (e) => {
         setInstructorData({ ...instructorData, years_of_experience: parseFloat(e.target.value) || 0 });
    };

    const addLanguage = (e) => {
        e.preventDefault();
        if (languageInput.trim() && !(instructorData.teaching_languages || []).includes(languageInput.trim())) {
            setInstructorData({
                ...instructorData,
                teaching_languages: [...(instructorData.teaching_languages || []), languageInput.trim()]
            });
            setLanguageInput("");
        }
    };

    const removeLanguage = (langToRemove) => {
        setInstructorData({
            ...instructorData,
            teaching_languages: (instructorData.teaching_languages || []).filter(lang => lang !== langToRemove)
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccessMessage("");

        try {
            const updatedProfile = await updateInstructorProfile(instructorData);
            setInstructorData(updatedProfile);
            setSuccessMessage("Instructor profile updated successfully!");
        } catch (err) {
            setError("Failed to update profile. " + (err.response?.data?.detail || ""));
        } finally {
            setLoading(false);
        }
    };

    const inputClass = `w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'}`;
    const labelClass = `block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`;

    return (
        <form onSubmit={handleSubmit} className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Professional Identity */}
            <div className={`p-6 rounded-2xl shadow-sm border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                <h3 className="text-lg font-semibold mb-6 flex items-center border-b pb-2 border-gray-200/20">
                    Professional Identity
                </h3>
                
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <div>
                            <label className={labelClass}>Designation *</label>
                            <input 
                                type="text"
                                name="designation"
                                value={instructorData.designation || ""}
                                onChange={handleInputChange}
                                required
                                className={inputClass}
                                placeholder="e.g. Senior Software Engineer"
                            />
                        </div>
                        <div>
                             <label className={labelClass}>Organization *</label>
                            <input 
                                type="text"
                                name="organization"
                                value={instructorData.organization || ""}
                                onChange={handleInputChange}
                                required
                                className={inputClass}
                                placeholder="e.g. Google, University of Dhaka"
                            />
                        </div>
                    </div>

                    <div>
                        <label className={labelClass}>Short Bio * (Max 300 chars)</label>
                        <textarea 
                            name="short_bio"
                            value={instructorData.short_bio || ""}
                            onChange={handleInputChange}
                            required
                            maxLength={300}
                            rows={3}
                            className={inputClass}
                            placeholder="Brief professional summary..."
                        />
                         <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            {instructorData.short_bio?.length || 0}/300 characters
                        </p>
                    </div>

                    <div>
                        <label className={labelClass}>Full Bio</label>
                        <textarea 
                            name="full_bio"
                            value={instructorData.full_bio || ""}
                            onChange={handleInputChange}
                            rows={6}
                            className={inputClass}
                            placeholder="Detailed professional background, achievements, etc."
                        />
                    </div>
                </div>
            </div>

            {/* Experience & Skills */}
             <div className={`p-6 rounded-2xl shadow-sm border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                 <h3 className="text-lg font-semibold mb-6 flex items-center border-b pb-2 border-gray-200/20">
                    Experience & Skills
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <div>
                        <label className={labelClass}>Years of Experience *</label>
                        <input 
                            type="number"
                            step="0.1"
                            name="years_of_experience"
                            value={instructorData.years_of_experience || ""}
                            onChange={handleExperienceChange}
                            required
                            min="0"
                            className={inputClass}
                        />
                    </div>

                     <div>
                        <label className={labelClass}>Teaching Languages</label>
                        <div className="flex gap-2 mb-3">
                            <input 
                                type="text"
                                value={languageInput}
                                onChange={(e) => setLanguageInput(e.target.value)}
                                className={inputClass}
                                placeholder="Add language (e.g. English)"
                                onKeyDown={(e) => e.key === 'Enter' && addLanguage(e)}
                            />
                             <button 
                                type="button"
                                onClick={addLanguage}
                                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
                            >
                                <Plus size={20} />
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {instructorData.teaching_languages?.length > 0 ? instructorData.teaching_languages.map((lang, index) => (
                                <span 
                                    key={index}
                                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm ${isDarkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-100 text-gray-800'}`}
                                >
                                    {lang}
                                    <button 
                                        type="button" 
                                        onClick={() => removeLanguage(lang)}
                                        className="hover:text-red-500"
                                    >
                                        <X size={14} />
                                    </button>
                                </span>
                            )) : <span className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>No languages added</span>}
                        </div>
                    </div>
                </div>
            </div>

             {/* Stats (Read Only) */}
             <div className={`p-6 rounded-2xl shadow-sm border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                 <h3 className="text-lg font-semibold mb-6 flex items-center border-b pb-2 border-gray-200/20">
                    Platform Stats
                </h3>
                   <div className="grid grid-cols-3 gap-4 text-center">
                        <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                            <div className="text-2xl font-bold text-indigo-500">{instructorData.total_courses}</div>
                            <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Courses</div>
                        </div>
                         <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                            <div className="text-2xl font-bold text-green-500">{instructorData.total_students}</div>
                            <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Students</div>
                        </div>
                         <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                            <div className="text-2xl font-bold text-yellow-500">{instructorData.average_rating?.toFixed(1) || 0}</div>
                            <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Avg. Rating</div>
                        </div>
                   </div>
            </div>

            {/* Feedback Messages */}
            {successMessage && <div className="p-4 bg-green-100 text-green-700 rounded-lg">{successMessage}</div>}
            {error && <div className="p-4 bg-red-100 text-red-700 rounded-lg">{error}</div>}

            {/* Save Button */}
            <div className="flex justify-end">
                <button 
                    type="submit" 
                    disabled={loading}
                    className="flex items-center gap-2 px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-lg hover:shadow-indigo-500/20 transition-all disabled:opacity-70 transform active:scale-95"
                >
                    <Save size={20} />
                    {loading ? "Saving..." : "Save Changes"}
                </button>
            </div>
        </form>
    );
};

export default InstructorProfileForm;
