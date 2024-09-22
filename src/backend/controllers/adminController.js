const { Op } = require('sequelize');
const User = require('../models/userModel');
const File = require('../models/fileModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();

exports.list = async (req, res) => {
    try {
        const users = await User.findAll();
        res.status(200).json(users);
    } catch (err) {
        res.status(400).json(err);
    }
}

exports.get_user_files = async (req, res) => {
    try {
        const userId = req.params.id; // Récupérer l'ID de l'utilisateur
        const files = await File.findAll({ where: { user_id: userId } }); // Récupérer les fichiers de cet utilisateur
        if (!files.length) {
            return res.status(404).json({ message: 'Aucun fichier trouvé pour cet utilisateur.' });
        }
        res.status(200).json(files); // Retourner la liste des fichiers
    } catch (err) {
        res.status(400).json(err);
    }
};



exports.get_user_storage = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }
        // A changer en ajoutant le champ storage dans la table User
        res.status(200).json({ storage: 0 });
    } catch (err) {
        res.status(400).json(err);
    }
}

exports.statistics = async (req, res) => {
    try {
        const users = await User.count();
        const files = await File.count();
        const date = new Date();
        date.setHours(0, 0, 0, 0);
        const today = await File.count({ where: {
            createdAt: {
                [Op.gte]: date
            }
        } });
        res.status(200).json({ users, files, today, by_user: files/users, date: new Date() });
    } catch (err) {
        res.status(400).json(err);
    }
}