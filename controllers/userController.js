const User = require('../models/userModel');
const bcrypt = require('bcrypt');

exports.register = async (req, res) => {
    try {
        const { email, password } = req.body;

    const existingUser = await User.findOne({ 
        where: { email: email } });

    if (existingUser) {
      return res.status(400).json({ error: 'Erreur : email déjà utilisé' });
    }

    // Hash du mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Création de l'utilisateur
    const newUser = await User.create({
      email,
      password: hashedPassword,
    });
    res.status(201).json('Inscription réussie.');
    } catch (error) {
        res.status(500).json('Une erreur est survenue lors de l\'inscription.');
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email: email } });
        if (!user || user.password !== password) {
            return res.status(401).json('Email ou mot de passe incorrect.');
        }
        return res.status(200).json('Connexion réussie.');
    } catch (error) {
        return res.status(500).json('Une erreur est survenue lors de la connexion.');
    }
};
