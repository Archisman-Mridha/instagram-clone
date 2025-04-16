-- name: CreatePost :one
INSERT INTO posts
	(owner_id, description)
VALUES
	($1, $2)
RETURNING id;

-- name: GetPostsOfUser :many
SELECT
	id,
	description,
	created_at
FROM
	posts
WHERE
	owner_id = $1
LIMIT
	$2 OFFSET $3;

-- name: GetPosts :many
SELECT
	id,
	owner_id,
	description,
	created_at
FROM
	posts
WHERE
	id = ANY($1)
ORDER BY
	created_at DESC;
