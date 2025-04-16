CREATE TABLE posts (
	id SERIAL PRIMARY KEY,
	owner_id INT NOT NULL,
	description VARCHAR(255) NOT NULL,
	created_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE INDEX owner_id_idx_posts ON posts (owner_id, created_at DESC);
