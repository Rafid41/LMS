import React from 'react';

const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <a href="/admin/languages" className="block p-6 bg-gray-800 rounded-xl hover:bg-gray-700 transition border border-gray-700">
            <h3 className="text-xl font-bold mb-2 text-emerald-400">Language Management</h3>
            <p className="text-gray-400">Add, edit, or remove system languages.</p>
        </a>
      </div>
    </div>
  );
};

export default AdminDashboard;
