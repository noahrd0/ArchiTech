const File = require('../models/fileModel');

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
