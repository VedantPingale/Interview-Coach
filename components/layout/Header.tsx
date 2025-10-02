import React, { useState, useRef, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { NAV_LINKS } from '../../constants';
import { useAuth } from '../../hooks/useAuth';
import LoginModal from '../auth/LoginModal';

const Header: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <>
      <header className="bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50">
        <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-bold tracking-wider">AI Coach</span>
          </Link>
          <div className="hidden md:flex items-center space-x-6">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) =>
                  `text-gray-300 hover:text-yellow-400 transition-colors duration-300 ${isActive ? 'text-yellow-400 font-semibold' : ''}`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </div>
          <div className="relative" ref={dropdownRef}>
            {isAuthenticated ? (
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-cyan-500 flex items-center justify-center text-white font-bold text-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-yellow-400"
              >
                {user?.username?.charAt(0).toUpperCase() || 'U'}
              </button>
            ) : (
              <button
                onClick={() => setIsLoginModalOpen(true)}
                className="px-4 py-2 bg-yellow-400 text-gray-900 font-bold rounded-md hover:bg-yellow-300 transition-colors"
              >
                Login
              </button>
            )}
            {dropdownOpen && isAuthenticated && (
              <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-1 z-50 ring-1 ring-white/10">
                <div className="px-4 py-2 text-sm text-gray-400 border-b border-gray-700">
                  <p className="font-semibold text-white">{user?.username}</p>
                </div>
                <Link to="/profile" onClick={() => setDropdownOpen(false)} className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700">Profile</Link>
                <Link to="/settings" onClick={() => setDropdownOpen(false)} className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700">Settings</Link>
                <button
                  onClick={() => { logout(); setDropdownOpen(false); }}
                  className="w-full text-left block px-4 py-2 text-sm text-red-400 hover:bg-gray-700"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </nav>
      </header>
      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
    </>
  );
};

export default Header;