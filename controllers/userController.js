const User = require('../models/userModel');
const mailService = require('../services/mailService');
const bcrypt = require('bcrypt');

exports.showRegisterPage = function(req, res) {
    res.render('register');
};

exports.showLoginPage = function(req, res) {
    res.render('login');
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email: email } });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json('Email ou mot de passe incorrect.');
        }
        return res.status(200).json('Connexion réussie.');
    } catch (error) {
        return res.status(500).json('Une erreur est survenue lors de la connexion.');
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
        return res.status(201).json({ success: true, message: 'Utilisateur créé.'});
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Une erreur est survenue lors de la création de l\'utilisateur.' });
    }
};
