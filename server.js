const express = require('express');

const cors = require('cors');

const app = express();
const sequelize = require('./database/database');

const user = require('./routes/userRoute');
const fileRoutes = require('./routes/fileRoute');

app.set('view engine', 'ejs');
app.use(express.static('views'));

app.use(cors());
app.use(express.json());

app.use('/user', user);
app.use('/files', fileRoutes);

app.get('/', (req, res) => {
    res.render('index');
});

app.listen(3000, () => {
    console.log('Server is running on port 3000 : http://localhost:3000');
    sequelize.sync();
});