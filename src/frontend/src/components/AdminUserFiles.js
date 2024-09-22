import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const UserFileList = () => {
    const { userId } = useParams(); // Récupérer l'ID de l'utilisateur depuis l'URL
    const [files, setFiles] = useState([]);
    const [files_details, setFiles_details] = useState([]);

    useEffect(() => {
        const fetchUserFiles = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error('No token found');
                }

                const response = await axios.get(`/api/admin/user/${userId}/files`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                setFiles(response.data);
                console.log(response.data);

                const detailsPromises = response.data.map(file =>
                    axios.get(`/api/file/${file.name}/${userId}`, {
                      headers: {
                        'Authorization': `Bearer ${token}`,
                      },
                    })
                  );
                  console.log(detailsPromises);

                  const detailsResponses = await Promise.all(detailsPromises);
                    setFiles_details(detailsResponses.map(res => res.data));
              } catch (error) {
                console.error('Error fetching user files:', error);
            }
        };

        fetchUserFiles();
    }, [userId]);

    return (
        <div>
            <h2>Fichiers de l'utilisateur {userId}</h2>
            {files.length === 0 ? (
                <p>Cet utilisateur n'a aucun fichier téléversé.</p>
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
        </div>
    );
};

export default UserFileList;
