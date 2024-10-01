const nodemailer = require('nodemailer');

// Fonction pour envoyer un email
const sendEmail = async (to, subject, text) => {
    try {
        const transporter = nodemailer.createTransport({
            host: 'smtp-relay.sendinblue.com',
            port: 587, // ou 465 pour SSL
            secure: false, // true pour port 465, false pour le port 587
            auth: {
                user: process.env.SENDINBLUE_USER, // Ton adresse email ou identifiant Sendinblue
                pass: process.env.SENDINBLUE_API_KEY, // Ta clé API Sendinblue
            },
        });

        const mailOptions = {
            from: process.env.SENDINBLUE_EMAIL, // Ton adresse email
            to,
            subject,
            text,
        };

        await transporter.sendMail(mailOptions);
        console.log(`Email envoyé à ${to}`);
    } catch (error) {
        console.error('Erreur lors de l\'envoi de l\'email:', error);
    }
};

module.exports = sendEmail;
