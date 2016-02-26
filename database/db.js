DROP TABLE movies;
CREATE TABLE movies (
  id serial,
  overview text NOT NULL,
  release_date varchar(255) NOT NULL,
  runtime integer NOT NULL,
  poster varchar(255) NOT NULL,
  rating integer NOT NULL,
  title text NOT NULL,
  PRIMARY KEY(id)
);

DROP TABLE genres;
CREATE TABLE genres (
  id serial PRIMARY KEY,
  name varchar(255) NOT NULL
);

//populating
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
('TV movie'),
('Thriller'),
('War'),
('Western');

//relationship table for movies and genres
DROP TABLE movies_genres;
CREATE TABLE movies_genres (
    movie_id integer NOT NULL,
    genre_id integer NOT NULL,
    FOREIGN KEY (movie_id) ELEMENT REFERENCES movies(id),
    FOREIGN KEY (genre_id) ELEMENT REFERENCES genres(id)
);

DROP TABLE cast;
CREATE TABLE cast (
	id serial,
	movie_id integer NOT NULL,
	name varchar(255) NOT NULL,
	character_name varchar(255) NUT NULL,
	PRIMARY KEY (id),
	FOREIGN KEY (movie_id) REFERENCES movies(id)
);

DROP TABLE movies_directors;
CREATE TABLE movies_directors (
	movie_id integer NOT NULL,
	director_id integer NOT NULL,
	FOREIGN KEY (movie_id) ELEMENT REFERENCES movies(id),
    FOREIGN KEY (director_id) ELEMENT REFERENCES directors(id)
);

DROP TABLE directors;
CREATE TABLE directors (
	id serial,
	name varchar(255) NOT NULL,
	PRIMARY KEY(id)
);
