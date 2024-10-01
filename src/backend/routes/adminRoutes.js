const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

router.get('/list', adminController.list); 
router.get('/user/:id/files', adminController.get_user_files); 
router.get('/user/:id/storage', adminController.get_user_storage); 
router.get('/statistics', adminController.statistics);
router.get('/storage', adminController.storage);

module.exports = router;