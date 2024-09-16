const User = require('../models/userModel');
const File = require('../models/fileModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();
const { s3Client } = require('../config/aws');
const { DeleteObjectCommand } = require('@aws-sdk/client-s3');

async function passwordHasher(password) {
    // const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
    // if (!passwordRegex.test(password)) {
    //     return res.status(400).json({ message: 'Le mot de passe doit contenir au moins 8 caractères, une lettre majuscule, une lettre minuscule et un chiffre' });
    // }

    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
}

exports.register = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'Email et mot de passe obligatoires' });
        }

        const userExist = await User.findOne({ where: { email } });
        if (userExist) {
            return res.status(400).json({ message: 'Email déjà utilisé' });
        }

        const user = await User.create({ email, password: await passwordHasher(password) });
        res.status(201).json(user);
    } catch (err) {
        res.status(400).json(err);
    }
}

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({ message: 'Email ou mot de passe incorrect' });
        } else {
            const token = jwt.sign({ id: user.id }, process.env.SECRET_KEY, { expiresIn: '1h' });
            res.status(200).json({ user, token });
        }
    } catch (err) {
        res.status(400).json(err);
    }
}

exports.buy_storage = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        } else {
            user.storage += 1000000;
            await user.save();
            res.status(200).json(user);
        }
    }
    catch (err) {
        res.status(400).json(err);
    }
}

exports.list = async (req, res) => {
    try {
        const users = await User.findAll();
        res.status(200).json(users);
    } catch (err) {
        res.status(400).json(err);
    }
}

exports.get = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }
        res.status(200).json(user);
    } catch (err) {
        res.status(400).json(err);
    }
}

exports.delete = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }

        const files = await File.findAll({ where: { user_id: user.id } });
        for (const file of files) {
            const deleteObjectParams = {
                Bucket: bucketName, // Assurez-vous que bucketName est défini
                Key: file.uuid
            };
            await s3Client.send(new DeleteObjectCommand(deleteObjectParams));
            await file.destroy();
        }

        await user.destroy();
        res.status(200).json({ message: 'Utilisateur et ses fichiers supprimés' });
    } catch (err) {
        res.status(400).json(err);
    }
};

exports.update = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }
        if (req.body.password) {
            req.body.password = await passwordHasher(req.body.password);
        }
        await user.update(req.body);
        res.status(200).json(user);
    } catch (err) {
        res.status(400).json(err);
    }
}