const express = require('express');
const router = express.Router();
const multer = require('multer');
const fileController = require('../controllers/fileController');

// Configuration de Multer pour stocker les fichiers en mémoire

const upload = multer({ storage: multer.memoryStorage() });

// Autres routes pour les opérations sur les fichiers (par exemple, récupérer tous les fichiers, supprimer un fichier, etc.)

router.post('/add', upload.single('file'), fileController.authenticator, fileController.fileAddPost);

router.get('/', fileController.getAll);

router.get('/add', fileController.fileAdd);

router.get('/delete/:id', fileController.fileDelete);

module.exports = router;
