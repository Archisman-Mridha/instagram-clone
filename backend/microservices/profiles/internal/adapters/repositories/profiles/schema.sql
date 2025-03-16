CREATE TABLE profiles (
	id INT PRIMARY KEY,
	name VARCHAR(25) NOT NULL,
	username VARCHAR(25) NOT NULL UNIQUE,
	profile_picture_uri VARCHAR(250)
);

CREATE INDEX username_idx_profiles ON profiles (username);
