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
    app.listen(8081);
    console.log('Server running on http://localhost:8081');
    console.log('database open')
});

app.get('/',(req,res)=>{
    sqlA='select * from Autori';
    sqlL='select * from Libri';
    db.all(sqlA,(err,aRows)=>{
        db.all(sqlL,(err,lRows)=>{
            res.render("admin",{aRows,lRows});
        });
    });
});

app.get('/modifica/autore/:id',(req,res)=>{
    sqlA=`select * from Autori where id = ${req.params.id}`;
    db.each(sqlA,(err,aRow)=>{
        res.render('modAutori',{autore:aRow});
    });
});

app.post('/modautore',(req,res)=>{
    const id=parseInt(req.body.id);
    sql=`UPDATE Autori SET nome='${req.body.nome}',cognome='${req.body.cognome}' WHERE Autori.id = ${id}`;
    db.run(sql)
    res.redirect("/");
});

app.post('/addautore',(req,res)=>{
    const id=parseInt(req.body.id);
    let sql = `INSERT INTO Autori(id,nome,cognome) VALUES(${id},'${req.body.nome}','${req.body.cognome}')`;
    console.log(sql)
    db.run(sql);
    res.redirect('/');
});

app.post('/delautori',(req,res)=>{
    const id=parseInt(req.body.id);
    let sql = `DELETE FROM Autori WHERE Autori.id=${id}`;
    db.run(sql)
    res.redirect('/');
});

app.get('/modifica/libro/:id',(req,res)=>{
    sql=`select * from Libri where id = ${req.params.id}`;
    db.each(sql,(err,row)=>{
        sqlA='select * from Autori';
        db.all(sqlA,(err,aRows)=>{
            res.render('modLibri',{libro:row,aRows});
        });
    });
});

app.post('/modlibro',(req,res)=>{
    const id=parseInt(req.body.id);
    const id_autore=parseInt(req.body.id_autore);
    sql=`UPDATE Libri SET titolo='${req.body.titolo}', id_autore=${id_autore} WHERE Libri.id = ${id}`;
    db.run(sql)
    res.redirect("/");
});

app.post('/addlibri',(req,res)=>{
    const id_autore=parseInt(req.body.id_autore);
    const id=parseInt(req.body.id);
    let sql = `INSERT INTO Libri(id,titolo,id_autore) VALUES(${id},'${req.body.titolo}','${id_autore}')`;
    db.run(sql);
    res.redirect('/');
});

app.post('/dellibri',(req,res)=>{
    const id=parseInt(req.body.id);
    let sql = `DELETE FROM Libri WHERE Libri.id=${id}`;
    db.run(sql)
    res.redirect('/');
});

app.use((req,res)=>{
    res.status(404);
    res.sendFile(path.join(__dirname,'public','404.html'));
});