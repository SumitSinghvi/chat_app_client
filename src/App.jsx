import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import React from 'react';
import Dashboard from './pages/dashboard.jsx';
import ChatApp from './pages/ChatApp.jsx';
import Profile from './pages/profilePage.jsx';
import TestPage from './pages/Test.jsx';

const App = () => {
  return (
  <Router>
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/chat" element={<ChatApp />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/test" element={<TestPage />} />
    </Routes>
  </Router>
  )
};

export default App;



