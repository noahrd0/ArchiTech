import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const AdminBoard = () => {
  const { userId } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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
        setLoading(false);
      })
      
      .catch(error => {
        console.error('Erreur lors de la récupération du rôle:', error);
        setLoading(false);
      });

    // Récupérer la liste des utilisateurs
    fetch('/api/admin/list', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => response.json())
      .then(data => setUsers(data))
      .catch(error => console.error('Erreur lors de la récupération des utilisateurs:', error));
  }, [userId]);

  if (loading) return <p>Chargement...</p>;
  if (userRole !== 'admin') return <p>Accès refusé. Vous n'avez pas les autorisations nécessaires.</p>;

  const handleUserClick = (userId) => {
    navigate(`/admin/user/${userId}/files`);
  };

  return (
    <div>
      <h1>Panneau d'administration</h1>
      <h2>Liste des utilisateurs :</h2>
      <ul>
        {users.map(user => (
          <li key={user.id} onClick={() => handleUserClick(user.id)} style={{ cursor: 'pointer' }}>
            {user.email}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminBoard;
