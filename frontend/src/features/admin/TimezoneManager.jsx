import React, { useState, useEffect } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import * as adminService from "../../services/adminService";
import { Loader2, Trash2, Edit2, Plus, X, Check, Search, AlertCircle } from "lucide-react";
import InputField from "../auth/InputField";

const TimezoneManager = () => {
  const { isDarkMode } = useTheme();
  const [timezones, setTimezones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Form State
  const [formData, setFormData] = useState({
    continent: "Asia",
    city: "",
    gmt_sign: "+",
    gmt_time: "",
  });
  
  const continents = [
    "Africa", "America", "Antarctica", "Asia", "Atlantic", "Australia", "Europe", "Indian", "Pacific"
  ];

  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Modals
  const [showDeleteModal, setShowDeleteModal] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState("");
  const [showDuplicateModal, setShowDuplicateModal] = useState(false);

  const fetchTimezones = async () => {
    try {
      const data = await adminService.getTimezones();
      setTimezones(data);
    } catch (err) {
      setError("Failed to load timezones");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTimezones();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.city || !formData.gmt_time) return;
    
    // Validate Time Format length
    if (formData.gmt_time.length !== 5) {
        alert("Please enter a valid time in HH:MM format (e.g., 06:00)");
        return;
    }

    // Construct final values
    const fullTimezoneName = `${formData.continent}/${formData.city.trim()}`;
    const fullGmtOffset = `${formData.gmt_sign}${formData.gmt_time.trim()}`;

    // Check for duplicates (case-insensitive, trimmed)
    const normalizedName = fullTimezoneName.trim().toLowerCase();
    const isDuplicate = timezones.some(
        tz => tz.timezone_name.toLowerCase().trim() === normalizedName && tz.id !== editingId
    );

    if (isDuplicate) {
        setShowDuplicateModal(true);
        return;
    }

    setSubmitting(true);
    const apiData = { timezone_name: fullTimezoneName, gmt_offset: fullGmtOffset };
    console.log("Sending Timezone Data:", apiData);
    
    try {
      if (editingId) {
        await adminService.updateTimezone(editingId, apiData);
        setShowSuccessModal("Timezone updated successfully!");
      } else {
        await adminService.addTimezone(apiData);
        setShowSuccessModal("Timezone added successfully!");
      }
      setFormData({ continent: "Asia", city: "", gmt_sign: "+", gmt_time: "" });
      setEditingId(null);
      fetchTimezones();
    } catch (err) {
      console.error("Timezone Save Error:", err); // Debug log
      setError("Failed to save timezone. Check console for details.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!showDeleteModal) return;
    try {
      await adminService.deleteTimezone(showDeleteModal);
      setShowSuccessModal("Timezone deleted successfully!");
      fetchTimezones();
    } catch (err) {
      setError("Failed to delete timezone");
    } finally {
      setShowDeleteModal(null);
    }
  };

  const handleEdit = (tz) => {
    const [continent, city] = tz.timezone_name.split('/');
    const sign = tz.gmt_offset.charAt(0);
    const time = tz.gmt_offset.slice(1);

    setFormData({
      continent: continent || "Asia",
      city: city || "",
      gmt_sign: sign || "+",
      gmt_time: time || "",
    });
    setEditingId(tz.id);
  };

  const filteredTimezones = timezones.filter((tz) =>
    tz.timezone_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tz.gmt_offset.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div
      className={`min-h-screen pt-24 px-6 pb-6 transition-colors duration-300 ${
        isDarkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"
      }`}
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Side: Form */}
        <div className="lg:col-span-1">
          <div
            className={`p-6 rounded-2xl shadow-lg border ${
              isDarkMode
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-200"
            }`}
          >
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              {editingId ? <Edit2 size={20} /> : <Plus size={20} />}
              {editingId ? "Edit Timezone" : "Add Timezone"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Timezone Name Split */}
              <div className="space-y-2">
                  <label className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Timezone Name</label>
                  <div className="flex gap-2">
                      <select 
                          value={formData.continent}
                          onChange={(e) => setFormData({...formData, continent: e.target.value})}
                          className={`flex-1 p-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors ${
                              isDarkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-gray-50 border-gray-300 text-gray-900"
                          }`}
                      >
                          {continents.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                      <div className="flex-[2]">
                        <InputField
                            value={formData.city}
                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                            dark={isDarkMode}
                            placeholder="City (e.g. Dhaka)"
                            required
                        />
                      </div>
                  </div>
              </div>

              {/* GMT Offset Split */}
              <div className="space-y-2">
                  <label className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>GMT Offset (HH:MM)</label>
                  <div className="flex gap-2">
                      <select 
                          value={formData.gmt_sign}
                          onChange={(e) => setFormData({...formData, gmt_sign: e.target.value})}
                          className={`w-20 p-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors text-center ${
                              isDarkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-gray-50 border-gray-300 text-gray-900"
                          }`}
                      >
                          <option value="+">+</option>
                          <option value="-">-</option>
                      </select>
                      <div className="flex-1">
                          <input
                              type="text"
                              value={formData.gmt_time}
                              onChange={(e) => {
                                  let val = e.target.value.replace(/\D/g, ''); // Remove non-numbers
                                  if (val.length > 4) val = val.slice(0, 4); // Limit to 4 digits
                                  
                                  // Format as HH:MM
                                  if (val.length > 2) {
                                      val = val.slice(0, 2) + ':' + val.slice(2);
                                  }
                                  
                                  setFormData({ ...formData, gmt_time: val });
                              }}
                              placeholder="06:00"
                              className={`w-full p-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors ${
                                  isDarkMode ? "bg-gray-700 border-gray-600 text-white placeholder-gray-500" : "bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400"
                              }`}
                              required
                          />
                      </div>
                  </div>
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
                        setFormData({ continent: "Asia", city: "", gmt_sign: "+", gmt_time: "" });
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
            <h2 className="text-2xl font-bold">Timezones</h2>
            <div className="relative w-64">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                    type="text" 
                    placeholder="Search timezones..." 
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
            <div
              className={`rounded-2xl shadow-lg border overflow-hidden ${
                isDarkMode
                  ? "bg-gray-800 border-gray-700"
                  : "bg-white border-gray-200"
              }`}
            >
              <div className="max-h-[600px] overflow-y-auto custom-scrollbar">
                {filteredTimezones.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">No timezones found.</div>
                ) : (
                    <table className="w-full text-left">
                    <thead
                        className={`text-xs uppercase font-semibold tracking-wider ${
                        isDarkMode
                            ? "bg-gray-700/50 text-gray-400"
                            : "bg-gray-50 text-gray-600"
                        }`}
                    >
                        <tr>
                        <th className="px-6 py-4">Name</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200/10">
                        {filteredTimezones.map((tz) => (
                        <tr
                            key={tz.id}
                            className={`transition-colors ${
                            isDarkMode
                                ? "hover:bg-gray-700/30 border-gray-700"
                                : "hover:bg-gray-50 border-gray-100"
                            }`}
                        >
                            <td className="px-6 py-4">
                            <div className="font-medium text-lg">
                                {tz.timezone_name}
                                <span className="ml-2 text-sm text-gray-500 font-normal">
                                    ({tz.gmt_offset})
                                </span>
                            </div>
                            </td>
                            <td className="px-6 py-4 text-right">
                            <div className="flex justify-end gap-2">
                                <button
                                onClick={() => handleEdit(tz)}
                                className={`p-2 rounded-lg transition-colors ${
                                    isDarkMode
                                    ? "hover:bg-blue-900/30 text-blue-400"
                                    : "hover:bg-blue-50 text-blue-600"
                                }`}
                                >
                                <Edit2 size={18} />
                                </button>
                                <button
                                onClick={() => setShowDeleteModal(tz.id)}
                                className={`p-2 rounded-lg transition-colors ${
                                    isDarkMode
                                    ? "hover:bg-red-900/30 text-red-400"
                                    : "hover:bg-red-50 text-red-600"
                                }`}
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

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className={`w-full max-w-sm p-6 rounded-2xl shadow-2xl transform scale-100 animate-in zoom-in-95 duration-200 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
                <div className="flex flex-col items-center text-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-600 mb-2">
                        <Trash2 size={24} />
                    </div>
                    <h3 className="text-lg font-bold">Delete Timezone?</h3>
                    <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                        Are you sure you want to delete this timezone? This action cannot be undone.
                    </p>
                    <div className="flex gap-3 w-full mt-2">
                        <button 
                            onClick={() => setShowDeleteModal(null)}
                            className={`flex-1 py-2 rounded-lg font-medium transition-colors ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={handleDelete}
                            className="flex-1 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors"
                        >
                            Delete
                        </button>
                    </div>
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
                    <h3 className="text-lg font-bold">Duplicate Timezone</h3>
                    <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                        The timezone <strong>"{formData.timezone_name}"</strong> is already in the list.
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
    </div>
  );
};

export default TimezoneManager;
