const express = require('express');
const morgan = require('morgan');
const path = require('path');
const bodyParser = require('body-parser');
const favicon = require('serve-favicon');
const sqlite3 = require('sqlite3');

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
    sql='select * from Autori';
    db.all(sql,(err,rows)=>{
        autori=rows;
        sql='select * from Libri';
        db.all(sql,(err,rows)=>{
            libri=rows
            res.render('admin',{autori,libri})
        });
    });
});

app.post('/creadb',(req,res)=>{
    sql1='CREATE TABLE Autori(ID_autore int,nome text,cognome text,primary key (ID_autore))'
    db.run(sql1,(err)=>{
        if (err) res.status(500).sendFile(path.join(__dirname,'public','dbtables.html'));
        else {
            sql2='CREATE TABLE Libri(ID_libro int,titolo text,autore int,primary key (ID_libro),foreign key (autore) references Autori(ID_autore))'
            db.run(sql2,(err)=>{
                if (err) res.status(500).sendFile(path.join(__dirname,'public','dbtables.html'));
                else res.redirect('/');
            });
        }
    });
});

app.post('/addautore',(req,res)=>{
    const id=parseInt(req.body.id_autore);
    let sql = `INSERT INTO Autori(id_autore,nome,cognome) VALUES(${id},'${req.body.nome}','${req.body.cognome}')`;
    db.run(sql,(err)=>{
        if (err) res.status(500).sendFile(path.join(__dirname,'public','dberror.html'));
        else res.redirect('/');
    });
});

app.get('/modifica/autore/:ID_autore',(req,res)=>{
    sqlA=`select * from Autori where id_autore = ${req.params.ID_autore}`;
    db.each(sqlA,(err,aRow)=>{
        res.render('modAutori',{autore:aRow});
    });
});

app.post('/modautore',(req,res)=>{
    const id=parseInt(req.body.ID_autore);
    sql=`UPDATE Autori SET nome='${req.body.nome}',cognome='${req.body.cognome}' WHERE Autori.id_autore = ${id}`;
    db.run(sql)
    res.redirect("/");
});

app.post('/delautori',(req,res)=>{
    const id=parseInt(req.body.id_autore);
    let sql = `DELETE FROM Autori WHERE Autori.id_autore=${id}`;
    db.run(sql)
    res.redirect('/');
});

app.post('/addlibri',(req,res)=>{
    const autore=parseInt(req.body.autore);
    const id=parseInt(req.body.id_libro);
    let sql = `INSERT INTO Libri(id_libro,titolo,autore) VALUES(${id},'${req.body.titolo}','${autore}')`;
    db.run(sql,(err)=>{
        if (err) res.status(500).sendFile(path.join(__dirname,'public','dberror.html'));
        else res.redirect('/');
    });
});

app.get('/modifica/libro/:id',(req,res)=>{
    sql=`select * from Libri where id_libro = ${req.params.id}`;
    db.each(sql,(err,row)=>{
        sqlA='select * from Autori';
        db.all(sqlA,(err,aRows)=>{
            res.render('modLibri',{libro:row,aRows});
        });
    });
});

app.post('/modlibro',(req,res)=>{
    const id=parseInt(req.body.ID_libro);
    const autore=parseInt(req.body.autore);
    sql=`UPDATE Libri SET titolo='${req.body.titolo}', autore=${autore} WHERE Libri.id_libro = ${id}`;
    db.run(sql)
    res.redirect("/");
});

app.post('/dellibri',(req,res)=>{
    const id=parseInt(req.body.id_libro);
    let sql = `DELETE FROM Libri WHERE Libri.id_libro=${id}`;
    db.run(sql)
    res.redirect('/');
});

app.use((req,res)=>{
    res.status(404);
    res.sendFile(path.join(__dirname,'public','404.html'));
});