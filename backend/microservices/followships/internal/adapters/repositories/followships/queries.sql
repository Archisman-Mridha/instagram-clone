-- name: CreateFollowship :exec
INSERT
INTO
  followships (
    follower_id,
    followee_id
  )
VALUES
  (
    $1,
    $2
  );

-- name: DeleteFollowship :exec
DELETE
FROM
  followships
WHERE
  follower_id = $1 AND
  followee_id = $2;

-- name: GetFollowship :exec
SELECT 1
FROM
  followships
WHERE
  follower_id = $1 AND
  followee_id = $2
LIMIT 1;

-- name: GetFollowers :many
SELECT
  follower_id
FROM
  followships
WHERE
  followee_id = $1
LIMIT $2
OFFSET $3;

-- name: GetFollowings :many
SELECT
  followee_id
FROM
  followships
WHERE
  follower_id = $1
LIMIT $2
OFFSET $3;

-- name: GetFollowerAndFollowingCounts :one
SELECT
	(SELECT COUNT(*) FROM followships WHERE followships.followee_id = $1) AS follower_count,
	(SELECT COUNT(*) FROM followships WHERE followships.follower_id = $1) AS following_count;
