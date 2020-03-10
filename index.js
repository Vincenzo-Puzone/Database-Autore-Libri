const express = require('express');
const morgan = require('morgan');
const path = require('path');
const bodyParser = require('body-parser');    
const moment = require('moment');
const favicon = require('serve-favicon');
const sqlite3 = require('sqlite3');
moment.locale('it');

app = express();

app.set('views',path.join(__dirname,"views"));
app.set('view engine', 'ejs');
app.use(favicon(path.join(__dirname,'public','favicon.ico')));
app.use('/css', express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use( morgan('dev') );

const db = new sqlite3.Database('./test.db',()=>{
    app.listen(8080);
    console.log('Server running on http://localhost:8080');
    console.log('database open')
});

app.get('/',(req,res)=>{
    sql='select * from Autori INNER JOIN Libri ON id_autore=autore';
    db.all(sql,(err,rows)=>{
        res.render('index',{rows})
    });
});

app.use((req,res)=>{
    res.status(404);
    res.sendFile(path.join(__dirname,'public','404.html'));
});