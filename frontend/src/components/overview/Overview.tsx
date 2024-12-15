import React from 'react';
import { Activity, Users, Calendar, FileText } from 'lucide-react';

const Overview: React.FC = () => {
  const stats = [
    { 
      id: 1, 
      label: 'Family Members', 
      value: '8', 
      icon: Users, 
      change: '+2 this month',
      color: 'text-blue-600'
    },
    { 
      id: 2, 
      label: 'Upcoming Appointments', 
      value: '3', 
      icon: Calendar,
      change: 'Next: Dec 18, 2024',
      color: 'text-green-600'
    },
    { 
      id: 3, 
      label: 'Medical Records', 
      value: '12', 
      icon: FileText,
      change: 'Last updated: 2 days ago',
      color: 'text-purple-600'
    },
    { 
      id: 4, 
      label: 'Health Alerts', 
      value: '2', 
      icon: Activity,
      change: 'Review needed',
      color: 'text-orange-600'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.id}
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-between">
              <stat.icon className={`w-8 h-8 ${stat.color}`} />
              <span className="text-2xl font-bold">{stat.value}</span>
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900">{stat.label}</h3>
            <p className="mt-1 text-sm text-gray-500">{stat.change}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Overview;