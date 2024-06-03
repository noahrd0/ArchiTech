const express = require('express');
const sequelize = require('./config/database');
const app = express();

// const multer = require('multer');

// // Pour envoyer directement les fichiers au serveur sans les stocker sur le disque
// const storage = multer.memoryStorage();
// const upload = multer({ storage: storage });

// // 'file' doit correspondre au nom du champ de type file dans le formulaire
// // <input type="file" name="file">
// upload.single('file');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const authToken = require('./middlewares/authToken');

const userRoutes = require('./routes/userRoutes');
app.use('/api/user', userRoutes);

const fileRoutes = require('./routes/fileRoutes');
app.use('/api/file', authToken, fileRoutes);

// Middleware qui affiche les erreurs non gérées
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.listen(3000, () => {
    console.log('Server is running on port 3000 : http://localhost:3000');
    sequelize.sync();
});