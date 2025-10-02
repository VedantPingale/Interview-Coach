import React from 'react';
import { useAuth } from '../hooks/useAuth';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const SettingsPage: React.FC = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="text-center py-16">
        <i className="fas fa-lock text-6xl text-gray-600 mb-4"></i>
        <h1 className="text-4xl font-bold mb-2">Access Denied</h1>
        <p className="text-gray-400">Please log in to view your settings.</p>
      </div>
    );
  }

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Password change functionality is not yet implemented.');
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-4xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-yellow-200">
        Settings
      </h1>

      <Card className="mb-8">
        <div className="p-4">
          <h2 className="text-2xl font-bold text-yellow-400 mb-4">Change Password</h2>
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Current Password</label>
              <input
                type="password"
                className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
                autoComplete="current-password"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">New Password</label>
              <input
                type="password"
                className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
                autoComplete="new-password"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Confirm New Password</label>
              <input
                type="password"
                className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
                autoComplete="new-password"
              />
            </div>
            <div className="text-right">
              <Button type="submit" variant="primary">
                Update Password
              </Button>
            </div>
          </form>
        </div>
      </Card>
      
      <Card>
        <div className="p-4">
          <h2 className="text-2xl font-bold text-yellow-400 mb-4">Account Controls</h2>
          <div className="flex justify-between items-center p-4 bg-red-900/20 border border-red-500/30 rounded-lg">
            <div>
              <p className="font-bold text-red-400">Delete Account</p>
              <p className="text-sm text-gray-400">Once you delete your account, there is no going back. Please be certain.</p>
            </div>
            <Button
              className="bg-red-600 text-white hover:bg-red-500 focus:ring-red-500 shadow-lg shadow-red-500/20"
              onClick={() => alert('Account deletion is not yet implemented.')}
            >
              Delete Account
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SettingsPage;
