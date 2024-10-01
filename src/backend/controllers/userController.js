const User = require('../models/userModel');
const File = require('../models/fileModel');
const Invoice = require('../models/invoiceModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const sendEmail = require('../config/sendEmail');
const nodemailer = require('nodemailer');
require('dotenv').config();
// const { s3Client } = require('../config/aws');
const { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');

// Paramètres de configuration pour AWS S3
const bucketName = process.env.BUCKET_NAME;
const bucketRegion = process.env.AWS_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

const s3Client = new S3Client({
    region: bucketRegion,
    credentials: {
        accessKeyId,
        secretAccessKey
    }
});
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

async function passwordHasher(password) {
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
    if (!passwordRegex.test(password)) {
        return res.status(400).json({ message: 'Le mot de passe doit contenir au moins 8 caractères, une lettre majuscule, une lettre minuscule et un chiffre' });
    }

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

        const user = await User.create({ email, password: await passwordHasher(password)});

        // Envoyer un email de bienvenue
        await sendEmail(
            user.email,
            'Bienvenue sur notre site',
            `Bonjour ${user.email},\n\nMerci de vous être inscrit sur notre site !\nNous espérons que vous apprécierez votre expérience.\n\nCordialement,\nL'équipe d'Architech`
        );

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
        }

        const token = jwt.sign(
            { id: user.id},
            process.env.SECRET_KEY, 
            { expiresIn: '1h' }
        );

        res.status(200).json({ user, token });
    } catch (err) {
        res.status(400).json(err);
    }
};


exports.add_storage = async (req, res) => {
    try {
        const { session_id } = req.body;
        if (!session_id) {
            return res.status(400).json({ error: 'No session_id provided' });
        }
        const user = await User.findByPk(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        } else {
            const session = await stripe.checkout.sessions.retrieve(session_id);

            // On bloque l'ajout de stockage si une facture avec cette session existe déjà
            const existingInvoice = await Invoice.findOne({ where: { stripe_session_id: session_id } });
            if (existingInvoice) {
                return res.status(400).json({ message: 'Une facture avec cette session existe déjà' });
            }
            if (session.payment_status === 'paid') {
                user.storage += 20 * 1024 * 1024 * 1024; // 20Go en octets
                await user.save();

                // Creation de la facture
                const date = new Date();
                const invoice = await Invoice.create({ user_id: user.id, date, stripe_session_id: session_id });
                if (!invoice) {
                    return res.status(500).json({ error: 'Failed to create invoice' });
                }

                res.status(200);
            } else {
                res.status(400).json({ message: 'Echec du paiement' });
            }
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
                Bucket: bucketName,
                Key: file.uuid
            };
            await s3Client.send(new DeleteObjectCommand(deleteObjectParams));
            await file.destroy();
        }

        await sendEmail(
            user.email,
            'Suppression de votre compte',
            `Bonjour,\n\nVotre compte a été supprimé avec succès. Si vous pensez que cela est une erreur, veuillez nous contacter.\n\nCordialement,\nL'équipe d'Architech`
        );

        const admins = await User.findAll({ where: { role: 'admin' } });
        const adminEmails = admins.map(admin => admin.email);

        const adminEmailPromises = adminEmails.map(email => 
            sendEmail(
                email,
                'Suppression de compte',
                `Bonjour,\n\nL'utilisateur ${user.email} a supprimé son compte.\n\nCordialement,\nL'équipe du site`
            )
        );

        await Promise.all(adminEmailPromises);
        await user.destroy();

        res.status(200).json({ message: 'Utilisateur et ses fichiers supprimés' });
    } catch (err) {
        res.status(400).json({ error: 'Erreur lors de la suppression de l\'utilisateur', details: err.message });
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