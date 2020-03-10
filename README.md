## INITIAL RELEASE

Dare questi due comandi al db tramite sqlite3 da terminale linux una volta che nodejs ha creato il file .db :

```sql
CREATE TABLE Autori(ID_autore int,nome text,cognome text,primary key (ID_autore));
```

```sql
CREATE TABLE Libri(ID_libro int,titolo text,autore int,primary key (ID_libro),foreign key (autore) references Autori(ID_autore));
```