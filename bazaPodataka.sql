-- Koriscenje default baze podataka
USE DEFAULT_DB;

-- Kreiranje tabele za korisnike
CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    korisnickoIme VARCHAR(50) NOT NULL UNIQUE,
    uloga VARCHAR(10) NOT NULL,
    lozinka VARCHAR(500) NOT NULL,
    slike TEXT,
    brTelefona VARCHAR(20) UNIQUE,
    ime VARCHAR(20),
    prezime VARCHAR(20)
); 

CREATE TABLE IF NOT EXISTS messages (
	id INT PRIMARY KEY AUTO_INCREMENT,
    posiljalac VARCHAR(50) NOT NULL,
    primalac varchar(50),
    tekst VARCHAR(1000),
    stanje INT DEFAULT 1,
    FOREIGN KEY (posiljalac) REFERENCES users(korisnickoIme)
); 
