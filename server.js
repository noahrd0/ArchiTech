const express = require('express')
const app = express()

app.get('/', (req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write('<h1>Hello World!</h1>');
});

app.get('/page1', (req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write('<h1>Hello!</h1>');
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});