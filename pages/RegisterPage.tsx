import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

const RegisterPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    
    if (username.trim() && email.trim() && password) {
      setError('');
      setIsLoading(true);
      try {
        await register({ username, email, password });
        navigate('/');
      } catch (err: any) {
        setError(err.message || 'An unexpected error occurred during registration.');
      } finally {
        setIsLoading(false);
      }
    } else {
      setError('Please fill out all fields.');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <Card>
        <div className="p-4">
          <h1 className="text-3xl font-bold text-center mb-6 text-yellow-400">Create an Account</h1>
          <form onSubmit={handleRegister}>
            <div className="mb-4">
              <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-1">Username</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
                required
                autoComplete="username"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
                required
                autoComplete="email"
              />
            </div>
             <div className="mb-4">
              {/* FIX: Replaced invalid attribute 'ناد' with 'className'. */}
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
                required
                autoComplete="new-password"
              />
            </div>
             <div className="mb-6">
              {/* FIX: Replaced invalid attribute 'ناد' with 'className'. */}
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-1">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
                required
                autoComplete="new-password"
              />
            </div>
            {error && <p className="text-red-400 text-sm text-center mb-4">{error}</p>}
            <Button type="submit" variant="primary" className="w-full" isLoading={isLoading}>
              Sign Up
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
};

export default RegisterPage;