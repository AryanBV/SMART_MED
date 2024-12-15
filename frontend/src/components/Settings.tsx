import React from 'react';
import { User, Bell, Shield, Database, Share2 } from 'lucide-react';
import { Card } from './ui/card';

const Settings: React.FC = () => {
  const settingsSections = [
    {
      id: 'profile',
      title: 'Profile Settings',
      icon: User,
      description: 'Manage your personal information and preferences',
      items: ['Personal Information', 'Contact Details', 'Language & Region']
    },
    {
      id: 'notifications',
      title: 'Notifications',
      icon: Bell,
      description: 'Configure your notification preferences',
      items: ['Email Notifications', 'SMS Alerts', 'App Notifications']
    },
    {
      id: 'privacy',
      title: 'Privacy & Security',
      icon: Shield,
      description: 'Manage your security preferences and data privacy',
      items: ['Privacy Settings', 'Security Options', 'Two-Factor Authentication']
    },
    {
      id: 'data',
      title: 'Data Management',
      icon: Database,
      description: 'Control your data and export options',
      items: ['Data Export', 'Backup Settings', 'Storage Management']
    },
    {
      id: 'sharing',
      title: 'Sharing & Permissions',
      icon: Share2,
      description: 'Manage access and sharing settings',
      items: ['Family Access', 'Doctor Sharing', 'Emergency Contacts']
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
        <p className="text-gray-500 mt-1">Manage your account settings and preferences</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {settingsSections.map((section) => (
          <Card key={section.id} className="p-6">
            <div className="flex items-start space-x-4">
              <div className="p-2 bg-blue-50 rounded-lg">
                <section.icon className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">{section.title}</h3>
                <p className="text-sm text-gray-500 mt-1">{section.description}</p>
                <ul className="mt-4 space-y-2">
                  {section.items.map((item) => (
                    <li key={item}>
                      <button className="text-sm text-gray-600 hover:text-blue-600 hover:underline">
                        {item}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Settings;