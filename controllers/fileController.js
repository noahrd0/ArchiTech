const File = require('../models/fileModel');
const User = require('../models/userModel')
const jwt = require('jsonwebtoken');

// Middlewares
exports.authenticator = async (req, res, next) => {
    const token = req.body.token ? req.body.token : req.headers.authorization;
    
    if (token) {
        try {
            let decoded = jwt.verify(token, process.env.SECRET_KEY);

            if (decoded) {

                const user  = await User.findOne({ where: { email: decoded.email } });

                if (!user) {
                    return res.status(401).json('Pas autorisé');
                }
                const userData = user.dataValues || user;

                req.user = {
                    email : userData.email,
                };
                next();
            }
        } catch (error) {
            return res.status(401).json("Unauthorized: Invalid token");
        }
    } else {
        return res.status(401).json("Unauthorized: Token not provided");
    }
};

exports.showUploadPage = function(req, res) {
    res.render('file');
};

exports.uploadFile = async (req, res) => {
    try {
        if (!req.file || !req.file.buffer) {
            return res.status(400).json({ message: 'No file uploaded.' });
        }

        const { originalname, buffer, mimetype } = req.file;

        // Enregistrez le fichier en base de données
        const newFile = await File.create({
            filename: originalname,
            data: buffer,
            mimetype: mimetype
        });

        return res.status(200).json({ message: 'File uploaded successfully.', fileId: newFile.id });
    } catch (error) {
        console.error('Error uploading file:', error);
        return res.status(500).json({ message: 'An error occurred while uploading file.' });
    }
};
