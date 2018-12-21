const express = require('express');
// var path = require('path');
// var cookieParser = require('cookie-parser');
const mysql = require('mysql');
const mysqlPassword = require('./mysqlPassword');

let connection;
function createMysqlConnection(user, password, db) {
    connection = mysql.createConnection({
        host: 'localhost',
        user: user,
        password: password,
        database: db
    });

    connection.connect(function(err) {
        if(!err) {
            return true;
        } else {
            return false;
        }
    });
}

let app = express();

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'ejs');

app.listen(process.env.PORT || 3000, () => {});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.send('1');
});

app.get('/numbers', (req, res) => {
    res.json([{
        id: 1,
        number: '1'
    }, {
        id: 2,
        number: '2'
    }, {
        id: 3,
        number: '3'
    }]);
});

app.get('/productsdata', (req, res) => {
    createMysqlConnection('root', mysqlPassword, 'ShopProducts');
    connection.query(
        'SELECT * FROM ShopProducts',
        (err, rows, fields) => {
            connection.end();
            if(!err) {
                res.json(rows);
                return true;
            } else {
                return false;
            }
        }
    );
});

