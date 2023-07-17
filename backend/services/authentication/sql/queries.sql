-- name: FindVerifiedUserWithEmail :one
SELECT * FROM users
  WHERE users.email= @email AND is_verified= TRUE
    LIMIT 1;

-- name: SaveUnverifiedUser :one
INSERT INTO users
  (email)
    VALUES (@email)
      RETURNING id;

-- name: InsertMessage :exec
INSERT INTO outbox
  (message)
    VALUES (@message);