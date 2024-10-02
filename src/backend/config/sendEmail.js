const nodemailer = require('nodemailer');

// Fonction pour envoyer un email
const sendEmail = async (to, subject, text) => {
    try {
        const transporter = nodemailer.createTransport({
            host: 'smtp-relay.sendinblue.com',
            port: 587, 
            secure: false, 
            auth: {
                user: process.env.SENDINBLUE_USER, 
                pass: process.env.SENDINBLUE_API_KEY, 
            },
        });
        const mailOptions = {
            from: process.env.SENDINBLUE_EMAIL,
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
