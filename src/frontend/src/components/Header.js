import React, { useEffect, useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import logo from '../img/logo.png';
import './Header.css';

function Header() {
  const { isAuthenticated, logout, userId } = useContext(AuthContext);
  const [userRole, setUserRole] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/connexion');
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
        navigate('/connexion');
      } else {
        console.error('Erreur lors de la suppression du compte');
      }
    } catch (error) {
      console.error('Erreur lors de la suppression du compte', error);
    }
  };

  const handleInvoice = () => {
    navigate('/invoices');
  };

  useEffect(() => {
    const token = localStorage.getItem('token');

    // Récupérer le rôle de l'utilisateur
    fetch(`/api/user/${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => response.json())
      .then(data => {
        setUserRole(data.role);
      })
      .catch(error => {
        console.error('Erreur lors de la récupération du rôle:', error);
      });
  }, [userId]);

  return (
    <header className="header">
      <div className="container">
        <div className="logo">
          <img src={logo} alt="logo"></img>
        </div>

        {/* Bouton Hamburger */}
        <div className='container-hamburger'>
          <div className={`hamburger ${menuOpen ? 'open' : ''}`} onClick={() => setMenuOpen(!menuOpen)}>
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
          </div>
        </div>

        {/* Navigation avec gestion du menu ouvert/fermé */}
        <nav className={`nav ${menuOpen ? 'open' : ''}`}>
          <ul className="nav-list">
            {isAuthenticated ? (
              <>
                <li className="nav-item"><Link to="/list" className="nav-link" onClick={() => setMenuOpen(false)}>Mes Fichiers</Link></li>
                {userRole === 'admin' && (
                  <li className="nav-item"><Link to="/admin" className="nav-link" onClick={() => setMenuOpen(false)}>Panneau Admin</Link></li>
                )}
                <li className="nav-item"><Link to="/checkout" className="nav-link">Stockage</Link></li>
                <li className="nav-item">
                  <div 
                    className="dropdown" 
                    onMouseEnter={() => setShowDropdown(true)} 
                    onMouseLeave={() => setShowDropdown(false)}
                  >
                    <button className="nav-link btn-dropdown">
                      Compte
                    </button>
                    {showDropdown && (
                      <div className="dropdown-content">
                        <button className="dropdown-item" onClick={() => { handleInvoice(); setMenuOpen(false); }}>Factures</button>
                        <button className="dropdown-item " onClick={() => { handleLogout(); setMenuOpen(false); }}>Déconnexion</button>
                        <button className="dropdown-item delete-account" onClick={() => { handleDeleteAccount(); setMenuOpen(false); }}>Supprimer le compte</button>
                      </div>
                    )}
                  </div>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item-auth"><Link to="/connexion" className="nav-link" onClick={() => setMenuOpen(false)}>Connexion</Link></li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header;