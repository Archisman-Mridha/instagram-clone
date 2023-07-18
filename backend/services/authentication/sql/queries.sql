-- name: FindVerifiedUserWithEmail :one
SELECT * FROM users
  WHERE users.email= @email AND is_verified= TRUE
    LIMIT 1;

-- name: FindUserWithUsername :one
SELECT * FROM users
  WHERE users.username= @username
    LIMIT 1;

-- name: SaveUnverifiedUser :exec
WITH deleted_row AS (
  DELETE FROM users
    WHERE users.email= @email
)
  INSERT INTO users
    (email, username, password)
      VALUES (@email, @username, @password);

-- name: InsertMessage :exec
INSERT INTO outbox
  (message)
    VALUES (@message);