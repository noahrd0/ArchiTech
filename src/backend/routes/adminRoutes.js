const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authToken  = require('../middlewares/authToken'); // Ajuster l'import

router.get('/list', authToken, adminController.list); 
router.get('/user/:id/files', authToken, adminController.get_user_files); 
router.get('/user/:id/storage', authToken, adminController.get_user_storage); 
router.get('/statistics', authToken, adminController.statistics);

module.exports = router;