--! create
INSERT INTO followships
	(follower_id, followee_id)
	VALUES (:followerId, :followeeId);

--! delete
DELETE FROM followships
	WHERE follower_id= :followerId AND followee_id= :followeeId;

--! exists
SELECT 1 FROM followships
	WHERE follower_id= :followerId AND followee_id= :followeeId
	LIMIT 1;

--! getFollowers
SELECT follower_id FROM followships
	WHERE followee_id= :userId
	LIMIT :pageSize OFFSET :offset;

--! getFollowings
SELECT followee_id FROM followships
	WHERE follower_id= :userId
	LIMIT :pageSize OFFSET :offset;

--! getFollowshipCounts
SELECT
	(SELECT COUNT(*) FROM followships WHERE followee_id = :userId) AS follower_count,
	(SELECT COUNT(*) FROM followships WHERE follower_id = :userId) AS following_count;