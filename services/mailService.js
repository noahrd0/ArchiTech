const nodemailer = require('nodemailer');
// require('dotenv').config();

const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'nicklaus.carter22@ethereal.email',
        pass: 'ExsVcazPG6vtzu2hXE'
    }
});

exports.sendMail = async function sendMail(email) {
    let info = await transporter.sendMail({
        from: '<nicklaus.carter22@ethereal.email>',
        to: email,
        subject: 'ArchiTech - Confirmation de création de compte',
        text: 'Votre compte a bien été créé.'
    });

    console.log('Message sent: %s', info.messageId);
}

exports.sendAdminNotification = async function sendAdminNotification(adminEmail, deletedUserEmail, numberOfDeletedFiles) {
    let info = await transporter.sendMail({
        from: '<nicklaus.carter22@ethereal.email>',
        to: adminEmail,
        subject: 'ArchiTech - Notification de suppression de compte utilisateur',
        text: `Le compte de l'utilisateur ${deletedUserEmail} a été supprimé. Nombre de fichiers supprimés : ${numberOfDeletedFiles}`
    });

    console.log('Admin notification sent: %s', info.messageId);
}

exports.sendUserDeletionNotification = async function sendUserDeletionNotification(userEmail) {
    let info = await transporter.sendMail({
        from: '<nicklaus.carter22@ethereal.email>',
        to: userEmail,
        subject: 'ArchiTech - Notification de suppression de compte',
        text: 'Votre compte a été supprimé avec succès.'
    });

    console.log('User deletion notification sent: %s', info.messageId);
}