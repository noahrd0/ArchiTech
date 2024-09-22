const express = require('express');
const router = express.Router();
const fileController = require('../controllers/fileController');
const multer = require('multer');

// Pour envoyer directement les fichiers au serveur sans les stocker sur le disque
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// 'file' doit correspondre au nom du champ de type file dans le formulaire
// <input type="file" name="file">
// upload.single('file');

router.post('/upload', upload.single('file'), fileController.upload);
router.get('/list', fileController.list);
router.get('/:file_name', fileController.get);
router.get('/:file_name/:user_id', fileController.getAdmin);
router.get('/download/:file_name', fileController.download);
router.delete('/:file_name', fileController.delete);
router.put('/:file_name', upload.single('file'), fileController.update);


module.exports = router;