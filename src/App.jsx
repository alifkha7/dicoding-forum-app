import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LoadingBar from 'react-redux-loading-bar';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import LeaderboardsPage from './pages/LeaderboardsPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <LoadingBar className="fixed top-0 z-50 h-1 bg-blue-500" />
      <Navbar />
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/leaderboards" element={<LeaderboardsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
