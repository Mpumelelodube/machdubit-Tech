const mysql = require('mysql');

var host = 'localhost';
var user = 'root';
var password = "password"; 
var database = 'machdubit';

var mysqlConnection = mysql.createConnection({
    host,
    user,
    password,
    database,
    multipleStatements: true
});

mysqlConnection.connect((err) => {
    if(!err){
        console.log('connected');
    }else{
        throw err;
    }
});

module.exports = mysqlConnection;