import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilePdf, faFile, faTrashAlt } from '@fortawesome/free-solid-svg-icons'; // Importer l'icône de suppression
import './FileList.css';
import { set } from 'date-fns';

const FileList = () => {
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [file, setFile] = useState(null);
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const [uploadError, setUploadError] = useState(false);
    const [storageError, setStorageError] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOption, setSortOption] = useState('date');
    const [selectedFormat, setSelectedFormat] = useState('all');
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

            const filesWithDetails = await Promise.all(response.data.map(async (file) => {
                const detailResponse = await axios.get(`/api/file/${file.name}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                return { ...file, details: detailResponse.data };
            }));

            setFiles(filesWithDetails);
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
            return;
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
            console.log('response.status', response.status);

            setFile(null);
            setUploadSuccess(true);
            fetchFiles();

            setTimeout(() => {
                setUploadSuccess(false);
            }, 3000);
        } catch (error) {
            if (error.response && error.response.status === 507) {
                setStorageError(true);
                setTimeout(() => {
                    setStorageError(false);
                }, 3000);
            } else {
                setUploadError(true);
                setTimeout(() => {
                    setUploadError(false);
                }, 3000);
            }
            console.error('Error uploading file:', error);
        }
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    // Fonction de suppression d'un fichier
    const handleDelete = async (file_name) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No token found');
            }

            await axios.delete(`/api/file/${file_name}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            // Mettre à jour la liste des fichiers après suppression
            setFiles((prevFiles) => prevFiles.filter((file) => file.uuid !== file_name));
        } catch (error) {
            console.error('Error deleting file:', error);
        }
    };

    const sortFiles = (files) => {
        switch (sortOption) {
            case 'size':
                return [...files].sort((a, b) => b.size - a.size);
            case 'name':
                return [...files].sort((a, b) => a.name.localeCompare(b.name));
            case 'date':
            default:
                return [...files].sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate));
        }
    };

    const filteredFiles = files
        .filter(file => file.name.toLowerCase().includes(searchTerm.toLowerCase()))
        .filter(file => selectedFormat === 'all' || file.name.endsWith(`.${selectedFormat}`));

    const handleFormatChange = (e) => {
        setSelectedFormat(e.target.value);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="file-list-container">
            {uploadSuccess && <div className="upload-message">Fichier téléversé avec succès !</div>}
            {uploadError && <div className="error-message">Erreur lors du téléversement du fichier.</div>}
            {storageError && <div className="error-message">Stockage insuffisant.</div>}
            <div className='top-upload-section'>
                <h2>Mes Fichiers</h2>
                <div className="search-container">
                    <input
                        type="text"
                        placeholder="Rechercher un fichier..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <select onChange={handleFormatChange} value={selectedFormat}>
                        <option value="all">Tous les formats</option>
                        <option value="pdf">PDF</option>
                        <option value="jpg">JPG</option>
                        <option value="jpeg">JPEG</option>
                        <option value="png">PNG</option>
                        <option value="gif">GIF</option>
                    </select>
                    <select id="sort" value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
                        <option value="date">Date d'upload</option>
                        <option value="size">Poids</option>
                        <option value="name">Nom</option>
                    </select>
                </div>
            </div>
            {filteredFiles.length === 0 ? (
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
                        {sortFiles(filteredFiles).map((file, index) => (
                            <div key={file.uuid} className="file-item">
                                {file.name.endsWith('.pdf') ? (
                                    <FontAwesomeIcon icon={faFilePdf} size="3x" />
                                ) : file.name.match(/\.(jpg|jpeg|png|gif)$/i) ? (
                                    <img src={file.details.url} alt={file.name} width={100} height={100} style={{ objectFit: 'cover' }} />
                                ) : (
                                    <FontAwesomeIcon icon={faFile} size="3x" />
                                )}
                                <p>{file.name}</p>
                                <button className="file-list-download-button" onClick={() => handleDownload(file.details.url, file.name)}>
                                    Télécharger
                                </button>
                                {/* Bouton de suppression */}
                                <button className="file-list-delete-button" onClick={() => handleDelete(file.uuid)}>
                                    <FontAwesomeIcon icon={faTrashAlt} /> Supprimer
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