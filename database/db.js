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

insert into movie values ('hello','24 april',160,{5,8},'picture.jpg',10,'movie title');

//relationship table for movies and genres
DROP TABLE movies_genres;
CREATE TABLE movies_genres (
    movie_id integer NOT NULL,
    genre_id integer NOT NULL,
    FOREIGN KEY (movie_id) ELEMENT REFERENCES movies(id),
    FOREIGN KEY (genre_id) ELEMENT REFERENCES genres(id)
);
