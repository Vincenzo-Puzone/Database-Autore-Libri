# Database Autore-Libri

Le tabelle possono essere create usando il pannello admin. Se le tabelle non vengono create dare questi due comandi al db tramite sqlite3 da terminale linux una volta che nodejs ha creato il file :

```sql
CREATE TABLE Autori(ID_autore int,nome text,cognome text,primary key (ID_autore));
```

```sql
CREATE TABLE Libri(ID_libro int,titolo text,autore int,primary key (ID_libro),foreign key (autore) references Autori(ID_autore));
```
## License
The content of this project itself and  and the underlying source code used to format and display that content is licensed under the [The GNU General Public Lcense v3](https://www.gnu.org/licenses/gpl-3.0.html)
