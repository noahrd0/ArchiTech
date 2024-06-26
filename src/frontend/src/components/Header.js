// src/components/Header.js
import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Header.css';

function Header() {
  const { isAuthenticated, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="container">
        <div className="logo">Votre Logo</div>
        <nav className="nav">
          <ul className="nav-list">
            {isAuthenticated ? (
              <>
                <li className="nav-item"><Link to="/upload" className="nav-link">Uploader Fichiers</Link></li>
                <li className="nav-item"><Link to="/files" className="nav-link">Mes Fichiers</Link></li>
                <li className="nav-item"><button className="nav-link btn-logout" onClick={handleLogout}>Déconnexion</button></li>
              </>
            ) : (
              <>
                <li className="nav-item"><Link to="/register" className="nav-link">Inscription</Link></li>
                <li className="nav-item"><Link to="/login" className="nav-link">Connexion</Link></li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header;
