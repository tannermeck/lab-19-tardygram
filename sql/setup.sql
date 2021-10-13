DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS grams;
DROP TABLE IF EXISTS tags;
DROP TABLE IF EXISTS gram_tag;

CREATE TABLE users (
  github_name TEXT NOT NULL PRIMARY KEY,
  github_avatar_url TEXT NOT NULL
);

CREATE TABLE grams (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  username TEXT NOT NULL,
  photo_url TEXT NOT NULL,
  caption TEXT,
  FOREIGN KEY(username) REFERENCES users(github_name)
);

CREATE TABLE tags (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  tags TEXT NOT NULL,
);

CREATE TABLE gram_tag (
  grams_id BIGINT NOT NULL,
  tags_id BIGINT NOT NULL
);