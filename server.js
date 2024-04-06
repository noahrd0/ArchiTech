const express = require('express');

const cors = require('cors');

const app = express();
const sequelize = require('./database/database');

const user = require('./routes/userRoute');

app.use(express.static('public'));
app.use(cors());
app.use(express.json());

app.use('/user', user);

app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the application.' });
});

app.listen(3000, () => {
    console.log('Server is running on port 3000 : http://localhost:3000');
    sequelize.sync();
});