// src/components/Home.js
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/list');
    } else {
      navigate('/connexion');
    }
  },);

  return null;
};

export default Home;
