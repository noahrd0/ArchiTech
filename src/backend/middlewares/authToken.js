const jwt = require('jsonwebtoken');
require('dotenv').config();

function authToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.sendStatus(401);

    jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        // Vérifie si l'utilisateur est un admin
        if (req.user.role === 'admin') {
            return next(); // Permet l'accès à toutes les routes
        }
        next();
    });
}

module.exports = authToken;