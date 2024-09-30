import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilePdf, faFile } from '@fortawesome/free-solid-svg-icons';
import './FileList.css';

const FileList = () => {
    const [files, setFiles] = useState([]);
    const [files_details, setFiles_details] = useState([]);
    const [loading, setLoading] = useState(true);
    const [file, setFile] = useState(null);
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const dropContainerRef = useRef(null);

    useEffect(() => {
        fetchFiles();

        const dropContainer = dropContainerRef.current;

        if (dropContainer) {
            const handleDragOver = (e) => {
                e.preventDefault();
                e.stopPropagation();
            };

            const handleDragEnter = (e) => {
                e.preventDefault();
                dropContainer.classList.add("drag-active");
            };

            const handleDragLeave = (e) => {
                e.preventDefault();
                dropContainer.classList.remove("drag-active");
            };

            const handleDrop = (e) => {
                e.preventDefault();
                dropContainer.classList.remove("drag-active");
                const droppedFiles = e.dataTransfer.files;
                if (droppedFiles.length > 0) {
                    setFile(droppedFiles[0]);
                    const fileInput = document.getElementById("images");
                    fileInput.files = droppedFiles;
                }
            };

            dropContainer.addEventListener("dragover", handleDragOver);
            dropContainer.addEventListener("dragenter", handleDragEnter);
            dropContainer.addEventListener("dragleave", handleDragLeave);
            dropContainer.addEventListener("drop", handleDrop);

            // Cleanup function
            return () => {
                dropContainer.removeEventListener("dragover", handleDragOver);
                dropContainer.removeEventListener("dragenter", handleDragEnter);
                dropContainer.removeEventListener("dragleave", handleDragLeave);
                dropContainer.removeEventListener("drop", handleDrop);
            };
        }
    }, []);

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

    const handleDownload = (url, fileName) => {
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleUpload = async () => {
        if (!file) {
            console.warn('No file selected');
            return; // Si aucun fichier n'est sélectionné, ne rien faire
        }

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
            setFile(null); // Réinitialiser le fichier après le téléversement
            setUploadSuccess(true); // Afficher le message de succès
            fetchFiles(); // Rafraîchir la liste des fichiers

            // Cacher le message après 3 secondes
            setTimeout(() => {
                setUploadSuccess(false);
            }, 3000);
        } catch (error) {
            console.error('Error uploading file:', error);
        }
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="file-list-container">
            {uploadSuccess && <div className="upload-message">Fichier téléversé avec succès !</div>}
            <div className='top-upload-section'>
                <h2>Mes Fichiers</h2>
            </div>
            {files.length === 0 ? (
                <p>Vous n'avez aucun fichier téléversé.</p>
            ) : (
              <div className='container-files'>
                <div className='upload-section'>
                  <label htmlFor="images" className="drop-container" ref={dropContainerRef}>
                          <span className="drop-title">Déposer des images ici</span>
                          ou
                          <input type="file" id="images" onChange={handleFileChange} />
                          <button className="upload-button" onClick={handleUpload}>Téléverser</button>
                  </label>
                </div>
                <div className="file-list">
                    {files.map((file, index) => (
                        <div key={file.uuid} className="file-item">
                            {file.name.endsWith('.pdf') ? (
                                <FontAwesomeIcon icon={faFilePdf} size="3x" />
                            ) : file.name.match(/\.(jpg|jpeg|png|gif)$/i) ? (
                                <img src={files_details[index]?.url} alt={file.name} width={100} height={100} style={{ objectFit: 'cover' }} />
                            ) : (
                                <FontAwesomeIcon icon={faFile} size="3x" />
                            )}
                            <p>{file.name}</p>
                            <button onClick={() => handleDownload(files_details[index]?.url, file.name)}>
                                Télécharger
                            </button>
                        </div>
                    ))}
                </div>
              </div>
            )}
        </div>
    );
};

export default FileList;
