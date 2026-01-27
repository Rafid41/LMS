import React, { useState, useEffect } from 'react';
import { getSubjectTags, addSubjectTag, updateSubjectTag, deleteSubjectTag } from '../../services/adminService';
import { Plus, Edit2, Trash2, Check, Search, AlertCircle, Loader2 } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import InputField from "../auth/InputField"; // Assuming InputField is available/suitable, otherwise standard input

const SubjectTagManager = () => {
    const { isDarkMode } = useTheme();
    const [tags, setTags] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");

    // Form State
    const [formData, setFormData] = useState({ name: "" });
    const [editingId, setEditingId] = useState(null);

    // Modal States
    const [showDeleteModal, setShowDeleteModal] = useState(null); // ID of tag to delete
    const [showSuccessModal, setShowSuccessModal] = useState(""); // Success message
    const [showDuplicateModal, setShowDuplicateModal] = useState(false);

    useEffect(() => {
        fetchTags();
    }, []);

    const fetchTags = async () => {
        setLoading(true);
        try {
            const data = await getSubjectTags();
            setTags(data);
        } catch (err) {
            setError("Failed to fetch subject tags.");
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (tag) => {
        setEditingId(tag.id);
        setFormData({ name: tag.name });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name) return;

        // Frontend Duplicate Check
        const normalizedName = formData.name.trim().toLowerCase();
        const isDuplicate = tags.some(tag => 
            tag.name.trim().toLowerCase() === normalizedName && tag.id !== editingId
        );

        if (isDuplicate) {
            setShowDuplicateModal(true);
            return;
        }

        setSubmitting(true);
        try {
            if (editingId) {
                await updateSubjectTag(editingId, formData);
                setShowSuccessModal("Subject tag updated successfully!");
            } else {
                await addSubjectTag(formData);
                setShowSuccessModal("Subject tag added successfully!");
            }
            setFormData({ name: "" });
            setEditingId(null);
            fetchTags();
        } catch (err) {
            setError(err.response?.data?.message || "Operation failed.");
        } finally {
            setSubmitting(false);
        }
    };

    const confirmDelete = async () => {
        if (!showDeleteModal) return;
        setSubmitting(true);
        try {
            await deleteSubjectTag(showDeleteModal);
            setShowSuccessModal("Subject tag deleted successfully!");
            fetchTags();
        } catch (err) {
            setError("Failed to delete tag.");
        } finally {
            setSubmitting(false);
            setShowDeleteModal(null);
        }
    };

    const filteredTags = tags.filter(tag => 
        tag.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className={`min-h-screen pt-24 px-6 pb-6 transition-colors duration-300 ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Left Side: Form */}
                <div className="lg:col-span-1">
                    <div className={`p-6 rounded-2xl shadow-lg border ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                             {editingId ? <Edit2 size={20} /> : <Plus size={20} />}
                             {editingId ? "Edit Subject Tag" : "Add Subject Tag"}
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Tag Name</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Computer Science"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                    className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all ${
                                        isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'
                                    }`}
                                />
                            </div>

                            <div className="flex gap-2 pt-2">
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="flex-1 py-2 px-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium transition-all shadow-md hover:shadow-lg disabled:opacity-70 flex justify-center items-center gap-2"
                                >
                                    {submitting ? (
                                        <Loader2 className="animate-spin" size={18} />
                                    ) : (
                                        <>
                                            {editingId ? "Update" : "Add"}
                                        </>
                                    )}
                                </button>
                                {editingId && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setEditingId(null);
                                            setFormData({ name: "" });
                                        }}
                                        className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-all"
                                    >
                                        Cancel
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                </div>

                {/* Right Side: List */}
                <div className="lg:col-span-2 space-y-4">
                     <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold">Subject Tags</h2>
                        <div className="relative w-64">
                            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input 
                                type="text" 
                                placeholder="Search tags..." 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className={`w-full pl-10 pr-4 py-2 rounded-full border focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all ${
                                    isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'
                                }`}
                            />
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-12">
                            <Loader2 className="animate-spin text-emerald-500" size={32} />
                        </div>
                    ) : (
                        <div className={`rounded-2xl shadow-lg border overflow-hidden ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
                            <div className="max-h-[600px] overflow-y-auto custom-scrollbar">
                                {filteredTags.length === 0 ? (
                                    <div className="text-center py-8 text-gray-500">No tags found.</div>
                                ) : (
                                    <table className="w-full text-left">
                                        <thead className={`text-xs uppercase font-semibold tracking-wider ${isDarkMode ? "bg-gray-700/50 text-gray-400" : "bg-gray-50 text-gray-600"}`}>
                                            <tr>
                                                <th className="px-6 py-4">Name</th>
                                                <th className="px-6 py-4">Slug</th>
                                                <th className="px-6 py-4 text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200/10">
                                            {filteredTags.map((tag) => (
                                                <tr key={tag.id} className={`transition-colors ${isDarkMode ? "hover:bg-gray-700/30 border-gray-700" : "hover:bg-gray-50 border-gray-100"}`}>
                                                    <td className="px-6 py-4">
                                                        <div className="font-medium text-lg">{tag.name}</div>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-500">
                                                        {tag.slug}
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <div className="flex justify-end gap-2">
                                                            <button
                                                                onClick={() => handleEdit(tag)}
                                                                className={`p-2 rounded-lg transition-colors ${isDarkMode ? "hover:bg-blue-900/30 text-blue-400" : "hover:bg-blue-50 text-blue-600"}`}
                                                            >
                                                                <Edit2 size={18} />
                                                            </button>
                                                            <button
                                                                onClick={() => setShowDeleteModal(tag.id)}
                                                                className={`p-2 rounded-lg transition-colors ${isDarkMode ? "hover:bg-red-900/30 text-red-400" : "hover:bg-red-50 text-red-600"}`}
                                                            >
                                                                <Trash2 size={18} />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Success Modal */}
            {showSuccessModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className={`w-full max-w-sm p-6 rounded-2xl shadow-2xl transform scale-100 animate-in zoom-in-95 duration-200 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
                        <div className="flex flex-col items-center text-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600 mb-2">
                                <Check size={24} />
                            </div>
                            <h3 className="text-lg font-bold">Success!</h3>
                            <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>{showSuccessModal}</p>
                            <button 
                                onClick={() => setShowSuccessModal("")}
                                className="w-full py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Duplicate Warning Modal */}
            {showDuplicateModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className={`w-full max-w-sm p-6 rounded-2xl shadow-2xl transform scale-100 animate-in zoom-in-95 duration-200 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
                        <div className="flex flex-col items-center text-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600 mb-2">
                                <AlertCircle size={24} />
                            </div>
                            <h3 className="text-lg font-bold">Duplicate Tag</h3>
                            <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                                The subject tag <strong>"{formData.name}"</strong> already exists.
                            </p>
                            <button 
                                onClick={() => setShowDuplicateModal(false)}
                                className="w-full py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-medium transition-colors"
                            >
                                Okay
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className={`w-full max-w-sm p-6 rounded-2xl shadow-2xl transform scale-100 animate-in zoom-in-95 duration-200 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
                        <div className="flex flex-col items-center text-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-600 mb-2">
                                <Trash2 size={24} />
                            </div>
                            <h3 className="text-lg font-bold">Delete Tag?</h3>
                            <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                                Are you sure you want to delete this tag? This action cannot be undone.
                            </p>
                            <div className="flex gap-3 w-full mt-2">
                                <button 
                                    onClick={() => setShowDeleteModal(null)}
                                    className={`flex-1 py-2 rounded-lg font-medium transition-colors ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
                                >
                                    Cancel
                                </button>
                                <button 
                                    onClick={confirmDelete}
                                    className="flex-1 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SubjectTagManager;
