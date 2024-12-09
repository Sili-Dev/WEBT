CREATE DATABASE bugs_db;

USE bugs_db;

CREATE TABLE bugs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    description TEXT NOT NULL,
    severity INT NOT NULL,
    date VARCHAR(10) NOT NULL,
    username VARCHAR(50) NOT NULL
);
