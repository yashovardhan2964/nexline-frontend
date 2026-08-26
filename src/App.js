import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import CustomerPage from './pages/CustomerPage';
import AdminPage from './pages/AdminPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          {/* Default route goes to customer page */}
          <Route path="/" element={<CustomerPage />} />
          
          {/* Admin route */}
          <Route path="/admin" element={<AdminPage />} />
          
          {/* Any unknown route redirects to home */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;