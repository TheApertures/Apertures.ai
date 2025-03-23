import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ObserverPortal from './modules/observer/ObserverPortal';
import MemberDashboard from './modules/member/MemberDashboard';
import AdminLogin from './modules/admin/AdminLogin';
import AdminVetting from './modules/admin/AdminVetting';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ObserverPortal />} />
        <Route path="/dashboard" element={<MemberDashboard />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminVetting />} />
      </Routes>
    </Router>
  );
}

export default App;
