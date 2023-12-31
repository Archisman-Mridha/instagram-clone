-- Users Microservice
CREATE TABLE users (
  id SERIAL PRIMARY KEY,

  name VARCHAR(25) NOT NULL,
  email VARCHAR(320) NOT NULL UNIQUE,
  username VARCHAR(25) NOT NULL UNIQUE,

  password VARCHAR(100) NOT NULL
);
CREATE INDEX email_idx_users ON users (email);
CREATE INDEX username_idx_users ON users (username);

-- Profiles Microservice
CREATE TABLE profiles (
  id INT PRIMARY KEY,

  name VARCHAR(25) NOT NULL,
  username VARCHAR(25) NOT NULL UNIQUE,

  profile_picture_uri VARCHAR(250)
);
CREATE INDEX username_idx_profiles ON profiles (username);

-- Followships Microservice
CREATE TABLE followships (
	follower_id INT,
	followee_id INT
);
CREATE INDEX follower_id_idx_followships ON followships (follower_id, followee_id);
CREATE INDEX followee_id_idx_followships ON followships (followee_id, follower_id);