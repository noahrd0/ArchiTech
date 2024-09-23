import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Doughnut, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import './AdminBoard.css';

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const AdminBoard = () => {
  const { userId } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [statistics, setStatistics] = useState({});
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');

    fetch(`/api/user/${userId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
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

    fetch('/api/admin/list', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(response => response.json())
      .then(data => setUsers(data))
      .catch(error => console.error('Erreur lors de la récupération des utilisateurs:', error));

    fetch('/api/admin/statistics', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(response => response.json())
      .then(data => setStatistics(data))
      .catch(error => console.error('Erreur lors de la récupération des statistiques:', error));

  }, [userId]);

  if (loading) return <p>Chargement...</p>;
  if (userRole !== 'admin') return <p>Accès refusé. Vous n'avez pas les autorisations nécessaires.</p>;

  const handleUserClick = (userId) => {
    navigate(`/admin/user/${userId}/files`);
  };

  const pieData = {
    labels: ['Fichiers aujourd\'hui', 'Fichiers totaux'],
    datasets: [
      {
        label: 'Fichiers',
        data: [statistics.today, statistics.files],
        backgroundColor: ['#36A2EB', '#FF6384'],
        hoverBackgroundColor: ['#36A2EB', '#FF6384'],
      },
    ],
  };

  const barData = {
    labels: ['Utilisateurs', 'Moyenne de fichiers/utilisateur'],
    datasets: [
      {
        label: 'Statistiques',
        data: [statistics.users, statistics.by_user],
        backgroundColor: ['#FFCE56', '#4BC0C0'],
        hoverBackgroundColor: ['#FFCE56', '#4BC0C0'],
      },
    ],
  };

  return (
    <div className="admin-board">
      <h1>Panneau d'administration</h1>
      <div className="admin-board-container">
        <div className="statistics-container">
          <div className="card">
            <h2>Statistiques des fichiers</h2>
            <Doughnut data={pieData} />
            <p>Total de fichiers : {statistics.files || 0}</p>
            <p>Fichiers ajoutés aujourd'hui : {statistics.today || 0}</p>
          </div>
          <div className="card">
            <h2>Utilisateurs & Moyenne de fichiers</h2>
            <Bar data={barData} />
          </div>
        </div>
        <div className="users-list-container card">
          <h2>Liste des utilisateurs</h2>
          <ul className="users-list">
            {users.map(user => (
              <li key={user.id} onClick={() => handleUserClick(user.id)} className="user-item">
                <span className="user-email">{user.email}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminBoard;