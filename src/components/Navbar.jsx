import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  MessageSquare,
  Trophy,
  LogIn,
  UserPlus,
  LogOut,
  Plus,
} from 'lucide-react';
import { asyncUnsetAuthUser } from '../states/authUser/action';

function Navbar() {
  const location = useLocation();
  const authUser = useSelector((state) => state.authUser);
  const dispatch = useDispatch();

  const isActive = (path) => (location.pathname === path
    ? 'text-blue-600 font-semibold'
    : 'text-gray-600 hover:text-blue-600');

  const onLogout = () => {
    dispatch(asyncUnsetAuthUser());
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-200 bg-white/95 backdrop-blur">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2 text-xl font-bold text-blue-600 hover:opacity-90">
              <MessageSquare className="w-6 h-6" />
              <span>Dicoding Forum</span>
            </Link>

            <nav className="hidden md:flex items-center gap-6" aria-label="Main Navigation">
              <Link
                to="/"
                className={`flex items-center gap-1.5 text-sm transition-colors ${isActive('/')}`}
              >
                <MessageSquare className="w-4 h-4" />
                <span>Threads</span>
              </Link>
              <Link
                to="/leaderboards"
                className={`flex items-center gap-1.5 text-sm transition-colors ${isActive('/leaderboards')}`}
              >
                <Trophy className="w-4 h-4" />
                <span>Leaderboards</span>
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            {authUser ? (
              <div className="flex items-center gap-3 sm:gap-4">
                <Link
                  to="/new"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition shadow-sm"
                  aria-label="Buat Diskusi Baru"
                >
                  <Plus className="w-4 h-4" />
                  <span className="hidden sm:inline">Buat Diskusi</span>
                </Link>
                <div className="flex items-center gap-2">
                  <img
                    src={authUser.avatar}
                    alt={authUser.name}
                    className="w-8 h-8 rounded-full border border-gray-200 object-cover"
                  />
                  <span className="hidden sm:inline text-sm font-medium text-gray-700">
                    {authUser.name}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={onLogout}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 border border-red-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1 transition"
                  aria-label="Logout"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Keluar</span>
                </button>
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="inline-flex items-center gap-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Masuk</span>
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center gap-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Daftar</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
