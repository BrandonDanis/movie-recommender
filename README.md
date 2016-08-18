![alt tag](http://i.imgur.com/sQYa4Up.png)
</br>
Don't know what to watch? This is the app for you!

<strong>Created by:</strong>
```javascript
var Rushil_Perera = "https://github.com/silverAndroid";
var Brandon_Danis = "https://github.com/BrandonDanis";
```

<strong>API Endpoints:</strong>

```javascript
var movies = 'routes/movies-route.js';
GET /movies //returns all movies  
GET /specific-movie //returns a specific movie 
GET /all-genres //returns all genres  
GET /getMoviesFromGenre //returns all movies from a specific genre

var movies = 'routes/directors-route.js';
GET /directors //returns all directors
GET /director //returns a specific director

var users = 'routes/users-route.js';
POST /users //adding a user to the database
GET /users //returns a specific user
DELETE /users //deletes the specified user
```

<strong>Features:</strong>

- Cookie based session authentication
- Password encryption
- Fully dynamic front-end design

<strong>How to run:</strong>

* Install all node dependencies
* Create the database schema using database/db.sql (setting up postgres https://www.digitalocean.com/community/tutorials/how-to-create-remove-manage-tables-in-postgresql-on-a-cloud-server)
* Populate the database with the python scripts in /scripts
```python
python populate.py DATABASE_NAME localhost DB_USER DB_PASS
python populateCrew.py DATABASE_NAME localhost DB_USER DB_PASS
python retrieve_trailers.py DATABASE_NAME localhost DB_USER DB_PASS
```
* Run the app by running 'node index.js'

