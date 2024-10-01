const { Op, Sequelize } = require('sequelize');
const User = require('../models/userModel');
const File = require('../models/fileModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { use } = require('../routes/userRoutes');
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

exports.storage = async (req, res) => {
    try {
        const storage = [];
        const users = await User.findAll();
        for (const user of users) {
            const user_storage_available = user.storage / (1024 * 1024 * 1024);
            let user_storage_used = 0;
            let user_storage_percentage = 0;
            const files = await File.findAll({ where: { user_id: user.id } });
            for (const file of files) {
                user_storage_used += file.size;
            }
            user_storage_used = user_storage_used / (1024 * 1024 * 1024);
            if (user_storage_available === 0) {
                user_storage_percentage = 100;
            } else {
                user_storage_percentage = (user_storage_used / user_storage_available) * 100;
            }
            storage.push({
                user_id: user.id,
                storage_available: user_storage_available.toFixed(2),
                storage_used: user_storage_used.toFixed(2),
                storage_percentage: user_storage_percentage.toFixed(2)
            });
        }
        res.status(200).json(storage);
    } catch (err) {
        res.status(400).json(err);
    }
};

exports.statistics = async (req, res) => {
    try {
        // Statistique 1 : Nombre total d'utilisateurs
        const totalUsers = await User.count();
        
        // Statistique 2 : Nombre total de fichiers
        const totalFiles = await File.count();
        
        // Statistique 3 : Nombre de fichiers téléversés aujourd'hui
        const today = new Date();
        today.setHours(0, 0, 0, 0);  // Mettre l'heure à minuit pour le début de la journée
        const filesToday = await File.count({
            where: {
                createdAt: {
                    [Op.gte]: today
                }
            }
        });
        
        // Statistique 4 : Nombre moyen de fichiers par utilisateur
        const filesPerUser = totalUsers ? (totalFiles / totalUsers).toFixed(2) : 0;
        
        // Statistique 5 : Nombre d'administrateurs
        const adminCount = await User.count({
            where: { role: 'admin' }
        });
        

        // Envoyer les résultats
        res.status(200).json({
            totalUsers,          // Nombre total d'utilisateurs
            totalFiles,          // Nombre total de fichiers
            filesToday,          // Nombre de fichiers téléversés aujourd'hui
            filesPerUser,        // Nombre moyen de fichiers par utilisateur
            adminCount,          // Nombre d'administrateurs
        });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};