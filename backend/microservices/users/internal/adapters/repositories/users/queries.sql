-- name: CreateUser :one
INSERT INTO users
  (name, email, username, password)
  VALUES ($1, $2, $3, $4)
  RETURNING id;

-- name: FindUserByEmail :one
SELECT id, password FROM users
  WHERE email= $1
  LIMIT 1;

-- name: FindUserByUsername :one
SELECT id, password FROM users
  WHERE username= $1
  LIMIT 1;

-- name: FindUserByID :one
SELECT id FROM users
  WHERE id= $1
  LIMIT 1;
