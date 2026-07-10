import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import CreateFIR from './pages/CreateFIR';
import AIPrediction from './pages/AIPrediction'; // Brought inside cleanly

// Helper component to guard private routes
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Authentication Endpoints */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Private Protected Workspace Endpoints */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/create-fir" element={<ProtectedRoute><CreateFIR /></ProtectedRoute>} />
        <Route path="/ai-prediction" element={<ProtectedRoute><AIPrediction /></ProtectedRoute>} />

        {/* Fallback Catch */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;