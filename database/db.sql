DROP TABLE IF EXISTS movies;
CREATE TABLE movies (
  id           SERIAL,
  overview     TEXT           NOT NULL,
  release_date VARCHAR(255)   NOT NULL,
  runtime      INTEGER        NOT NULL,
  poster       VARCHAR(255)   NOT NULL,
  trailer      VARCHAR(50),
  moviedb_id   INTEGER UNIQUE NOT NULL,
  title        TEXT           NOT NULL,
  PRIMARY KEY (id)
);

DROP TABLE IF EXISTS genres;
CREATE TABLE genres (
  id   SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL
);

DROP TABLE IF EXISTS movies_genres;
CREATE TABLE movies_genres (
  movie_id INTEGER NOT NULL,
  genre_id INTEGER NOT NULL,
  FOREIGN KEY (movie_id) REFERENCES movies (id) ON DELETE CASCADE,
  FOREIGN KEY (genre_id) REFERENCES genres (id),
  UNIQUE (movie_id, genre_id)
);

DROP TABLE IF EXISTS casts;
CREATE TABLE casts (
  id         SERIAL,
  name       VARCHAR(255)   NOT NULL,
  imageurl   VARCHAR(255),
  moviedb_id INTEGER UNIQUE NOT NULL,
  PRIMARY KEY (id)
);

DROP TABLE IF EXISTS movies_casts;
CREATE TABLE movies_casts (
  movie_id  INTEGER      NOT NULL,
  cast_id   INTEGER      NOT NULL,
  character VARCHAR(500) NOT NULL,
  FOREIGN KEY (movie_id) REFERENCES movies (id) ON DELETE CASCADE,
  FOREIGN KEY (cast_id) REFERENCES casts (id) ON DELETE CASCADE,
  UNIQUE (movie_id, cast_id)
);

DROP TABLE IF EXISTS directors;
CREATE TABLE directors (
  id         SERIAL,
  name       VARCHAR(255)   NOT NULL,
  imageurl   VARCHAR(255),
  moviedb_id INTEGER UNIQUE NOT NULL,
  PRIMARY KEY (id)
);

DROP TABLE IF EXISTS movies_directors;
CREATE TABLE movies_directors (
  movie_id    INTEGER NOT NULL,
  director_id INTEGER NOT NULL,
  FOREIGN KEY (movie_id) REFERENCES movies (id) ON DELETE CASCADE,
  FOREIGN KEY (director_id) REFERENCES directors (id) ON DELETE CASCADE,
  UNIQUE (movie_id, director_id)
);

INSERT INTO genres (name) VALUES
  ('Action'),
  ('Adventure'),
  ('Animation'),
  ('Comedy'),
  ('Crime'),
  ('Disaster'),
  ('Documentary'),
  ('Drama'),
  ('Eastern'),
  ('Family'),
  ('Fan Film'),
  ('Fantasy'),
  ('Film Noir'),
  ('Foreign'),
  ('History'),
  ('Holiday'),
  ('Horror'),
  ('Indie'),
  ('Music'),
  ('Musical'),
  ('Mystery'),
  ('Neo-noir'),
  ('Road Movie'),
  ('Romance'),
  ('Science Fiction'),
  ('Short'),
  ('Sport'),
  ('Sporting Event'),
  ('Sports Film'),
  ('Suspense'),
  ('TV Movie'),
  ('Thriller'),
  ('War'),
  ('Western');

DROP TABLE IF EXISTS users;
CREATE TABLE users (
  id          SERIAL,
  firstname   VARCHAR(35),
  lastname    VARCHAR(35),
  username    VARCHAR(25)  NOT NULL UNIQUE,
  password    VARCHAR(100) NOT NULL,
  ssid        VARCHAR(20),
  datecreated TIMESTAMP    NOT NULL DEFAULT (NOW()),
  email       VARCHAR(254) NOT NULL UNIQUE,
  status      VARCHAR(8) NOT NULL DEFAULT 'pending',
  UNIQUE (username, email),
  PRIMARY KEY (id)
);

DROP TABLE IF EXISTS ratings;
CREATE TABLE ratings (
  username VARCHAR(25) NOT NULL,
  movie_id INTEGER     NOT NULL,
  rating   INTEGER     NOT NULL,
  FOREIGN KEY (username) REFERENCES users (username),
  FOREIGN KEY (movie_id) REFERENCES movies (id),
  UNIQUE (username, movie_id)
);

DROP TABLE IF EXISTS favourite_genres;
CREATE TABLE favourite_genres (
  genre_id INTEGER     NOT NULL,
  username VARCHAR(25) NOT NULL,
  FOREIGN KEY (username) REFERENCES users (username),
  FOREIGN KEY (genre_id) REFERENCES genres (id)
);