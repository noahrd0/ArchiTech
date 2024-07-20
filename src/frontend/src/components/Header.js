import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Header.css';

function Header() {
  const { isAuthenticated, logout, userId } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleDeleteAccount = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/user/${userId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });
      if (response.ok) {
        logout();
        navigate('/register');
      } else {
        console.error('Erreur lors de la suppression du compte');
      }
    } catch (error) {
      console.error('Erreur lors de la suppression du compte', error);
    }
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
                <li className="nav-item"><Link to="/list" className="nav-link">Mes Fichiers</Link></li>
                <li className="nav-item">
                  <div className="dropdown">
                    <button onClick={() => setShowDropdown(!showDropdown)} className="nav-link btn-dropdown">Compte</button>
                    {showDropdown && (
                      <div className="dropdown-content">
                        <button className="dropdown-item" onClick={handleLogout}>Déconnexion</button>
                        <button className="dropdown-item" onClick={handleDeleteAccount}>Supprimer le compte</button>
                      </div>
                    )}
                  </div>
                </li>
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
