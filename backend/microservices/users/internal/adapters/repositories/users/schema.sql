CREATE TABLE users (
	id SERIAL PRIMARY KEY,
	name VARCHAR(25) NOT NULL,
	email VARCHAR(320) NOT NULL UNIQUE,
	username VARCHAR(25) NOT NULL UNIQUE,
	password VARCHAR(100) NOT NULL
);

CREATE INDEX email_idx_users ON users (email);

CREATE INDEX username_idx_users ON users (username);
