import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append('file', file);

    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No token found');
        }

        const response = await axios.post('/api/file/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${token}`,
            },
        });

        console.log('File uploaded:', response.data.file);
        navigate('/list');
    } catch (error) {
        console.error('Error uploading file:', error);
    }
};

  return (
    <div>
      <h2>Téléverser un fichier</h2>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Téléverser</button>
    </div>
  );
};

export default FileUpload;
