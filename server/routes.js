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
    const date = new Date();
    let month = date.getMonth() + 1;
    if (!page){ //return all albums
    connection.query(`
    With cte As(
      Select app_id, positive_ratio / 200 as rate
      From Game
      Where MONTH(date_release) = ${month}),
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
      Where MONTH(g.date_release) = ${month}
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
    const date = new Date();
    let month = date.getMonth() + 1;
    connection.query(`
    Select app_id, title
    From Game
    Where MONTH(date_release) = ${month}
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
  const want_to_operate = req.params.type_of_system;
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
      res.json([]);
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
  const page = req.query.page;
  const pageSize = req.query.page_size ?? 10;

  
    if (!page){ //return all albums
  connection.query(`With cte As(
      Select g.app_id, Floor(AVG(r.hours)) as average_hours
      From Recommendations r
      Join Game g on g.app_id = r.app_id
      Join Operation_System o on o.app_id = g.app_id
      Where g.rating = 'Very Positive' And o.os_name = 'win'
      Group By g.app_id
      )
      Select g.app_id, g.title, c.average_hours
      From Game g
      Join cte c on c.app_id = g.app_id
      Order by average_hours DESC;
      `, (err, data) =>{
      if (err || data.length === 0) {
          console.log(err);
          res.json([]);
      } 
      else{
          res.json(data);
      }
      }
      );}else{
        const off_set = pageSize*(page-1)
        connection.query(`With cte As(
          Select g.app_id, Floor(AVG(r.hours)) as average_hours
          From Recommendations r
          Join Game g on g.app_id = r.app_id
          Join Operation_System o on o.app_id = g.app_id
          Where g.rating = 'Very Positive' And o.os_name = 'win'
          Group By g.app_id
          )
          Select g.app_id, g.title, c.average_hours
          From Game g
          Join cte c on c.app_id = g.app_id
          Order by average_hours DESC
          LIMIT ${pageSize}
          OFFSET ${off_set};
          `, (err, data) =>{
          if (err || data.length === 0) {
              console.log(err);
              res.json([]);
          } 
          else{
              res.json(data);
          }
          }
          );
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
        SELECT *
        FROM Game
        WHERE date_release < '2020-01-01'
        AND positive_ratio >= (SELECT 0.9*max_ratio FROM cte);
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
        SELECT *
        FROM Game
        WHERE date_release < '2020-01-01'
        AND positive_ratio >= (SELECT 0.9*max_ratio FROM cte)
        LIMIT ${pageSize}
        OFFSET ${off_set}
      `,(err, data)=>{
        res.json(data);
      });
    }
  } else if (type_of_games === "games_ratio") {
    if (!page){ //return all albums
      connection.query(`
      SELECT *
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
      SELECT *
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

// Route 6: GET /search_filter
const search_filter = async function(req, res) {
  // TODO (TASK 12): return all songs that match the given search query with parameters defaulted to those specified in API spec ordered by title (ascending)
  // Some default parameters have been provided for you, but you will need to fill in the rest
  const title = req.query.title ?? '';
  // const date_release_low = req.query.date_release_low ?? "2010-01-01";
  // const date_release_high = req.query.date_release_high ?? "2022-01-01";
  const rating_low = req.query.rating_low ?? 1;
  const rating_high = req.query.rating_high ?? 5;
  const positive_ratio_low = req.query.positive_ratio_low ?? 0;
  const positive_ratio_high = req.query.positive_ratio_high ?? 100;
  const user_reviews_low = req.query.user_reviews_low ?? 0;
  const user_reviews_high = req.query.user_reviews_high ?? 7000000;
  const price_final_low = req.query.price_final_low ?? 0;
  const price_final_high = req.query.price_final_high ?? 59.9;
  const price_original_low = req.query.price_original_low ?? 0;
  const price_original_high = req.query.price_original_high ?? 59.9;
  const discount_low = req.query.discount_low ?? 0;
  const discount_high = req.query.discount_high ?? 100;
  
  //TODO include rating

  connection.query(`
    SELECT *
    FROM Game
    WHERE LOWER(title) LIKE LOWER('%${title}%')
    AND ${rating_low} <= rating_number AND rating_number <= ${rating_high}
    AND ${positive_ratio_low} <= positive_ratio AND positive_ratio <= ${positive_ratio_high}
    AND ${user_reviews_low} <= user_reviews AND user_reviews<=${user_reviews_high}
    AND ${price_final_low} <= price_final AND price_final <= ${price_final_high}
    AND ${price_original_low} <= price_original AND price_original <= ${price_original_high}
    AND ${discount_low} <= discount AND discount <= ${discount_high}
    ORDER BY title ASC
  `,(err, data)=>{
    if (err || data.length ===0){
      console.log(data);
      res.json([]);
    } else {
      res.json(data);
    } 
  });

}

/********************************
 * Zijian Zhang *
 ********************************/
// Route 7: GET /system/:app_id
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

// Route 8: GET /users/:type_of_user
const users = async function(req, res) {
  //  given a app_id, returns all information about the user
  //if type_of_user = 
  const type_of_user = req.params.type_of_user;
  const page = req.query.page;
  const pageSize = req.query.page_size ?? 10;
  if (!page){
  connection.query(`
      SELECT *
      FROM User
      ORDER BY ${type_of_user} DESC
      LIMIT 10
      `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json([]);
    } else {
      res.json(data);
    }
  });} else{
  
    const off_set = pageSize*(page-1);
    connection.query(`
    SELECT *
    FROM User
    ORDER BY ${type_of_user} DESC
    LIMIT ${pageSize}
    OFFSET ${off_set}
    `, (err, data) => {
  if (err || data.length === 0) {
    console.log(err);
    res.json([]);
  } else {
    res.json(data);
  }
});

  }
}

//GET /get_img/:app_title
const get_img = async function(req, res) {
  const app_title = req.params.app_title;

  fetch(`https://serpapi.com/search.json?q=${app_title}&ijn=1&engine=google_images&api_key=628fb8b17e5f95b8d9f008f1c0489473152a76dcf0b3ecbd72794abf626a14a4`)
  .then(respond => respond.json())
  .then(resJson => {
    res.json({img_url:resJson["images_results"][0]["thumbnail"]});
    // console.log(resJson["images_results"][0]["thumbnail"]);
  });

}

module.exports = {
  recommendation,
  game_system,
  stat,
  games,
  game,
  system,
  search_filter,
  users,
  get_img,
}
