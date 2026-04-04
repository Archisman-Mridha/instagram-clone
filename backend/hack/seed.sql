CREATE TABLE IF NOT EXISTS "users" (
  "id"       SERIAL                    PRIMARY KEY,
  "name"     CHARACTER VARYING(30)     NOT NULL,
  "username" CHARACTER VARYING(30)     NOT NULL,
  "email"    CHARACTER VARYING(254)    NOT NULL,
  "password" CHARACTER VARYING(200)    NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS "IDX_users_username" ON "users" ("username");
CREATE UNIQUE INDEX IF NOT EXISTS "IDX_users_email"    ON "users" ("email");

CREATE TABLE IF NOT EXISTS "profiles" (
  "id"       INTEGER                   PRIMARY KEY,
  "name"     CHARACTER VARYING(30)     NOT NULL,
  "username" CHARACTER VARYING(30)     NOT NULL,
  "bio"      CHARACTER VARYING(100)
);

CREATE UNIQUE INDEX IF NOT EXISTS "IDX_profiles_username" ON "profiles" ("username");

CREATE TABLE IF NOT EXISTS "posts" (
  "id"          SERIAL                  PRIMARY KEY,
  "authorID"    INTEGER                 NOT NULL,
  "imageURL"    TEXT                    NOT NULL,
  "description" CHARACTER VARYING(100)
);

CREATE INDEX IF NOT EXISTS "IDX_posts_authorID" ON "posts" ("authorID");

CREATE TABLE IF NOT EXISTS "followships" (
  "id"         INTEGER   PRIMARY KEY,
  "followerID" INTEGER   NOT NULL,
  "followeeID" INTEGER   NOT NULL
);

CREATE INDEX IF NOT EXISTS "IDX_followships_followerID" ON "followships" ("followerID");
CREATE INDEX IF NOT EXISTS "IDX_followships_followeeID" ON "followships" ("followeeID");


-- Users

INSERT INTO "users" ("id", "name", "username", "email", "password") VALUES
  (1, 'Alice Johnson', 'alice_johnson', 'alice.johnson92@gmail.com',  '$2b$10$rwHjztdtbEuY9hjnDCZgDek/olF6XB9cKTpboW3w/6fHoMq.0Eif2'),
  (2, 'Bob Martinez',  'bob_martinez',  'bob.martinez@outlook.com',   '$2b$10$rwHjztdtbEuY9hjnDCZgDek/olF6XB9cKTpboW3w/6fHoMq.0Eif2'),
  (3, 'Carol White',   'carol_white',   'carol.white88@yahoo.com',    '$2b$10$rwHjztdtbEuY9hjnDCZgDek/olF6XB9cKTpboW3w/6fHoMq.0Eif2'),
  (4, 'Dave Brown',    'dave_brown',    'dave.brown@protonmail.com',   '$2b$10$rwHjztdtbEuY9hjnDCZgDek/olF6XB9cKTpboW3w/6fHoMq.0Eif2'),
  (5, 'Eva Chen',      'eva_chen',      'eva.chen95@gmail.com',        '$2b$10$rwHjztdtbEuY9hjnDCZgDek/olF6XB9cKTpboW3w/6fHoMq.0Eif2')
ON CONFLICT DO NOTHING;

SELECT setval('users_id_seq', 5);


-- Profiles

INSERT INTO "profiles" ("id", "name", "username", "bio") VALUES
  (1, 'Alice Johnson', 'alice_johnson', 'Travel enthusiast and coffee lover'),
  (2, 'Bob Martinez',  'bob_martinez',  'Photographer | Nature lover'),
  (3, 'Carol White',   'carol_white',   'Foodie exploring one city at a time'),
  (4, 'Dave Brown',    'dave_brown',    'Software engineer by day, chef by night'),
  (5, 'Eva Chen',      'eva_chen',      'Artist and designer based in NYC')
ON CONFLICT DO NOTHING;


-- Posts

INSERT INTO "posts" ("id", "authorID", "imageURL", "description") VALUES
  -- Author : Alice.
  (1,  1, 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4', 'Morning hike at Yosemite Valley, sunrise was breathtaking'),
  (2,  1, 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085', 'Best flat white I have ever had in this little SF coffee shop'),
  (3,  1, 'https://images.unsplash.com/photo-1449034446853-66c86144b0ad', 'Pacific Coast Highway road trip vibes'),

  -- Author : Bob.
  (4,  2, 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e', 'Golden hour at the beach - no filter needed'),
  (5,  2, 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df', 'Street photography in downtown Chicago'),

  -- Author : Carol.
  (6,  3, 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601', 'Homemade pasta carbonara - took three attempts to nail it'),
  (7,  3, 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47', 'Best tacos in LA at this hidden gem spot'),
  (8,  3, 'https://images.unsplash.com/photo-1504674900247-0877df9cc836', 'Sunday brunch spread with the whole crew'),

  -- Author : Dave.
  (9,  4, 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73', 'Built my first sourdough starter. Day 5 and she is alive'),
  (10, 4, 'https://images.unsplash.com/photo-1513104890138-7c749659a591', 'Late night coding session with the best company - pizza'),

  -- Author : Eva.
  (11, 5, 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5', 'New painting finished this weekend, inspired by city lights'),
  (12, 5, 'https://images.unsplash.com/photo-1426604966848-d7adac402bff', 'Sketching in Central Park on a perfect autumn afternoon')
ON CONFLICT DO NOTHING;

SELECT setval('posts_id_seq', 12);

-- Followships

INSERT INTO "followships" ("id", "followerID", "followeeID") VALUES
  -- Alice
  (1,  1, 2), -- Bob
  (2,  1, 3), -- Carol
  (3,  1, 5), --Eva

  -- Bob
  (4,  2, 1), --Alice
  (5,  2, 4), -- Dave

  -- Carol
  (6,  3, 1), -- Alice
  (7,  3, 5), -- Eva

  -- Dave
  (8,  4, 2), --Bob
  (9,  4, 3), -- Carol

  -- Eva
  (10, 5, 1), -- Alice
  (11, 5, 3), -- Carol
  (12, 5, 4)  -- Dave
ON CONFLICT DO NOTHING;
