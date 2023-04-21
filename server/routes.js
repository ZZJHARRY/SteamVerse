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

/********************************
 * Guo Cheng *
 ********************************/
// Route 1: GET /recommendation/:type_of_recommendation
const recommendation = async function(req, res) {

  const want_to_operate = req.query.want_to_operate;
  const do_not_want_to_operate = req.query.do_not_want_to_operate;
  const input_month = req.query.input_month;
  const page = req.query.page ?? 1;
  const pageSize = req.query.page_size ?? 5;
  

  const type_of_recommendation = req.params.type_of_recommendation;

  //case 1:
  if (type_of_recommendation === "recommended_by_most_active_user"){
    if (!page){ //return all albums
      connection.query(`
      WITH user_most_review AS (
      SELECT DISTINCT u.user_id
      FROM User u
      ORDER BY reviews DESC
      Limit 500
      ),
      user_most_game AS(
      SELECT DISTINCT r.user_id
      FROM Recommendations r
      WHERE r.is_recommended = True
      GROUP BY r.user_id
      ORDER BY COUNT(r.app_id) DESC LIMIT 500
      ),
      game_in_id AS(
      SELECT DISTINCT r.app_id
      FROM Recommendations r
      WHERE r.is_recommended = True AND r.user_id IN (SELECT u1.user_id FROM user_most_review u1) AND r.user_id IN (SELECT u2.user_id FROM user_most_game u2)
      )
      SELECT DISTINCT g1.app_id, g1.title
      FROM Game g1 JOIN game_in_id g2 ON g1.app_id = g2.app_id;
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
      res.json(data);
    }
  });}else{
    const off_set = pageSize*(page-1)
    connection.query(`
      WITH user_most_review AS (
      SELECT DISTINCT u.user_id
      FROM User u
      ORDER BY reviews DESC
      Limit 500
      ),
      user_most_game AS(
      SELECT DISTINCT r.user_id
      FROM Recommendations r
      WHERE r.is_recommended = True
      GROUP BY r.user_id
      ORDER BY COUNT(r.app_id) DESC LIMIT 500
      ),
      game_in_id AS(
      SELECT DISTINCT r.app_id
      FROM Recommendations r
      WHERE r.is_recommended = True AND r.user_id IN (SELECT u1.user_id FROM user_most_review u1) AND r.user_id IN (SELECT u2.user_id FROM user_most_game u2)
      )
      SELECT DISTINCT g1.app_id, g1.title
      FROM Game g1 JOIN game_in_id g2 ON g1.app_id = g2.app_id
      LIMIT ${pageSize}
      OFFSET ${off_set}
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
      res.json(data);
    }
  });
  }

  }else if(type_of_recommendation === "recommended_by_most_reviews"){
    //case 2
    if (!page){ //return all albums

      connection.query(`
        WITH temp1 AS(
        SELECT DISTINCT r.user_id
        FROM Game g JOIN Recommendations r ON g.app_id = r.app_id JOIN Operation_System o ON g.app_id = o.app_id
        WHERE g.date_release >= '2015-01-01'
        ORDER BY r.hours DESC
        LIMIT 500
        ),
        temp2 AS(
        SELECT u.user_id
        FROM User u
        WHERE u.products >= 500 AND u.reviews >= 30
        LIMIT 1000
        ),
        temp3 AS(
        SELECT DISTINCT r.app_id
        FROM Recommendations r
        WHERE r.is_recommended = True AND r. funny >= 1 AND ( r.user_id IN (SELECT t1.user_id FROM temp1 t1) OR r.user_id IN (SELECT t2.user_id FROM temp2 t2)  )
        )
        SELECT DISTINCT g1.title
        FROM Game g1 JOIN temp3 t3 ON g1.app_id = t3.app_id
        WHERE g1.price_final > 10 AND g1.positive_ratio >= 60;
        
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
        res.json(data);
      }
    });}else{
      const off_set = pageSize*(page-1)
      connection.query(`
        WITH temp1 AS(
        SELECT DISTINCT r.user_id
        FROM Game g JOIN Recommendations r ON g.app_id = r.app_id JOIN Operation_System o ON g.app_id = o.app_id
        WHERE g.date_release >= '2015-01-01'
        ORDER BY r.hours DESC
        LIMIT 500
        ),
        temp2 AS(
        SELECT u.user_id
        FROM User u
        WHERE u.products >= 500 AND u.reviews >= 30
        LIMIT 1000
        ),
        temp3 AS(
        SELECT DISTINCT r.app_id
        FROM Recommendations r
        WHERE r.is_recommended = True AND r. funny >= 1 AND ( r.user_id IN (SELECT t1.user_id FROM temp1 t1) OR r.user_id IN (SELECT t2.user_id FROM temp2 t2)  )
        )
        SELECT DISTINCT g1.title
        FROM Game g1 JOIN temp3 t3 ON g1.app_id = t3.app_id
        WHERE g1.price_final > 10 AND g1.positive_ratio >= 60
        LIMIT ${pageSize}
        OFFSET ${off_set}    
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
        res.json(data);
      }
    });
    }

  }else if(type_of_recommendation === "recommend_with_system"){
    //case 3
    if (!page){ //return all albums
      connection.query(`
      WITH Games_Win AS (
        SELECT g.title, g.app_id
        FROM Game g JOIN Operation_System o ON g.app_id = o.app_id
        WHERE o.os_name = "${want_to_operate}" and g.date_release >= '2018-01-01'
     ),
     Games_Mac AS (
        SELECT g.title, g.app_id
        FROM Game g JOIN Operation_System o ON g.app_id = o.app_id
        WHERE o.os_name = "${do_not_want_to_operate}" and g.date_release >= '2018-01-01'
     ),
     Games_Win_Not_Mac AS (
        SELECT w.title, w.app_id
        FROM Games_Win w LEFT JOIN Games_Mac m ON w.app_id = m.app_id
        WHERE m.app_id IS NULL
     ),
     Top_10_Reviewers AS (
        SELECT user_id
        FROM User
        Order by reviews DESC
        LIMIT 100
     ),
    Top_10_Reviewers_Recommend_Games AS (SELECT r.app_id
    FROM Top_10_Reviewers t JOIN Recommendations r ON t.user_id = r.user_id
    WHERE r.is_recommended = 'true'
    )
    SELECT distinct g.app_id, g.title
    FROM Games_Win_Not_Mac g
    Join Top_10_Reviewers_Recommend_Games t on t.app_id=g.app_id
     ;
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
        res.json(data);
      }
    });}else{
      const off_set = pageSize*(page-1)
      connection.query(`
      WITH Games_Win AS (
        SELECT g.title, g.app_id
        FROM Game g JOIN Operation_System o ON g.app_id = o.app_id
        WHERE o.os_name = "${want_to_operate}" and g.date_release >= '2018-01-01'
     ),
     Games_Mac AS (
        SELECT g.title, g.app_id
        FROM Game g JOIN Operation_System o ON g.app_id = o.app_id
        WHERE o.os_name = "${do_not_want_to_operate}" and g.date_release >= '2018-01-01'
     ),
     Games_Win_Not_Mac AS (
        SELECT w.title, w.app_id
        FROM Games_Win w LEFT JOIN Games_Mac m ON w.app_id = m.app_id
        WHERE m.app_id IS NULL
     ),
     Top_10_Reviewers AS (
        SELECT user_id
        FROM User
        Order by reviews DESC
        LIMIT 100
     ),
    Top_10_Reviewers_Recommend_Games AS (SELECT r.app_id
    FROM Top_10_Reviewers t JOIN Recommendations r ON t.user_id = r.user_id
    WHERE r.is_recommended = 'true'
    )
    SELECT distinct g.app_id, g.title
    FROM Games_Win_Not_Mac g
    Join Top_10_Reviewers_Recommend_Games t on t.app_id=g.app_id
    LIMIT ${pageSize}
    OFFSET ${off_set}
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
        res.json(data);
      }
    });
    }
    

  }else if(type_of_recommendation === "top_game_curr_month_all_time"){
    //case 4
    if (!page){ //return all albums
    connection.query(`
    With cte As(
      Select app_id, positive_ratio / 200 as rate
      From Game
      Where MONTH(date_release) = ${input_month}),
      cte2 As(
        Select count(*) as user_cnt
        From User),
      cte3 As(
      Select app_id, count(*) as play_cnt
      From Recommendations
      Group by app_id)
      Select g.app_id, g.title, c.rate+0.5*(cc.play_cnt/(select user_cnt from cte2)) as score
      From Game g
      Join cte c on c.app_id = g.app_id
      Join cte3 cc on cc.app_id = g.app_id
      Where MONTH(g.date_release) = ${input_month}
      Order By score DESC    
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
      res.json(data);
    }
  });}else{
    const off_set = pageSize*(page-1)
    connection.query(`
    With cte As(
      Select app_id, positive_ratio / 200 as rate
      From Game
      Where MONTH(date_release) = ${input_month}),
      cte2 As(
        Select count(*) as user_cnt
        From User),
      cte3 As(
      Select app_id, count(*) as play_cnt
      From Recommendations
      Group by app_id)
      Select g.app_id, g.title, c.rate+0.5*(cc.play_cnt/(select user_cnt from cte2)) as score
      From Game g
      Join cte c on c.app_id = g.app_id
      Join cte3 cc on cc.app_id = g.app_id
      Where MONTH(g.date_release) = ${input_month}
      Order By score DESC  
      LIMIT ${pageSize} 
      OFFSET ${off_set} 
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
      res.json(data);
    }
  });
  }

  }else if(type_of_recommendation === "random_recommendation"){
    //case 5
    connection.query(`
    Select app_id, title
    From Game
    Where MONTH(date_release) = ${input_month}
    Order By Rand()
    Limit 1
          
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
      res.json({
        app_id: data[0].app_id,
        title: data[0].title
      });
    }
  });

  }else if (type_of_recommendation === "top_games_most_recommend"){
    //case 6
    if (!page){ //return all albums
    connection.query(`
    WITH Top_10_Users AS (
      SELECT user_id
      FROM User
      ORDER BY products DESC
      LIMIT 100
   )
   SELECT g.app_id, g.title
   FROM Top_10_Users t JOIN Recommendations r ON t.user_id = r.user_id
   JOIN Game g ON r.app_id = g.app_id
   WHERE r.is_recommended = 'true';
   
          
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
      res.json(data);
    }
  });}else{
    const off_set = pageSize*(page-1)
    connection.query(`
    WITH Top_10_Users AS (
      SELECT user_id
      FROM User
      ORDER BY products DESC
      LIMIT 100
   )
   SELECT g.app_id, g.title
   FROM Top_10_Users t JOIN Recommendations r ON t.user_id = r.user_id
   JOIN Game g ON r.app_id = g.app_id
   WHERE r.is_recommended = 'true'
   LIMIT ${pageSize}
   OFFSET ${off_set}      
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
      res.json(data);
    }
  });
  }

  }
}

/************************
 * Tangchao Chen *
 ************************/
//Route 2: /games/system/:type_of_system
const game_system = async function(req, res) {
  const want_to_operate = req.params.want_to_operate;
  connection.query(` 
   WITH Games_Operate_on_Mac AS (
   SELECT g.title, g.app_id
   FROM Game g JOIN Operation_System o ON g.app_id = o.app_id
   WHERE o.os_name = "${want_to_operate}" and g.date_release >= '2020-01-01'
),
Games_Number_Reviews AS (
   SELECT g.title, g.app_id, COUNT(*) AS num_reviews
   FROM Games_Operate_on_Mac g JOIN Recommendations r ON g.app_id = r.app_id
   GROUP BY g.title, g.app_id
)
SELECT title, num_reviews
FROM Games_Number_Reviews
ORDER BY num_reviews DESC
LIMIT 5;
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
          res.json({});
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
// Route 4: GET /games/:type_of_games
const games = async function(req, res) {
  const type_of_games = req.params.type_of_games;
  const page = req.query.page;
  const pageSize = req.query.page_size ?? 10;

  if (type_of_games === "high_positive_ratio") {
    if (!page){ //return all albums
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
    } else {// return albums on a certain page
      const off_set = pageSize*(page-1)
      connection.query(`
      With cte AS (
        SELECT MAX(positive_ratio) AS max_ratio
        From Game
        WHERE date_release >= '2020-01-01')
      SELECT app_id, title
      FROM Game
      WHERE date_release < '2020-01-01'
      AND positive_ratio >= (SELECT max_ratio FROM cte)
      LIMIT ${pageSize}
      OFFSET ${off_set}
      `,(err, data)=>{
        res.json(data);
      });
    }
  } else if (type_of_games === "games_ratio") {
    if (!page){ //return all albums
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
    } else {// return albums on a certain page
      const off_set = pageSize*(page-1)
      connection.query(`
      SELECT app_id, title
      FROM Game
      WHERE positive_ratio > 80 AND user_reviews > 20
      ORDER BY price_final
      LIMIT ${pageSize}
      OFFSET ${off_set}
      `,(err, data)=>{
        res.json(data);
      });
    }
  }
}

/********************************
 * Guo Cheng *
 ********************************/
// Route 5: GET /app/:app_id
const game = async function(req, res) {
  //  given a app_id, returns all information about the app
  const app_id = req.params.app_id;
  connection.query(`
      SELECT title,date_release,rating,positive_ratio,user_reviews,price_final,price_original,discount
      FROM Game
      WHERE app_id = "${app_id}"
      `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data[0]);
    }
  });
}

/********************************
 * Zijian Zhang *
 ********************************/
// Route 6: GET /system/:app_id
const system = async function(req, res) {
  //  given a app_id, returns all information about the app
  const app_id = req.params.app_id;
  connection.query(`
      SELECT os_name
      FROM Operation_System
      WHERE app_id = "${app_id}"
      `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data);
    }
  });
}



// // Route 6: GET /search_filter
// const search_filter = async function(req, res) {
//   // TODO (TASK 12): return all songs that match the given search query with parameters defaulted to those specified in API spec ordered by title (ascending)
//   // Some default parameters have been provided for you, but you will need to fill in the rest
//   const title = req.query.title ?? '';
//   const date_release_low = req.query.date_release_low ?? "2010-01-01";
//   const date_release_high = req.query.date_release_high ?? "2022-01-01";
//   const rating = req.query.rating ?? '';
//   const positive_ratio_low = req.query.positive_ratio_low ?? 70;
//   const positive_ratio_high = req.query.positive_ratio_high ?? 100;
//   const user_reviews_low = req.query.user_reviews_low ?? 100;
//   const user_reviews_high = req.query.user_reviews_high ?? 10000;
//   const price_final_low = req.query.price_final_low ?? 0;
//   const price_final_high = req.query.price_final_high ?? 100;
//   const price_original_low = req.query.price_original_low ?? 0;
//   const price_original_high = req.query.price_original_high ?? 100;
//   const discount_low = req.query.discount_low ?? 0;
//   const discount_high = req.query.discount_high ?? 100;
  
//   //TODO include rating

//   connection.query(`
//     SELECT *
//     FROM Game
//     WHERE LOWER(title) LIKE LOWER('%${title}%')
//     AND ${date_release_low} <= date_release AND date_release <= ${date_release_high}
//     AND ${positive_ratio_low} <= positive_ratio AND positive_ratio <= ${positive_ratio_high}
//     AND ${user_reviews_low} <= user_reviews AND user_reviews<=${user_reviews_high}
//     AND ${price_final_low} <= price_final AND price_final <= ${price_final_high}
//     AND ${price_original_low} <= price_original AND price_original <= ${price_original_high}
//     AND ${discount_low} <= discount AND discount <= ${discount_high}
//     ORDER BY title ASC
//   `,(err, data)=>{
//     if (err || data.length ===0){
//       console.log(err)
//       res.json([]);
//     } else {
//       res.json(data);
//     } 
//   });

// }



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
  recommendation,
  game_system,
  stat,
  games,
  game,
  system,
  // search_filter,
}
