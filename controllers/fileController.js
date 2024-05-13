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

exports.fileAddPost = async (req, res) => {
    try {
        console.log(req.file);

        const { originalname, buffer, mimetype } = req.file;

        // Récupérer l'utilisateur à partir de req.user défini dans le middleware d'authentification
        const userEmail = req.user.email;

        // Récupérer l'ID de l'utilisateur à partir de son adresse e-mail
        const user = await User.findOne({ where: { email: userEmail } });
        const userId = user.id;

        // // Enregistrez le fichier en base de données
        await File.create({
            filename: originalname,
            data: buffer,
            mimetype: mimetype,
            uploadedBy: userId
        });

        // Rediriger avec un message de succès si l'opération s'est déroulée avec succès
        req.session.message = {
            type: 'success',
            message: 'Fichier ajouté avec succès'
        };
        res.json({message: 'Connexion réussie.', success: true});
        // res.redirect('/files');
    } catch (error) {
        // Gérer les erreurs s'il y a eu des problèmes lors de l'ajout du fichier
        console.error('Error adding file:', error);
        res.json({ message: error.message, type: 'danger' });
    }
};

exports.getAll = async (req, res) => {
    try {
        // Récupérer tous les enregistrements de la table File
        const images = await File.findAll();

        // Rendre la page testejs avec la liste des fichiers récupérée
        res.render('viewFiles', {
            title: 'Home page',
            images:images,
        });
    } catch (error) {
        // Gérer les erreurs s'il y a eu des problèmes lors de la récupération des fichiers
        console.error('Error fetching files:', error);
        res.json({ message: error.message });
    }
};

exports.fileAdd = async (req, res) => {
    res.render("add_users", {
        title: "Add Users"
    });
};

exports.fileDelete = async (req, res) => {
    try {
        let id = req.params.id;

        // Recherchez le fichier à supprimer dans la base de données
        const fileToDelete = await File.findByPk(id);

        if (!fileToDelete) {
            return res.status(404).json({ message: 'File not found' });
        }

        // Supprimez le fichier de la base de données
        await fileToDelete.destroy();

        // Envoyez une réponse de succès si le fichier a été supprimé avec succès
        req.session.message = {
            type: 'info',
            message: 'File deleted successfully'
        };
        res.redirect("/files");

    } catch (error) {
        console.error('Error deleting file:', error);
        res.status(500).json({ message: 'An error occurred while deleting the file' });
    }
};
