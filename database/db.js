DROP TABLE 'movies';
CREATE TABLE 'movies' (
  'id' int(11) NOT NULL auto_increment,
  'original_title' text NOT NULL,
  'overview' text NOT NULL,
  'release_date' varchar(255) NOT NULL,
  'runtime' int(11) NOT NULL,
  'poster' varchar(255) NOT NULL,
  'rating' int(11) NOT NULL,
  'title' text NOT NULL,
  'url' varchar(255) NOT NULL,
  'vote_average' float NOT NULL,
  'vote_count' int(11) NOT NULL,
  PRIMARY KEY  ('id')
);

DROP TABLE 'genres';
CREATE TABLE 'genres' (
  'id' int(11) NOT NULL auto_increment,
  'tmdb_id' int(11) NOT NULL,
  'name' varchar(255) NOT NULL,
  PRIMARY KEY  ('id')
);

INSERT INTO 'genres' ('name') VALUES
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
