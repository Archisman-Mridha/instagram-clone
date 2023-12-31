--! create
INSERT INTO users
  (name, email, username, password)
  VALUES (:name, :email, :username, :password)
  RETURNING id;

--! findByEmail
SELECT id, password FROM users
  WHERE email= :email LIMIT 1;

--! findByUsername
SELECT id, password FROM users
  WHERE username= :username LIMIT 1;

--! findById
SELECT id, password FROM users
  WHERE id= :id LIMIT 1;