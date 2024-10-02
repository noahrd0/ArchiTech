import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilePdf, faFile, faTrashAlt } from '@fortawesome/free-solid-svg-icons'; // Importer l'icône de suppression
import { useParams } from 'react-router-dom';

const UserFileList = () => {
    const { userId } = useParams();
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

                const detailsPromises = response.data.map(file =>
                    axios.get(`/api/file/${file.name}/${userId}`, {
                      headers: {
                        'Authorization': `Bearer ${token}`,
                      },
                    })
                  );

                  const detailsResponses = await Promise.all(detailsPromises);
                    setFiles_details(detailsResponses.map(res => res.data));
              } catch (error) {
                console.error('Error fetching user files:', error);
            }
        };

        fetchUserFiles();
    }, [userId]);

    return (
        <div className='file-list-container'>
            <h2>Fichiers de l'utilisateur {userId}</h2>
            {files.length === 0 ? (
                <p>Cet utilisateur n'a aucun fichier téléversé.</p>
            ) : (
                <div className='container-files'>
                    <div className="file-list">
                        {files.map((file, index) => (
                            <div key={file.uuid} className="file-item">
                            {file.name.endsWith('.pdf') ? (
                                <FontAwesomeIcon icon={faFilePdf} size="3x" />
                            ) : file.name.match(/\.(jpg|jpeg|png|gif)$/i) ? (
                                <img src={files_details[index]?.url} alt={file.name} width={100} height={100} style={{'object-fit': 'cover'}}/>
                            ) : (
                                <FontAwesomeIcon icon={faFile} size="3x" />
                            )}
                            <p>{file.name}</p>
                        </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserFileList;
