-- Koriscenje default baze podataka
USE DEFAULT_DB;

-- Kreiranje tabele za korisnike
CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    korisnickoIme VARCHAR(50) NOT NULL UNIQUE,
    uloga VARCHAR(10) NOT NULL,
    lozinka VARCHAR(500) NOT NULL
); 