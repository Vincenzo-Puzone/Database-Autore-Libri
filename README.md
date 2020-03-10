## INITIAL RELEASE

Dare questi due comandi al db tramite sqlite3 da terminale linux una volta che nodejs ha creato il file .db :

CREATE TABLE Autori(ID int,nome text,cognome text,primary key (ID)';

CREATE TABLE Libri(ID int,titolo text,id_autore int,primary key (ID),foreign key (id_autore) references Autori(ID)';