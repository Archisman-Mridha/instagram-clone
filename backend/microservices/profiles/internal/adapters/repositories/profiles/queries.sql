-- name: CreateProfile :exec
INSERT INTO profiles
  (id, name, username)
  VALUES ($1, $2, $3);

-- name: GetProfilePreviews :many
SELECT id, name, username FROM profiles
  WHERE id= ANY($1::int[]);
