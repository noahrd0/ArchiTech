const { Op, Sequelize } = require('sequelize');
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
        
        // Statistique 6 : Utilisateur avec le plus de fichiers
        const topUser = await User.findOne({
            attributes: ['id', 'email'],
            include: [{
                model: File,
                attributes: [[sequelize.fn('COUNT', sequelize.col('files.id')), 'fileCount']]
            }],
            group: ['User.id'],
            order: [[sequelize.literal('fileCount'), 'DESC']],
            limit: 1
        });

        // Envoyer les résultats
        res.status(200).json({
            totalUsers,          // Nombre total d'utilisateurs
            totalFiles,          // Nombre total de fichiers
            filesToday,          // Nombre de fichiers téléversés aujourd'hui
            filesPerUser,        // Nombre moyen de fichiers par utilisateur
            adminCount,          // Nombre d'administrateurs
            topUser: topUser ? topUser.email : 'Aucun utilisateur trouvé' // Utilisateur avec le plus de fichiers
        });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};