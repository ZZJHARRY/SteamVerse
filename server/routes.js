const mysql = require('mysql')
const config = require('./config.json')

// Creates MySQL connection using database credential provided in config.json
// Do not edit. If the connection fails, make sure to check that config.json is filled out correctly
const connection = mysql.createConnection({
  host: config.rds_host,
  user: config.rds_user,
  password: config.rds_password,
  port: config.rds_port,
  database: config.rds_db
});
connection.connect((err) => err && console.log(err));

/******************
 * WARM UP ROUTES *
 ******************/

// Route 1: GET /author/:type
const author = async function(req, res) {
  // TODO (TASK 1): replace the values of name and pennKey with your own
  const name = 'Guo Cheng';
  const pennKey = 'guocheng';

  // checks the value of type the request parameters
  // note that parameters are required and are specified in server.js in the endpoint by a colon (e.g. /author/:type)
  if (req.params.type === 'name') {
    // res.send returns data back to the requester via an HTTP response
    res.send(`Created by ${name}`);
  } else if (req.params.type === 'pennkey') {
    // TODO (TASK 2): edit the else if condition to check if the request parameter is 'pennkey' and if so, send back response 'Created by [pennkey]'
    res.send(`Created by ${pennKey}`);
  } else {
    // we can also send back an HTTP status code to indicate an improper request
    res.status(400).send(`'${req.params.type}' is not a valid author type. Valid types are 'name' and 'pennkey'.`);
  }
}

// Route 2: GET /random
const random = async function(req, res) {
  // you can use a ternary operator to check the value of request query values
  // which can be particularly useful for setting the default value of queries
  // note if users do not provide a value for the query it will be undefined, which is falsey
  const explicit = req.params.explicit === 'true' ? 1 : 0;

  // Here is a complete example of how to query the database in JavaScript.
  // Only a small change (unrelated to querying) is required for TASK 3 in this route.
  connection.query(`
    SELECT *
    FROM Songs
    WHERE explicit <= ${explicit}
    ORDER BY RAND()
    LIMIT 1
  `, (err, data) => {
    if (err || data.length === 0) {
      // if there is an error for some reason, or if the query is empty (this should not be possible)
      // print the error message and return an empty object instead
      console.log(err);
      res.json({});
    } else {
      // Here, we return results of the query as an object, keeping only relevant data
      // being song_id and title which you will add. In this case, there is only one song
      // so we just directly access the first element of the query results array (data)
      // TODO (TASK 3): also return the song title in the response
      res.json({
        song_id: data[0].song_id,
        title: data[0].title
      });
    }
  });
}

/********************************
 * BASIC SONG/ALBUM INFO ROUTES *
 ********************************/

// Route 3: GET /song/:song_id
const song = async function(req, res) {
  // TODO (TASK 4): implement a route that given a song_id, returns all information about the song
  // Most of the code is already written for you, you just need to fill in the query
  const song_id = req.params.song_id;
  connection.query(`
      SELECT *
      FROM Songs
      WHERE song_id = "${song_id}"
      `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data[0]);
    }
  });
}

// Route 4: GET /album/:album_id
const album = async function(req, res) {
  // TODO (TASK 5): implement a route that given a album_id, returns all information about the album
   // replace this with your implementation
  const album_id = req.params.album_id;
  connection.query(`
        SELECT *
        FROM Albums
        WHERE album_id = "${album_id}"
      `,(err,data)=>{
        if (err || data.length ===0){
          console.log(err);
          res.json({});
        } else {
          res.json(data[0])
        }
      });
}

// Route 5: GET /albums
const albums = async function(req, res) {
  // TODO (TASK 6): implement a route that returns all albums ordered by release date (descending)
  // Note that in this case you will need to return multiple albums, so you will need to return an array of objects
  // replace this with your implementation
  connection.query(`
      SELECT *
      FROM Albums 
      ORDER BY release_date DESC
    `,(err,data)=>{
        res.json(data);
    });
}

// Route 6: GET /album_songs/:album_id
const album_songs = async function(req, res) {
  // TODO (TASK 7): implement a route that given an album_id, returns all songs on that album ordered by track number (ascending)
  // replace this with your implementation
  const album_id = req.params.album_id;
  connection.query(`
      SELECT song_id,title,number,duration,plays
      FROM Songs
      WHERE album_id= "${album_id}"
      ORDER BY number ASC
      `,(err,data)=>{
        res.json(data);
    });
}

/************************
 * ADVANCED INFO ROUTES *
 ************************/

// Route 7: GET /top_songs
const top_songs = async function(req, res) {
  const page = req.query.page;
  // TODO (TASK 8): use the ternary (or nullish) operator to set the pageSize based on the query or default to 10
  const pageSize = req.query.page_size ?? 10;

  if (!page) {
    // TODO (TASK 9)): query the database and return all songs ordered by number of plays (descending)
    // Hint: you will need to use a JOIN to get the album title as well
     // replace this with your implementation
     connection.query(`
      SELECT s.song_id,s.title,s.album_id, a.title as album,s.plays
      FROM Songs s join Albums a on s.album_id = a.album_id
      ORDER BY plays DESC
      `,(err,data)=>{
       res.json(data);
   });
  } else {
    // TODO (TASK 10): reimplement TASK 9 with pagination
    // Hint: use LIMIT and OFFSET (see https://www.w3schools.com/php/php_mysql_select_limit.asp)
    // replace this with your implementation res.json([]);

    const off_set = (page-1)*pageSize
     connection.query(`
      SELECT s.song_id,s.title,s.album_id, a.title as album,s.plays
      FROM Songs s join Albums a on s.album_id = a.album_id
      ORDER BY plays DESC
      LIMIT ${pageSize}
      OFFSET ${off_set}
      `,(err,data)=>{
      res.json(data);
    });
  }
}

// Route 8: GET /top_albums
const top_albums = async function(req, res) {
  // TODO (TASK 11): return the top albums ordered by aggregate number of plays of all songs on the album (descending), with optional pagination (as in route 7)
  // Hint: you will need to use a JOIN and aggregation to get the total plays of songs in an album
  // replace this with your implementation res.json([]); 
  const page = req.query.page;
  const pageSize = req.query.page_size ?? 10;
  
  if (!page){ //return all albums
    connection.query(`
      SELECT a.album_id, a.title, SUM(s.plays) as plays
      FROM Albums a join Songs s on a.album_id = s.album_id
      GROUP BY a.album_id
      ORDER BY plays DESC 
      `,(err, data)=>{
        res.json(data);
      });
  } else {// return albums on a certain page
    const off_set = pageSize*(page-1)
    connection.query(`
      SELECT a.album_id, a.title, SUM(s.plays) as plays
      FROM Albums a join Songs s on a.album_id = s.album_id
      GROUP BY a.album_id
      ORDER BY plays DESC 
      LIMIT ${pageSize}
      OFFSET ${off_set}
      `,(err, data)=>{
        res.json(data);
      });

  }
}

// Route 9: GET /search_albums
const search_songs = async function(req, res) {
  // TODO (TASK 12): return all songs that match the given search query with parameters defaulted to those specified in API spec ordered by title (ascending)
  // Some default parameters have been provided for you, but you will need to fill in the rest
  const title = req.query.title ?? '';
  const durationLow = req.query.duration_low ?? 60;
  const durationHigh = req.query.duration_high ?? 660;
  const plays_low = req.query.plays_low ?? 0;
  const plays_high = req.query.plays_high ?? 1100000000;
  const danceability_low = req.query.danceability_low ?? 0;
  const danceability_high = req.query.danceability_high ?? 1;
  const energy_low = req.query.energy_low ?? 0;
  const energy_high = req.query.energy_high ?? 1;
  const valence_low = req.query.valence_low ?? 0;
  const valence_high = req.query.valence_high ?? 1;
  const explicit = req.query.explicit === 'true'? 1:0 ;
  connection.query(`
    SELECT song_id,album_id,title,number,duration,plays,danceability,energy,valence,tempo,key_mode,explicit
    FROM Songs
    WHERE LOWER(title) LIKE LOWER('%${title}%') AND  explicit <= ${explicit}
    AND ${durationLow} <= duration AND duration <= ${durationHigh}
    AND ${plays_low} <= plays AND plays <= ${plays_high}
    AND ${danceability_low} <= danceability AND danceability<=${danceability_high}
    AND ${energy_low} <= energy AND energy <= ${energy_high}
    AND ${valence_low} <= valence AND valence <= ${valence_high}
    ORDER BY title ASC
  `,(err, data)=>{
    if (err || data.length ===0){
      console.log(err)
      res.json([]);
    } else {
      res.json(data);
    } 
  });
   // replace this with your implementation res.json([]);
}

/************************
 * Tangchao Chen *
 ************************/
//Route 2: /games/system/:type_of_system
const game_system = async function(req, res) {
  const want_to_operate = req.params.want_to_operate;
  const do_not_want_to_operate = req.params.do_not_want_to_operate;
  connection.query(` 
    WITH Games_Want AS (
   SELECT g.title, g.app_id
   FROM Game g JOIN Operation_System o ON g.app_id = o.app_id
   WHERE o.os_name = ${want_to_operate} and g.date_release >= '2018-01-01'
),
Games_no_want AS (
   SELECT g.title, g.app_id
   FROM Game g JOIN Operation_System o ON g.app_id = o.app_id
   WHERE o.os_name =  ${do_not_want_to_operate} and g.date_release >= '2018-01-01'
),
Games_final AS (
   SELECT w.title, w.app_id
   FROM Games_Want w LEFT JOIN Games_no_want m ON w.app_id = m.app_id
   WHERE m.app_id IS NULL
),
Top_10_Reviewers AS (
   SELECT user_id
   FROM User
   ORDER BY reviews
   LIMIT 10
),
Top_10_Reviewers_Recommend_Games AS (
   SELECT r.app_id
   FROM Top_10_Reviewers t JOIN Recommendations r ON t.user_id = r.user_id
   WHERE r.is_recommended = 'true'
),
Top_10_Reviewers_Recommend_Games_Number AS (
   SELECT app_id
   FROM Top_10_Reviewers_Recommend_Games
   GROUP BY app_id
   HAVING COUNT(*) >= 2
)
SELECT title
FROM Games_final
WHERE app_id IN (
   SELECT *
   FROM Top_10_Reviewers_Recommend_Games_Number
)
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data);
    }
  });
}

/*************************************
// Route 3: games/system/:statistics - Jun Wang
*************************************/
const stat = async function(req, res){
  const statistics = req.params.statistics;
  if (statistics){
  connection.query(`With cte As(
      Select g.app_id, Floor(AVG(r.hours)) as average_hours
      From Recommendations r
      Join Game g on g.app_id = r.app_id
      Join Operation_System o on o.app_id = g.app_id
      Where g.rating = 'Very Positive' And o.os_name = 'win'
      Group By g.app_id
      )
      Select g.title, c.average_hours
      From Game g
      Join cte c on c.app_id = g.app_id
      Order by average_hours DESC;
      `, (err, data) =>{
      if (err || data.length === 0) {
          console.log(err);
          res.json([]);
      } 
      else{
          res.json(data)
      }
      }
      )
  }
}


/*************************************
 * ROUTE 4: Filtering Games - Zijian *
 *************************************/
// Route 4: GET /games/filtering/:type_of_games
const filter_games = async function(req, res) {
  const type_of_games = req.params.type_of_games;
  if (type_of_games === "high_positive_ratio") {
    connection.query(`
      With cte AS (
        SELECT MAX(positive_ratio) AS max_ratio
        From Game
        WHERE date_release >= '2020-01-01')
      SELECT app_id, title
      FROM Game
      WHERE date_release < '2020-01-01'
      AND positive_ratio >= (SELECT max_ratio FROM cte)
      `,(err,data)=>{
        if (err || data.length === 0){
          console.log(err)
          res.json([]);
        } else {
          res.json(data);
        }
    });
  } else if (type_of_games === "games_ratio") {
    connection.query(`
      SELECT app_id, title
      FROM Game
      WHERE positive_ratio > 80 AND user_reviews > 20
      ORDER BY price_final
      `,(err,data)=>{
        if (err || data.length === 0){
          console.log(err)
          res.json([]);
        } else {
          res.json(data);
        }
    });
  }
}

module.exports = {
  author,
  random,
  song,
  album,
  albums,
  album_songs,
  top_songs,
  top_albums,
  search_songs,
  filter_games,
}
