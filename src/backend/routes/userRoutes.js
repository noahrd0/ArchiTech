const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authToken = require('../middlewares/authToken');

router.post('/register', userController.register);
router.post('/login', userController.login);
router.post('/add_storage', authToken, userController.add_storage);
router.get('/list', userController.list);
router.get('/:id', userController.get);
router.delete('/:id', userController.delete);
router.put('/:id', userController.update);

module.exports = router;