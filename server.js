const express = require('express');
const app = express();
const cors = require('cors');
const sequelize = require('./database/database');

const user = require('./routes/userRoute');

app.use(cors());
app.use(express.json());

app.use('/user', user);

app.listen(3000, () => {
    console.log('Server is running on port 3000 : http://localhost:3000');
    sequelize.sync();
});