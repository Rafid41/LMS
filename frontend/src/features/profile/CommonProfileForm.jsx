import React, { useState, useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { Camera, Save, Facebook, Linkedin, Github, Twitter, MessageCircle } from 'lucide-react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  CitySelect,
  CountrySelect,
  StateSelect,
} from "react-country-state-city";
import "react-country-state-city/dist/react-country-state-city.css";
import TimezoneSelect from 'react-timezone-select';
import { updateProfile } from '../../services/profileService';
import { API_URL } from '../../services/adminService';

const CommonProfileForm = ({ profileData, setProfileData }) => {
    const { isDarkMode } = useTheme();
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [error, setError] = useState("");
    
    // Address State needed for the library
    const [countryid, setCountryid] = useState(0);
    const [stateid, setStateid] = useState(0);

    // Initial load handling for complex fields
    useEffect(() => {
        if (profileData?.Address) {
             // Logic to pre-fill address components would go here if we were storing IDs.
             // Since we store JSON, we might need a way to map back to IDs if the library requires it for editing,
             // or just show the text values and let user re-select if they want to change.
             // For now, simpler to let them re-select if they update address.
        }
    }, [profileData]);

    const handleInputChange = (e) => {
        setProfileData({ ...profileData, [e.target.name]: e.target.value });
    };

    const handleAddressChange = (key, value) => {
        setProfileData(prev => ({
            ...prev,
            Address: { ...prev.Address, [key]: value }
        }));
    };

    const handlePhotoChange = (e) => {
        // Handle file upload separately or as part of form data
        setProfileData({ ...profileData, profile_photo: e.target.files[0] });
    };

     const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccessMessage("");
        
        try {
            // Need to construct FormData because of file upload and nested JSON
            const formData = new FormData();
            Object.keys(profileData).forEach(key => {
                if (key === 'Address') {
                    formData.append('Address', JSON.stringify(profileData.Address));
                } else if (key === 'timezone' && typeof profileData.timezone === 'object') {
                     formData.append('timezone', profileData.timezone.value);
                } else if (key === 'profile_photo' && profileData.profile_photo instanceof File) {
                    formData.append('profile_photo', profileData.profile_photo);
                } else if(profileData[key] !== null) {
                    formData.append(key, profileData[key]);
                }
            });

            const updatedProfile = await updateProfile(formData);
            setProfileData(updatedProfile); // Update local state with server response (e.g. new photo URL)
            setSuccessMessage("Profile updated successfully!");
        } catch (err) {
            setError("Failed to update profile. " + (err.response?.data?.detail || ""));
        } finally {
            setLoading(false);
        }
    };
    
    // Theme classes
    const inputClass = `w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'}`;
    const labelClass = `block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`;

    return (
        <form onSubmit={handleSubmit} className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            {/* 1. Identity & Photo */}
            <div className={`p-6 rounded-2xl shadow-sm border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                <h3 className="text-lg font-semibold mb-6 flex items-center border-b pb-2 border-gray-200/20">
                    User Identity
                </h3>
                <div className="flex flex-col md:flex-row gap-8 items-start">
                    {/* Photo Upload */}
                    <div className="flex flex-col items-center space-y-3">
                         <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-indigo-100 shadow-md group">
                            {profileData.profile_photo_url || profileData.profile_photo ? (
                                <img 
                                    src={typeof profileData.profile_photo === 'string' ? profileData.profile_photo : URL.createObjectURL(profileData.profile_photo)} 
                                    alt="Profile" 
                                    className="w-full h-full object-cover" 
                                />
                            ) : (
                                <div className={`w-full h-full flex items-center justify-center ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                                    <Camera size={40} className="text-gray-400" />
                                </div>
                            )}
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                <span className="text-white text-xs font-medium">Change</span>
                            </div>
                            <input 
                                type="file" 
                                accept="image/*"
                                onChange={handlePhotoChange}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                        </div>
                    </div>

                    {/* Basic Info */}
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                        <div>
                            <label className={labelClass}>Full Name *</label>
                            <input 
                                type="text"
                                name="full_name"
                                value={profileData.full_name || ""}
                                onChange={handleInputChange}
                                required
                                className={inputClass}
                            />
                        </div>
                        <div>
                            <label className={labelClass}>Email for Communication</label>
                            <input 
                                type="email"
                                name="email_for_communication"
                                value={profileData.email_for_communication || ""}
                                onChange={handleInputChange}
                                className={inputClass}
                                placeholder="Backup or contact email"
                            />
                        </div>
                         <div>
                            <label className={labelClass}>Date of Birth *</label>
                             <DatePicker 
                                selected={profileData.date_of_birth ? new Date(profileData.date_of_birth) : null} 
                                onChange={(date) => setProfileData({...profileData, date_of_birth: date.toISOString().split('T')[0]})} 
                                className={inputClass}
                                dateFormat="yyyy-MM-dd"
                                placeholderText="Select Date"
                                wrapperClassName="w-full"
                             />
                        </div>
                        <div>
                            <label className={labelClass}>Gender *</label>
                            <select 
                                name="gender" 
                                value={profileData.gender || ""} 
                                onChange={handleInputChange}
                                required
                                className={inputClass}
                            >
                                <option value="">Select Gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. Address & Location */}
            <div className={`p-6 rounded-2xl shadow-sm border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                 <h3 className="text-lg font-semibold mb-6 flex items-center border-b pb-2 border-gray-200/20">
                    Location & Address
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className={labelClass}>Country *</label>
                        <CountrySelect
                            onChange={(e) => {
                                setCountryid(e.id);
                                handleAddressChange("country", e.name);
                            }}
                            placeHolder="Select Country"
                            containerClassName={isDarkMode ? 'dark-select-container' : ''}
                            inputClassName={inputClass}
                        />
                         {profileData.Address?.country && <p className="text-xs text-green-500 mt-1">Selected: {profileData.Address.country}</p>}
                    </div>
                    <div>
                        <label className={labelClass}>State / Region *</label>
                        <StateSelect
                            countryid={countryid}
                            onChange={(e) => {
                                setStateid(e.id);
                                handleAddressChange("state", e.name);
                            }}
                            placeHolder="Select State"
                            containerClassName={isDarkMode ? 'dark-select-container' : ''}
                            inputClassName={inputClass}
                        />
                        {profileData.Address?.state && <p className="text-xs text-green-500 mt-1">Selected: {profileData.Address.state}</p>}
                    </div>
                    <div>
                        <label className={labelClass}>City *</label>
                        <CitySelect
                            countryid={countryid}
                            stateid={stateid}
                            onChange={(e) => {
                                handleAddressChange("city", e.name);
                            }}
                            placeHolder="Select City"
                            containerClassName={isDarkMode ? 'dark-select-container' : ''}
                            inputClassName={inputClass}
                        />
                         {profileData.Address?.city && <p className="text-xs text-green-500 mt-1">Selected: {profileData.Address.city}</p>}
                    </div>
                     <div>
                        <label className={labelClass}>Street Address *</label>
                        <input 
                            type="text"
                            value={profileData.Address?.street_address || ""}
                            onChange={(e) => handleAddressChange("street_address", e.target.value)}
                            required
                            className={inputClass}
                            placeholder="House no, Street name"
                        />
                    </div>
                     <div className="md:col-span-2">
                        <label className={labelClass}>Timezone</label>
                        <TimezoneSelect
                            value={profileData.timezone || "Asia/Dhaka"}
                            onChange={(tz) => setProfileData({...profileData, timezone: tz.value})}
                            classNamePrefix="react-select"
                            styles={{
                                control: (base) => ({
                                    ...base,
                                    backgroundColor: isDarkMode ? '#374151' : 'white',
                                    borderColor: isDarkMode ? '#4b5563' : '#d1d5db',
                                    color: isDarkMode ? 'white' : 'inherit',
                                }),
                                menu: (base) => ({
                                    ...base,
                                    backgroundColor: isDarkMode ? '#1f2937' : 'white',
                                    color: isDarkMode ? 'white' : 'inherit',
                                }),
                                option: (base, state) => ({
                                    ...base,
                                    backgroundColor: state.isFocused 
                                        ? (isDarkMode ? '#374151' : '#e5e7eb') 
                                        : (isDarkMode ? '#1f2937' : 'white'),
                                    color: isDarkMode ? 'white' : 'inherit',
                                    cursor: 'pointer',
                                }),
                                singleValue: (base) => ({
                                    ...base,
                                    color: isDarkMode ? 'white' : 'inherit',
                                }),
                                input: (base) => ({
                                    ...base,
                                    color: isDarkMode ? 'white' : 'inherit',
                                }),
                                placeholder: (base) => ({
                                    ...base,
                                    color: isDarkMode ? '#9ca3af' : '#6b7280',
                                }),
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* 3. Social Media */}
            <div className={`p-6 rounded-2xl shadow-sm border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                 <h3 className="text-lg font-semibold mb-6 flex items-center border-b pb-2 border-gray-200/20">
                    Social & Links
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="relative">
                        <Linkedin className="absolute top-3 left-3 text-blue-600" size={18} />
                        <input 
                            type="url" 
                            name="linkedin" 
                            value={profileData.linkedin || ""}
                            onChange={handleInputChange}
                            placeholder="LinkedIn URL" 
                            className={`${inputClass} pl-10`}
                        />
                    </div>
                    <div className="relative">
                        <Github className="absolute top-3 left-3 text-gray-700 dark:text-gray-300" size={18} />
                        <input 
                            type="url" 
                            name="github" 
                            value={profileData.github || ""}
                            onChange={handleInputChange}
                            placeholder="GitHub URL" 
                            className={`${inputClass} pl-10`}
                        />
                    </div>
                     <div className="relative">
                        <Facebook className="absolute top-3 left-3 text-blue-600" size={18} />
                        <input 
                            type="url" 
                            name="facebook" 
                            value={profileData.facebook || ""}
                            onChange={handleInputChange}
                            placeholder="Facebook URL" 
                            className={`${inputClass} pl-10`}
                        />
                    </div>
                     <div className="relative">
                        <Twitter className="absolute top-3 left-3 text-sky-500" size={18} />
                        <input 
                            type="url" 
                            name="twitter_X" 
                            value={profileData.twitter_X || ""}
                            onChange={handleInputChange}
                            placeholder="X (Twitter) URL" 
                            className={`${inputClass} pl-10`}
                        />
                    </div>
                     <div className="relative">
                        <MessageCircle className="absolute top-3 left-3 text-green-500" size={18} />
                        <input 
                            type="url" 
                            name="whatsApp" 
                            value={profileData.whatsApp || ""}
                            onChange={handleInputChange}
                            placeholder="WhatsApp Link" 
                            className={`${inputClass} pl-10`}
                        />
                    </div>
                     <div>
                         <input 
                            type="url" 
                            name="website" 
                            value={profileData.website || ""}
                            onChange={handleInputChange}
                            placeholder="Personal Website" 
                             className={inputClass}
                        />
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

export default CommonProfileForm;
