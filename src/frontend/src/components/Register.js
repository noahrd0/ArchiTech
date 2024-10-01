import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Register.css';

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();

    // Vérifie si les mots de passe correspondent
    if (password !== confirmPassword) {
        alert('Les mots de passe ne correspondent pas');
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
            // Vérifie si la réponse contient un message d'erreur
            if (data.message) {
              alert('Inscription réussie! Veuillez vous connecter.');
              navigate('/login');
            } else {
                alert('Une erreur est survenue. Veuillez réessayer.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Une erreur est survenue. Veuillez réessayer.');
        });
  };

  return (
    <div className="register-container">
      <div className="form-container">
        <h2 className="form-title">Inscription</h2>
        <form className="form" onSubmit={handleRegister}>
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
          <button type="submit" className="form-button">
            S'inscrire
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;
