const User = require('../models/userModel');
const bcrypt = require('bcrypt');

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
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
        await User.create({ email: email, password: hash });
        return res.status(201).json({ success: true, message: 'Utilisateur créé.'});
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Une erreur est survenue lors de la création de l\'utilisateur.' });
    }
};
