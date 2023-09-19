const express = require('express');
const app = express();
const mysql = require('mysql');
const bodyparse = require('body-parser');
const jsonParse = bodyparse.json();

const cors = require('cors');

app.use(cors());

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'clients'
});

connection.connect()

const port = 8080;

app.listen(port, () => console.log("Listen on: "+port));

app.get('/api/users', (req, res) => {
    connection.query('SELECT * FROM users', (err, rows, fields) => {
        if(err) throw err
        res.json(rows)
    });
});

app.post('/api/addUsers', jsonParse, (req, res) => {
    console.log(req.body)
    res.json({isaa: true})
});

app.get('/api/messages', (req, res) => {
    connection.query('SELECT * FROM messages', (err, rows, fields) => {
        if(err) throw err
        res.json(rows)
    });
});
