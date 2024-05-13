const jwt = require('jsonwebtoken');

exports.validateToken = async (req, res) => {

    // Récupérer le jeton d'authentification de l'en-tête Authorization
    const token = req.headers.authorization;

    // console.log(token);
    if (!token) {
        return res.status(401).json({ message: 'Aucun jeton d\'authentification fourni.', success: false });
    }

    try {
        // Vérifier et décoder le jeton
        let decoded = jwt.verify(token, process.env.SECRET_KEY);

        // Si le jeton est valide, répondre avec un succès
        return res.status(200).json({ message: 'Le jeton d\'authentification est valide.', success: true });
    } catch (error) {
        // Si le jeton est invalide ou expiré, répondre avec une erreur
        return res.status(401).json({ message: 'Le jeton d\'authentification est invalide ou expiré.', success: false });
    }
};