const express = require('express');
const router = express.Router();
const multer = require('multer');
const fileController = require('../controllers/fileController');

// Configuration de Multer pour stocker les fichiers en mémoire
const upload = multer({ storage: multer.memoryStorage() });

router.get('/upload', fileController.showUploadPage);

router.post('/upload', upload.single('file'),fileController.authenticator, fileController.uploadFile);
// Autres routes pour les opérations sur les fichiers (par exemple, récupérer tous les fichiers, supprimer un fichier, etc.)

module.exports = router;
