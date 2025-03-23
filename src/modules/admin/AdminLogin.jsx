import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = () => {
    if (password === 'visionary') {
      navigate('/admin');
    } else {
      alert('Access Denied');
    }
  };

  return (
    <div className="p-6 max-w-sm mx-auto text-center">
      <h2 className="text-2xl font-semibold mb-4">Admin Login</h2>
      <input
        type="password"
        placeholder="Enter Access Code"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border p-2 rounded w-full mb-4"
      />
      <button onClick={handleLogin} className="bg-black text-white px-4 py-2 rounded">
        Enter
      </button>
    </div>
  );
}
