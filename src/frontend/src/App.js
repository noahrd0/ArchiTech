// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Login from './components/Login';
import Register from './components/Register';
import Header from './components/Header';
import FileList from './components/FileList';
import { AuthProvider } from './context/AuthContext';
import  AdminBoard  from './components/adminBoard';
import UserFiles from './components/AdminUserFiles';
import Checkout from './components/Checkout';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Header />
          <main>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/list" element={<FileList />} />
              <Route path="/admin" element={<AdminBoard />} />
              <Route path="/admin/user/:userId/files" element={<UserFiles />} />
              <Route path="/checkout" element={<Checkout />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
