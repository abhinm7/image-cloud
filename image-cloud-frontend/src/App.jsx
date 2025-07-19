import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/Login';
import SignupPage from './pages/Signup';
// import DashboardPage from './pages/Dashboard';
// import FolderViewPage from './pages/FolderView';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      {/* <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/folder/:folderId" element={<FolderViewPage />} /> */}
      <Route path="/" element={<LoginPage />} />
    </Routes>
  );
}

export default App;
