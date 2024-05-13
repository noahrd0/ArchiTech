const express = require('express');
const router = express.Router();
const middleware = require('../middleware/validateToken.js');

// Middleware de validation du token d'authentification
router.post('/validateToken', middleware.validateToken);

module.exports = router;
