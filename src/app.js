const express = require('express');
const sequelize = require('./backend/config/database');
const app = express();
const cors = require('cors');
require('./backend/models/invoiceModel.js');
require('./backend/models/userModel.js');
require('./backend/models/fileModel.js');

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

const checkoutRoutes = require('./backend/routes/checkoutRoutes');
app.use('/api/checkout', authToken, checkoutRoutes);

// Middleware qui affiche les erreurs non gérées
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.listen(5000, () => {
    console.log('Server is running on port 5000 : http://127.0.0.1:5000');
    sequelize.sync({ alter: true })
        .then(() => {
            console.log('Database synchronized successfully.');
        })
        .catch((error) => {
            console.error('Error synchronizing the database:', error);
        });
});