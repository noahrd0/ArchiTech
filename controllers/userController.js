const User = require('../models/userModel');
const mailService = require('../services/mailService');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.showRegisterPage = function(req, res) {
    res.render('register');
};

exports.showLoginPage = function(req, res) {
    res.render('login');
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log(email, password);
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
