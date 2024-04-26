const express = require('express');

const cors = require('cors');

const app = express();
const sequelize = require('./database/database');

const user = require('./routes/userRoute');
const fileRoutes = require('./routes/fileRoute');

const multer = require('multer');

// Set up storage for uploaded files
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + '-' + file.originalname);
    }
  });
const upload = multer({ storage });

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(cors());
app.use(express.json());

app.use('/user', user);
app.use('/files', fileRoutes);

app.post('/api/uploads', upload.single('file'), (req, res) => {
    res.send('Upload good');
})

app.get('/', (req, res) => {
    res.render('index');
});

app.listen(3000, () => {
    console.log('Server is running on port 3000 : http://localhost:3000');
    sequelize.sync();
});