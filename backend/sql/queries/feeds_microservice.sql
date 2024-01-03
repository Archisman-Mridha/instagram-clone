--! getAllFollowers
SELECT follower_id FROM followships
	WHERE followee_id= :userId;