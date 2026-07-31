-- atlas:txmode none
--
-- NOTE : 'atlas migrate apply' wraps each migration file in a transaction. But,
--        CREATE INDEX CONCURRENTLY cannot run inside a transaction block. That directive opts this
--        file out of that transaction.

-- NOTE : Adding a unique constraint will automatically create a unique B-tree index on the column
--        or group of columns listed in the constraint.

CREATE TABLE users (
  id SERIAL PRIMARY KEY,

  name VARCHAR(30) NOT NULL,
  email VARCHAR(320) NOT NULL UNIQUE,
  username VARCHAR(30) NOT NULL UNIQUE,
  password VARCHAR(200) NOT NULL -- hashed
);

CREATE TABLE profiles (
  id INTEGER PRIMARY KEY,

  name VARCHAR(30) NOT NULL,
  username VARCHAR(30) NOT NULL UNIQUE
);

CREATE TABLE followships (
  id SERIAL,

  follower_id INTEGER NOT NULL,
  followee_id INTEGER NOT NULL
);

-- Creating an index can interfere with regular operation of a database. Normally PostgreSQL locks
-- the table to be indexed against writes and performs the entire index build with a single scan of
-- the table. Other transactions can still read the table, but if they try to insert, update, or
-- delete rows in the table they will block until the index build is finished. This could have a
-- severe effect if the system is a live production database. Very large tables can take many hours
-- to be indexed, and even for smaller tables, an index build can lock out writers for periods that
-- are unacceptably long for a production system.
--
-- PostgreSQL supports building indexes without locking out writes. This method is invoked by
-- specifying the CONCURRENTLY option of CREATE INDEX. When this option is used, PostgreSQL must
-- perform two scans of the table, and in addition it must wait for all existing transactions that
-- could potentially modify or use the index to terminate. Thus this method requires more total
-- work than a standard index build and takes significantly longer to complete. However, since it
-- allows normal operations to continue while the index is built, this method is useful for adding
-- new indexes in a production environment. Of course, the extra CPU and I/O load imposed by the
-- index creation might slow other operations.
--
-- In a concurrent index build, the index is actually entered as an “invalid” index into the system
-- catalogs in one transaction, then two table scans occur in two more transactions. Before each
-- table scan, the index build must wait for existing transactions that have modified the table to
-- terminate. After the second scan, the index build must wait for any transactions that have a
-- snapshot (see Chapter 13) predating the second scan to terminate, including transactions used by
-- any phase of concurrent index builds on other tables, if the indexes involved are partial or
-- have columns that are not simple column references. Then finally the index can be marked “valid”
-- and ready for use, and the CREATE INDEX command terminates. Even then, however, the index may
-- not be immediately usable for queries: in the worst case, it cannot be used as long as
-- transactions exist that predate the start of the index build.
--
-- If a problem arises while scanning the table, such as a deadlock or a uniqueness violation in a
-- unique index, the CREATE INDEX command will fail but leave behind an “invalid” index. This index
-- will be ignored for querying purposes because it might be incomplete; however it will still
-- consume update overhead.  The recommended recovery method in such cases is to drop the index and
-- try again to perform CREATE INDEX CONCURRENTLY. 
--
-- Regular index builds permit other regular index builds on the same table to occur
-- simultaneously, but only one concurrent index build can occur on a table at a time. In either
-- case, schema modification of the table is not allowed while the index is being built. Another
-- difference is that a regular CREATE INDEX command can be performed within a transaction block,
-- but CREATE INDEX CONCURRENTLY cannot.
CREATE INDEX CONCURRENTLY followers_index ON followships (follower_id, followee_id);
CREATE INDEX CONCURRENTLY followees_index ON followships (followee_id, follower_id);

CREATE TABLE posts (
  id SERIAL PRIMARY KEY,

  author_id INTEGER NOT NULL,

  description VARCHAR(150) NOT NULL
);

CREATE INDEX CONCURRENTLY author_posts_index ON posts (author_id);

CREATE TABLE feeds (
  id SERIAL,

  consumer_id INTEGER NOT NULL,

  post_id INTEGER NOT NULL,
  post_author_id INTEGER NOT NULL,
  post_created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  UNIQUE (consumer_id, post_id)
);

CREATE INDEX CONCURRENTLY consumer_feed_posts_index ON feeds (consumer_id, post_created_at);
