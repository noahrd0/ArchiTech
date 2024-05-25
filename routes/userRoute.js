const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController.js');

router.get('/register', userController.showRegisterPage);
router.get('/login', userController.showLoginPage);

router.post('/register', userController.register);
router.post('/login', userController.login);

router.delete('/delete',userController.authenticator ,userController.deleteUser);

module.exports = router;