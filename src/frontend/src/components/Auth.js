import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import fond from '../img/monochromatic-urban-minimal-landscape.jpg';
import Swal from 'sweetalert2'; // Import SweetAlert2
import './Auth.css';

function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true); // État pour gérer le formulaire actif
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    fetch('/api/user/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    })
      .then(response => response.json())
      .then(data => {
        if (data.token) {
          login(data.token);
          Swal.fire({
            title: 'Succès',
            text: 'Connexion réussie!',
            icon: 'success',
            confirmButtonText: 'Ok'
          });
          navigate('/list');
        } else {
          Swal.fire({
            title: 'Échec de la connexion',
            text: data.message || 'Veuillez réessayer',
            icon: 'error',
            confirmButtonText: 'Ok'
          });
        }
      })
      .catch(error => {
        console.error('Erreur:', error);
        Swal.fire({
          title: 'Erreur',
          text: 'Une erreur est survenue. Veuillez réessayer.',
          icon: 'error',
          confirmButtonText: 'Ok'
        });
      });
  };

  const handleRegister = (e) => {
    e.preventDefault();

    // Vérifie si les mots de passe correspondent
    if (password !== confirmPassword) {
      Swal.fire({
        title: 'Erreur',
        text: 'Les mots de passe ne correspondent pas',
        icon: 'error',
        confirmButtonText: 'Ok'
      });
      return;
    }

    // Envoie une requête d'inscription à l'API
    fetch('/api/user/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })
      .then(response => response.json())
      .then(data => {
        if (!data.message) {
          Swal.fire({
            title: 'Succès',
            text: 'Inscription réussie! Veuillez vous connecter.',
            icon: 'success',
            confirmButtonText: 'Ok'
          });
          setIsLogin(true); // Passer à la page de connexion après l'inscription
        } else {
          Swal.fire({
            title: 'Erreur',
            text: data.message || 'Veuillez réessayer',
            icon: 'error',
            confirmButtonText: 'Ok'
          });
        }
      })
      .catch(error => {
        console.error('Erreur:', error);
        Swal.fire({
          title: 'Erreur',
          text: 'Une erreur est survenue. Veuillez réessayer.',
          icon: 'error',
          confirmButtonText: 'Ok'
        });
      });
  };

  return (
    <div className="auth-container">
      <div className='picture-container'>
        <img src={fond} alt="logo" className='background-image' />
        <div className='text-overlay'>
          <h1 className='company-name'>Architech</h1>
          <p className='slogan'>Votre vision, notre expertise</p>
        </div>
      </div>
      <div className="auth-form-container">
        <div className="form-container">
          <h2 className="form-title">{isLogin ? 'Connexion' : 'Inscription'}</h2>
          <form className="form" onSubmit={isLogin ? handleLogin : handleRegister}>
            <div className="form-group">
              <label className="form-label">Email:</label>
              <input
                type="email"
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Mot de passe:</label>
              <input
                type="password"
                className="form-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {!isLogin && (
              <div className="form-group">
                <label className="form-label">Confirmez le mot de passe:</label>
                <input
                  type="password"
                  className="form-input"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            )}
            <button type="submit" className="form-button">
              {isLogin ? 'Se connecter' : "S'inscrire"}
            </button>
          </form>
          <div className="toggle-container">
            <p>
              {isLogin ? "Vous n'avez pas de compte ?" : 'Vous avez déjà un compte ?'}
              <button className="toggle-button" onClick={() => setIsLogin(!isLogin)}>
                {isLogin ? "S'inscrire" : 'Se connecter'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Auth;