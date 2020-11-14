const { request, response } = require('express');
const express = require('express');
const app = express();
const mysqlConnection = require('./databaseConnection');
const upload = require('express-fileupload');
const port = process.env.PORT || 3000;
app.listen(port, () => console.log('listening at  3000'));
app.use(express.static('public'));
app.use(upload());    
app.use(express.json({limit: '5mb'}));

app.get('/get_all_products_index', (request, response) => {
    mysqlConnection.query('select * from products', (err, rows, fields) => {
        if(!err){
            //console.log(rows);
            var data = rows; 
            response.json(data);
        }else{
            throw err;
        }
    })
});