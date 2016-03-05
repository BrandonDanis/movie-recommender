DROP TABLE movies;
CREATE TABLE movies (
  id serial,
  overview text NOT NULL,
  release_date varchar(255) NOT NULL,
  runtime integer NOT NULL,
  poster varchar(255) NOT NULL,
  rating integer,
  moviedb_id integer UNIQUE NOT NULL,
  title text NOT NULL,
  PRIMARY KEY(id)
);

DROP TABLE genres;
CREATE TABLE genres (
  id serial PRIMARY KEY,
  name varchar(255) NOT NULL
);

DROP TABLE movies_genres;
CREATE TABLE movies_genres (
    movie_id integer NOT NULL,
    genre_id integer NOT NULL,
    FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE CASCADE,
    FOREIGN KEY (genre_id) REFERENCES genres(id)
);

DROP TABLE movies_casts;
CREATE TABLE movies_casts (
	movie_id integer NOT NULL,
	cast_id integer NOT NULL,
    character varchar(255) NOT NULL,
	FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE CASCADE,
    FOREIGN KEY (cast_id) REFERENCES casts(id) ON DELETE CASCADE
);

DROP TABLE casts;
CREATE TABLE casts (
	id serial,
	name varchar(255) NOT NULL,
    imageurl varchar(255),
    moviedb_id integer UNIQUE NOT NULL,
	PRIMARY KEY (id)
);

DROP TABLE movies_directors;
CREATE TABLE movies_directors (
	movie_id integer NOT NULL,
	director_id integer NOT NULL,
	FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE CASCADE,
    FOREIGN KEY (director_id) REFERENCES directors(id) ON DELETE CASCADE
);

DROP TABLE directors;
--moviedb_id is the director ID from MovieDB
CREATE TABLE directors (
	id serial,
	name varchar(255) NOT NULL,
    imageurl varchar(255),
    moviedb_id integer UNIQUE NOT NULL,
	PRIMARY KEY(id)
);

--populating genres
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
('Erotic'),
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


--users
DROP TABLE users;
CREATE TABLE users (
    id serial,
    username VARCHAR(25) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    ssid VARCHAR(20),
    datecreated TIMESTAMP NOT NULL DEFAULT(NOW()),
    PRIMARY KEY(id)
);
