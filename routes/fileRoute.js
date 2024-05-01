const express = require('express');
const router = express.Router();
const multer = require('multer');
const fileController = require('../controllers/fileController');

// Configuration de Multer pour stocker les fichiers en mémoire
const upload = multer({ storage: multer.memoryStorage() });

router.get('/upload', fileController.showUploadPage);
router.get('/view', fileController.showViewPage);


router.post('/upload', upload.single('file'),fileController.authenticator, fileController.uploadFile);
router.post('/view', fileController.authenticator, fileController.getUserFiles);
// Autres routes pour les opérations sur les fichiers (par exemple, récupérer tous les fichiers, supprimer un fichier, etc.)

module.exports = router;
