CREATE DATABASE bad_project;
-- CREATE TABLE users(
--     id SERIAL primary key,
--     email VARCHAR(255) unique not null,
--     username VARCHAR(255) unique not null,
--     password VARCHAR(255) not null,
--     user_image VARCHAR(255),
--     is_admin BOOLEAN
-- );

CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    nickname VARCHAR(255) unique NOT NULL,
    email VARCHAR(255) unique NOT NULL,
    password VARCHAR(255) NOT NULL,
    is_admin BOOLEAN NOT NULL,
    created_at TIMESTAMP NOT NULL
);

CREATE TABLE posts(
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    created_at TIMESTAMP NOT NULL,
    caption VARCHAR(255),
    status VARCHAR(255) NOT NULL
);

CREATE TABLE likes(
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    post_id INTEGER NOT NULL,
    FOREIGN KEY (post_id) REFERENCES posts(id)
);

CREATE TABLE comments(
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    post_id INTEGER NOT NULL,
    FOREIGN KEY (post_id) REFERENCES posts(id),
    created_at TIMESTAMP NOT NULL,
    content VARCHAR(255) NOT NULL,
);

CREATE TABLE raw_images(
    id SERIAL PRIMARY KEY,
    image VARCHAR(255) NOT NULL,
    post_id INTEGER NOT NULL,
    FOREIGN KEY (post_id) REFERENCES posts(id),
);

CREATE TABLE converted_images(
    id SERIAL PRIMARY KEY,
    image VARCHAR(255) NOT NULL,
    post_id INTEGER NOT NULL,
    FOREIGN KEY (post_id) REFERENCES posts(id),
    raw_id INTEGER NOT NULL,
    FOREIGN KEY (raw_id) REFERENCES raw_images(id)
);