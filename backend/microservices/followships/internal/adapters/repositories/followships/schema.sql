CREATE TABLE followships (
  id INT PRIMARY KEY,
	follower_id INT NOT NULL,
	followee_id INT NOT NULL,
	UNIQUE (follower_id, followee_id)
);

CREATE INDEX follower_id_idx_followships ON followships (follower_id, followee_id);

CREATE INDEX followee_id_idx_followships ON followships (followee_id, follower_id);
