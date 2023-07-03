-- name: FindVerifiedUserWithEmail :one
SELECT * FROM users
  WHERE users.email= @email AND is_verified= TRUE
    LIMIT 1;

-- name: SaveUnverifiedUser :one
INSERT INTO users
  (name, email)
    VALUES (@name, @email)
      RETURNING id;