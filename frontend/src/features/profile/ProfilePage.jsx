import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getProfile, updateProfile } from '../../services/profileService';
import { User, Camera, Mail, Briefcase, MapPin, Calendar, Globe, Linkedin, Github, Facebook, Phone, X, Award, Save, XCircle } from 'lucide-react';

const ProfilePage = () => {
    const { user } = useAuth();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState({});
    const [previewImage, setPreviewImage] = useState(null);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const data = await getProfile();
            setProfile(data);
            setFormData(data);
        } catch (err) {
            setError("Failed to load profile");
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({ ...prev, profile_photo: file }));
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError(null);

        try {
            const data = new FormData();
            Object.keys(formData).forEach(key => {
                if (key === 'profile_photo' && formData[key] instanceof File) {
                    data.append('profile_photo', formData[key]);
                } else if (key !== 'profile_photo' && formData[key] !== null) {
                    data.append(key, formData[key]);
                }
            });

            const updatedProfile = await updateProfile(data);
            setProfile(updatedProfile);
            setFormData(updatedProfile);
            setEditing(false);
            setPreviewImage(null);
        } catch (err) {
            console.error(err);
            setError("Failed to update profile");
        } finally {
            setSaving(false);
        }
    };

    const cancelEdit = () => {
        setFormData(profile);
        setEditing(false);
        setPreviewImage(null);
        setError(null);
    };

    if (loading) return <div className="flex justify-center items-center h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div></div>;
    // if (error) return <div className="text-red-500 text-center mt-10">{error}</div>;

    const SocialInput = ({ icon: Icon, name, placeholder }) => (
        <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Icon className="h-5 w-5 text-gray-400" />
            </div>
            <input
                type="url"
                name={name}
                value={formData[name] || ''}
                onChange={handleInputChange}
                disabled={!editing}
                className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md disabled:bg-gray-50 disabled:text-gray-500"
                placeholder={placeholder}
            />
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-8">
                
                {/* Header Card */}
                <div className="bg-white shadow rounded-lg overflow-hidden">
                    <div className="bg-indigo-600 h-32 sm:h-48"></div>
                    <div className="px-4 sm:px-6 pb-6 -mt-16 sm:-mt-24 flex flex-col sm:flex-row items-center sm:items-end space-y-4 sm:space-y-0 sm:space-x-6">
                        <div className="relative group">
                            <div className="h-32 w-32 sm:h-48 sm:w-48 rounded-full ring-4 ring-white overflow-hidden bg-gray-200 flex items-center justify-center">
                                {previewImage || profile?.profile_photo ? (
                                    <img 
                                        src={previewImage || profile.profile_photo} 
                                        alt={profile?.full_name} 
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <User className="h-16 w-16 text-gray-400" />
                                )}
                            </div>
                            {editing && (
                                <label className="absolute bottom-2 right-2 p-2 bg-indigo-600 rounded-full text-white cursor-pointer hover:bg-indigo-700 shadow-lg transition-all">
                                    <Camera size={20} />
                                    <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                                </label>
                            )}
                        </div>
                        
                        <div className="flex-1 text-center sm:text-left">
                            <h1 className="text-3xl font-bold text-gray-900">{profile?.full_name || 'User'}</h1>
                            <div className="flex flex-wrap justify-center sm:justify-start gap-4 mt-2 text-sm text-gray-600">
                                <div className="flex items-center">
                                    <Briefcase className="mr-1.5 h-4 w-4 text-gray-400" />
                                    <span className="capitalize">{profile?.role || user?.role}</span>
                                </div>
                                <div className="flex items-center">
                                    <Mail className="mr-1.5 h-4 w-4 text-gray-400" />
                                    {profile?.email}
                                </div>
                                {profile?.date_of_birth && (
                                    <div className="flex items-center">
                                        <Calendar className="mr-1.5 h-4 w-4 text-gray-400" />
                                        {profile.date_of_birth}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex-shrink-0">
                            {!editing ? (
                                <button
                                    onClick={() => setEditing(true)}
                                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    Edit Profile
                                </button>
                            ) : (
                                <div className="flex space-x-3">
                                    <button
                                        onClick={cancelEdit}
                                        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                                    >
                                        <XCircle className="mr-2 -ml-1 h-4 w-4" /> Cancel
                                    </button>
                                    <button
                                        onClick={handleSubmit}
                                        disabled={saving}
                                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none disabled:opacity-50"
                                    >
                                        {saving ? 'Saving...' : <><Save className="mr-2 -ml-1 h-4 w-4" /> Save Changes</>}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Form Grid */}
                <div className="bg-white shadow rounded-lg p-6 sm:p-8">
                    {error && (
                        <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <XCircle className="h-5 w-5 text-red-400" aria-hidden="true" />
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm text-red-700">{error}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    <form className="space-y-6">
                        <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                                <div className="mt-1">
                                    <input
                                        type="text"
                                        name="full_name"
                                        value={formData.full_name || ''}
                                        onChange={handleInputChange}
                                        disabled={!editing}
                                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md disabled:bg-gray-50 disabled:text-gray-500"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Gender</label>
                                <div className="mt-1">
                                    <select
                                        name="gender"
                                        value={formData.gender || ''}
                                        onChange={handleInputChange}
                                        disabled={!editing}
                                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md disabled:bg-gray-50 disabled:text-gray-500"
                                    >
                                        <option value="">Select Gender</option>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                                <div className="mt-1">
                                    <input
                                        type="date"
                                        name="date_of_birth"
                                        value={formData.date_of_birth || ''}
                                        onChange={handleInputChange}
                                        disabled={!editing}
                                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md disabled:bg-gray-50 disabled:text-gray-500"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Timezone</label>
                                <div className="mt-1">
                                    <input
                                        type="text"
                                        name="timezone"
                                        value={formData.timezone || ''}
                                        onChange={handleInputChange}
                                        disabled={!editing} // TODO: Make this a dropdown later
                                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md disabled:bg-gray-50 disabled:text-gray-500"
                                    />
                                </div>
                            </div>

                            <div className="sm:col-span-2">
                                <label className="block text-sm font-medium text-gray-700">Address</label>
                                <div className="mt-1">
                                    <textarea
                                        name="Address"
                                        rows={3}
                                        value={formData.Address || ''}
                                        onChange={handleInputChange}
                                        disabled={!editing}
                                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md disabled:bg-gray-50 disabled:text-gray-500"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="pt-8">
                            <h3 className="text-lg leading-6 font-medium text-gray-900 border-b pb-2 mb-4">Social Profiles</h3>
                            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                                <SocialInput icon={Globe} name="website" placeholder="https://website.com" />
                                <SocialInput icon={Linkedin} name="linkedin" placeholder="https://linkedin.com/in/..." />
                                <SocialInput icon={Github} name="github" placeholder="https://github.com/..." />
                                <SocialInput icon={Facebook} name="facebook" placeholder="https://facebook.com/..." />
                                <SocialInput icon={Phone} name="whatsApp" placeholder="WhatsApp Number" />
                                <SocialInput icon={X} name="twitter_X" placeholder="https://x.com/..." />
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
