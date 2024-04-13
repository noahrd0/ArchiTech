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