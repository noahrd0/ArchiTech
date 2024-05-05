const File = require('../models/fileModel');
const User = require('../models/userModel')
const jwt = require('jsonwebtoken');

// Middlewares
exports.authenticator = async (req, res, next) => {
    const token = req.body.token ? req.body.token : req.headers.authorization;
    
    if (token) {
        try {
            let decoded = jwt.verify(token, process.env.SECRET_KEY);

            if (decoded) {

                const user  = await User.findOne({ where: { email: decoded.email } });

                if (!user) {
                    return res.status(401).json({ message: 'Créer un compte pour accéder à cette fonctionnalité.', success: false });
                }
                const userData = user.dataValues || user;

                req.user = {
                    email : userData.email,
                };
                next();
            }
        } catch (error) {
            return res.status(401).json({ message: 'Une erreur s\'est produite avec votre compte, reconnectez-vous', success: false });
        }
    } else {
        return res.status(401).json({ message: 'Créer un compte pour accéder à cette fonctionnalité.', success: false });
    }
};

exports.showUploadPage = function(req, res) {
    res.render('file');
};

exports.showViewPage = function(req, res) {
    res.render('viewFile');
};

exports.uploadFile = async (req, res) => {
    try {
        if (!req.file || !req.file.buffer) {
            return res.status(400).json({ message: 'Veuillez sélectionner un fichier à télécharger.', success: false });
        }

        const { originalname, buffer, mimetype } = req.file;

        // Récupérer l'utilisateur à partir de req.user défini dans le middleware d'authentification
        const userEmail = req.user.email;

        // Récupérer l'ID de l'utilisateur à partir de son adresse e-mail
        const user = await User.findOne({ where: { email: userEmail } });
        const userId = user.id;


        // Enregistrez le fichier en base de données
        const newFile = await File.create({
            filename: originalname,
            data: buffer,
            mimetype: mimetype,
            uploadedBy: userId // Utiliser l'ID de l'utilisateur
        });

        return res.status(200).json({ fileId: newFile.id });
    } catch (error) {
        console.error('Error uploading file:', error);
        return res.status(500).json({ message: 'Une erreur s\'est produite lors du téléchargement du fichier.', success: false });
    }
};

exports.getUserFiles = async (req, res) => {
    try {
        // Récupérer l'utilisateur à partir de req.user défini dans le middleware d'authentification
        const userEmail = req.user.email;

        // Récupérer l'ID de l'utilisateur à partir de son adresse e-mail
        const user = await User.findOne({ where: { email: userEmail } });
        const userId = user.id;

        // Rechercher les fichiers téléchargés par cet utilisateur
        const userFiles = await File.findAll({ where: { uploadedBy: userId } });

        // Renvoyer les fichiers trouvés
        return res.status(200).json({ userFiles: userFiles });
    } catch (error) {
        return res.status(500).json({ message: 'Une erreur s\'est produite lors de la récupération des fichiers de l\'utilisateur.', success: false});
    }
};