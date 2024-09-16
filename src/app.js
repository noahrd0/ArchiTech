const express = require('express');
const sequelize = require('./backend/config/database');
const app = express();
const cors = require('cors');

// const multer = require('multer');

// // Pour envoyer directement les fichiers au serveur sans les stocker sur le disque
// const storage = multer.memoryStorage();
// const upload = multer({ storage: storage });

// // 'file' doit correspondre au nom du champ de type file dans le formulaire
// // <input type="file" name="file">
// upload.single('file');

app.use(cors()); 

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const authToken = require('./backend/middlewares/authToken');

const userRoutes = require('./backend/routes/userRoutes');
app.use('/api/user', userRoutes);

const fileRoutes = require('./backend/routes/fileRoutes');
app.use('/api/file', authToken, fileRoutes);

const adminRoutes = require('./backend/routes/adminRoutes');
app.use('/api/admin', authToken, adminRoutes);

// Middleware qui affiche les erreurs non gérées
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.listen(5000, () => {
    console.log('Server is running on port 5000 : http://127.0.0.1:5000');
    sequelize.sync();
});