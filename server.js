const express = require('express');
const cors = require('cors');
const session = require('express-session');
const app = express();
const sequelize = require('./database/database');
const user = require('./routes/userRoute');
const fileRoutes = require('./routes/fileRoute');
const middleware = require('./routes/validateToken');

app.set('view engine', 'ejs');
app.use(express.static('views'));

app.use(cors());
app.use(express.json());

app.use (
    session ({
        secret: "my secret key",
        saveUninitialized: true,
        resave: false,
    })
);

app.use((req,res, next) => {
    res.locals.message = req.session.message;
    delete req.session.message;
    next();
});

app.use('/user', user);
app.use('/files', fileRoutes)
app.use('/middleware', middleware);

app.get('/', (req, res) => {
    res.render('index');
});

app.listen(3000, () => {
    console.log('Server is running on port 3000 : http://localhost:3000');
    sequelize.sync();
});