DROP TABLE movies;
CREATE TABLE movies (
  id serial PRIMARY KEY,
  overview text NOT NULL,
  release_date varchar(255) NOT NULL,
  runtime integer NOT NULL,
  genre_id integer REFERENCES genres,
  poster varchar(255) NOT NULL,
  rating integer NOT NULL,
  title text NOT NULL
);

DROP TABLE genres;
CREATE TABLE genres (
  id serial PRIMARY KEY,
  name varchar(255) NOT NULL
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
