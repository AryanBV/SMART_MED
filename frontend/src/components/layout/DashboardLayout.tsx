import React from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { 
  Home, 
  Users, 
  FileText, 
  Settings,
  Pill,
} from 'lucide-react';

interface MenuItem {
  id: string;
  icon: React.FC<{ className?: string }>;
  label: string;
  path: string;
}

const DashboardLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems: MenuItem[] = [
    { id: 'overview', icon: Home, label: 'Overview', path: '/' },
    { id: 'family', icon: Users, label: 'Family History', path: '/family-history' },
    { id: 'medications', icon: Pill, label: 'Medications', path: '/medications' },
    { id: 'records', icon: FileText, label: 'Medical Records', path: '/medical-records' },
    { id: 'settings', icon: Settings, label: 'Settings', path: '/settings' }
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-blue-700">SMART_MED</h1>
          <p className="text-sm text-gray-500 mt-1">Healthcare Management System</p>
        </div>
        <nav className="mt-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center px-6 py-3 text-left ${
                location.pathname === item.path
                  ? 'bg-blue-50 text-blue-700 border-r-4 border-blue-700'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <header className="bg-white shadow-sm">
          <div className="px-6 py-4">
            <h2 className="text-xl font-semibold text-gray-800">
              {menuItems.find(item => item.path === location.pathname)?.label || 'Overview'}
            </h2>
          </div>
        </header>

        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;