## Database Autore-Libri

Le tabelle possono essere create usando il pannello admin. Se le tabelle non vengono create dare questi due comandi al db tramite sqlite3 da terminale linux una volta che nodejs ha creato il file :

```sql
CREATE TABLE Autori(ID_autore int,nome text,cognome text,primary key (ID_autore));
```

```sql
CREATE TABLE Libri(ID_libro int,titolo text,autore int,primary key (ID_libro),foreign key (autore) references Autori(ID_autore));
```
