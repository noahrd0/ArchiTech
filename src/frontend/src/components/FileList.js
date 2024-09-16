import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const FileList = () => {
    const [files, setFiles] = useState([]);
    const [files_details, setFiles_details] = useState([]);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      const fetchFiles = async () => {
        try {
          const token = localStorage.getItem('token');
          if (!token) {
            throw new Error('No token found');
          }
  
          const response = await axios.get('/api/file/list', {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
  
          setFiles(response.data);
  
          const detailsPromises = response.data.map(file =>
            axios.get(`/api/file/${file.name}`, {
              headers: {
                'Authorization': `Bearer ${token}`,
              },
            })
          );
  
          const detailsResponses = await Promise.all(detailsPromises);
          setFiles_details(detailsResponses.map(res => res.data));
  
          setLoading(false);
        } catch (error) {
          console.error('Error fetching files:', error);
        }
      };
  
      fetchFiles();
    }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Mes Fichiers</h2>
      {files.length === 0 ? (
        <p>Vous n'avez aucun fichier téléversé.</p>
      ) : (
        <div className="file-list">
          {files.map((file, index) => (
            <div key={file.uuid} className="file-item">
              <img src={files_details[index]?.url} alt={file.name} width={100} height={100} style={{'object-fit': 'cover'}}/>
              <p>{file.name}</p>
            </div>
          ))}
        </div>
      )}
      <Link to="/upload">Téléverser un nouveau fichier</Link>
    </div>
  );
};

export default FileList;
