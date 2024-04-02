const express = require('express');
const router = express.Router();
const User = require('../controllers/userController');

router.get('/', User.findAll);

module.exports = router;