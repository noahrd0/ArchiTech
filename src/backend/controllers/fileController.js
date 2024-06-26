const File = require('../models/fileModel');
const dotenv = require('dotenv');
const { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const { v4: uuidv4 } = require('uuid');
const e = require('express');

dotenv.config();

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

exports.upload = async (req, res) => {
    try {
        user_id = req.user.id;
        const uuid = uuidv4();

        const file = await File.create({
            uuid: uuid,
            name: req.file.originalname,
            size: req.file.size,
            type: req.file.mimetype,
            user_id: user_id
        })

        const putObjectParams = {
            Bucket: bucketName,
            Key: uuid,
            Body: req.file.buffer,
            ContentType: req.file.mimetype
        };
        try {
            await s3Client.send(new PutObjectCommand(putObjectParams));
        } catch (err) {
            // Si l'enregistrement AWS S3 échoue, supprimer l'enregistrement de la base de données
            await File.deleteOne({ uuid: uuid });
            throw err;
        }
        
        res.status(201).json({ message: 'Fichier enregistré', file, aws_file});
    } catch (err) {
        res.status(400).json({ message: err.message, stack: err.stack });
    }
}

exports.list = async (req, res) => {
    try {
        user_id = req.user.id;
        const files = await File.findAll({ where: { user_id } });
        res.status(200).json(files);
    } catch (err) {
        res.status(400).json(err);
    }
}


exports.get = async (req, res) => {
    try {
        user_id = req.user.id;
        const file = await File.findOne({ where: { name: req.params.file_name, user_id } });
        if (!file) {
            return res.status(404).json({ message: 'Fichier non trouvé' });
        } else {
            const getObjectParams = {
                Bucket: bucketName,
                Key: file.uuid
            };
            const url = await getSignedUrl(s3Client, new GetObjectCommand(getObjectParams), { expiresIn: 3600 });
            res.status(200).json({url: url, file: file});
        }
    } catch (err) {
        res.status(400).json(err);
    }
}

exports.download = async (req, res) => {
    try {
        user_id = req.user.id;
        const file = await File.findOne({ where: { name: req.params.file_name, user_id } });
        if (!file) {
            return res.status(404).json({ message: 'Fichier non trouvé' });
        } else {}
        // res.download(`uploads/${file.name}`);
        res.status(200).json({ message: 'Téléchargement du fichier', file });
    } catch (err) {
        res.status(400).json(err);
    }
}

exports.delete = async (req, res) => {
    try {
        user_id = req.user.id;
        const file = await File.findOne({ where: { name: req.params.file_name, user_id } });
        if (!file) {
            return res.status(404).json({ message: 'Fichier non trouvé' });
        } else {
            const deleteObjectParams = {
                Bucket: bucketName,
                Key: file.uuid
            };
            await s3Client.send(new DeleteObjectCommand(deleteObjectParams));
            await file.destroy();
            res.status(200).json({ message: 'Fichier supprimé' });
        }
    } catch (err) {
        res.status(400).json(err);
    }
}

exports.update = async (req, res) => {
    try {
        user_id = req.user.id;
        const file = await File.findOne({ where: { name: req.params.file_name, user_id } });
        if (!file) {
            return res.status(404).json({ message: 'Fichier non trouvé' });
        } else {

            const aws_file = new PutObjectCommand({
                Bucket: bucketName,
                Key: file.uuid,
                Body: req.file.buffer,
                ContentType: req.file.mimetype,
            });
            await file.update(req.body);
            try {
                await s3Client.send(aws_file);
            } catch (err) {
                throw err;
            }
            res.status(200).json(file);
        }
    } catch (err) {
        res.status(400).json(err);
    }
}
