import React, { useEffect, useState } from 'react';

const Files = () => {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');

    fetch('/api/file/list', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          setFiles(data.files);
        } else {
          console.log('Failed to fetch files');
        }
      })
      .catch(error => console.error('Error:', error));
  }, []);

  return (
    <div>
      <h2>Mes fichiers</h2>
      <ul>
        {files.map(file => (
          <li key={file.id}>{file.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default Files;
