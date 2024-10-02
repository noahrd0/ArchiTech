// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Auth from './components/Auth';
import Header from './components/Header';
import FileList from './components/FileList';
import { AuthProvider } from './context/AuthContext';
import AdminBoard from './components/adminBoard';
import UserFiles from './components/AdminUserFiles';
import Checkout from './components/Checkout';
import Invoice from './components/Invoice';
import Home from './components/Home'; 

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Header />
          <main>
            <Routes>
              {/* Route racine pour rediriger selon l'état d'authentification */}
              <Route path="/" element={<Home />} />

              <Route path="/connexion" element={<Auth />} />
              <Route path="/list" element={<FileList />} />
              <Route path="/admin" element={<AdminBoard />} />
              <Route path="/admin/user/:userId/files" element={<UserFiles />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/invoices" element={<Invoice />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
