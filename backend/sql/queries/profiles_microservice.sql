--! create
INSERT INTO profiles
  (id, name, username)
  VALUES (:id, :name, :username);

--! getProfilePreviews
SELECT name, username FROM profiles
  WHERE id= ANY(:ids);