CREATE DATABASE bad_project;
CREATE TABLE users(
    id SERIAL primary key,
    email VARCHAR(255) unique not null,
    username VARCHAR(255) unique not null,
    password VARCHAR(255) not null,
    user_image VARCHAR(255),
    is_admin BOOLEAN
);