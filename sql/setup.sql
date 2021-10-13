DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS grams CASCADE;
DROP TABLE IF EXISTS tags;
DROP TABLE IF EXISTS comments;


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
  tag TEXT NOT NULL,
  grams_id BIGINT NOT NULL,
  FOREIGN KEY (grams_id) references grams(id) ON DELETE CASCADE
);

CREATE TABLE comments (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  comment TEXT NOT NULL,
  username TEXT NOT NULL,
  grams_id BIGINT NOT NULL,
  FOREIGN KEY (grams_id) references grams(id),
  FOREIGN KEY (username) references users(github_name)
)
