const User = require('../models/userModel');
const File = require('../models/fileModel');
const mailService = require('../services/mailService');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.showRegisterPage = function(req, res) {
    res.render('register');
};

exports.showLoginPage = function(req, res) {
    res.render('login');
};

// Middlewares
exports.authenticator = async (req, res, next) => {
    const token = req.body.token ? req.body.token : req.headers.authorization;
    console.log(token);
    
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

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email: email } });
        
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: 'Adresse email ou mot de passe incorrect.', success: false});
        }

        // Générez le token JWT et renvoyez-le en réponse
        const token = jwt.sign({ email }, process.env.SECRET_KEY, { expiresIn: "1h" });
        
        // Envoie uniquement le token comme réponse
        res.json({token, message: 'Connexion réussie.', success: true});
    } catch (error) {
        return res.status(500).json({ message: 'Une erreur est survenue lors de la connexion.', success: false});
    }
};

exports.register = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email: email } });
        if (user) {
            return res.status(400).json({ message: 'Cette adresse email est déjà utilisée.' });
        }
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(password)) {
            return res.status(400).json({ message: 'Le mot de passe doit contenir au moins une minuscule, une majuscule, un chiffre, un caractère spécial et avoir une longueur minimale de 8 caractères.' });
        }
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        await User.create({ email: email, password: hash });

        mailService.sendMail(email);

        // Génération et envoie JWT Token
        const token = jwt.sign({email}, process.env.SECRET_KEY ,{ expiresIn: '1h'})
        res.json({token, message: 'Utilisateur créé avec succès.', success: true});
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Une erreur est survenue lors de la création de l\'utilisateur.' });
    }
};

exports.deleteUser = async (req, res) => {
    
    const userEmail = req.user.email;
    const user = await User.findOne({ where: { email: userEmail } });
    const userId = user.id;

    try {
        // Trouver les fichiers associés à l'utilisateur
        const numberOfDeletedFiles = await File.destroy({ where: { uploadedBy: userId } });

        // Supprimer l'utilisateur (les fichiers seront supprimés en cascade)
        await User.destroy({ where: { id: userId } });  

        // Envoyer l'email de notification à l'utilisateur
        await mailService.sendMail(user.email, 'Suppression de compte', 'Votre compte a été supprimé avec succès.');

        // Envoyer l'email de notification à l'administrateur
        const adminEmail = 'admin@example.com'; // Remplacez par l'email de l'administrateur
        await mailService.sendAdminNotification(adminEmail, user.email, numberOfDeletedFiles);

        // Rediriger avec un message de succès si l'opération s'est déroulée avec succès
        req.session.message = {
            type: 'success',
            message: 'Utilisateur et fichiers associés supprimés avec succès.'
        };

        res.status(200).json({ message: 'Utilisateur et fichiers associés supprimés avec succès.', success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Une erreur est survenue lors de la suppression de l\'utilisateur.', success: false });
    }
};