import { Link } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';

const AdminDashboard = () => {
  const { isDarkMode } = useTheme();

  return (
    <div className={`min-h-screen pt-24 p-8 transition-colors duration-300 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link 
            to="/admin/languages" 
            className={`block p-6 rounded-xl transition border ${
                isDarkMode 
                ? 'bg-gray-800 border-gray-700 hover:bg-gray-700' 
                : 'bg-white border-gray-200 hover:bg-gray-100 shadow-sm'
            }`}
        >
            <h3 className="text-xl font-bold mb-2 text-emerald-400">Language Management</h3>
            <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Add, edit, or remove system languages.</p>
        </Link>
        
        <Link 
            to="/admin/timezones" 
            className={`block p-6 rounded-xl transition border ${
                isDarkMode 
                ? 'bg-gray-800 border-gray-700 hover:bg-gray-700' 
                : 'bg-white border-gray-200 hover:bg-gray-100 shadow-sm'
            }`}
        >
            <h3 className="text-xl font-bold mb-2 text-emerald-400">Timezone Management</h3>
            <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Manage system timezones.</p>
        </Link>
        
        <Link 
            to="/admin/subject-tags" 
            className={`block p-6 rounded-xl transition border ${
                isDarkMode 
                ? 'bg-gray-800 border-gray-700 hover:bg-gray-700' 
                : 'bg-white border-gray-200 hover:bg-gray-100 shadow-sm'
            }`}
        >
            <h3 className="text-xl font-bold mb-2 text-emerald-400">Subject Tags</h3>
            <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Manage content subject tags.</p>
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;
