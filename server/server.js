const express = require('express');
const cors = require('cors');
const config = require('./config');
const routes = require('./routes');

const app = express();
app.use(cors({
  origin: '*',
}));

// We use express to define our various API endpoints and
// provide their handlers that we implemented in routes.js
app.get('/recommendation/:type_of_recommendation',routes.recommendation);
app.get('/games/:type_of_games',routes.games);
app.get('/app/:app_id', routes.game);
app.get('/system/system_type/:type_of_system', routes.game_system);
app.get('/system/stat', routes.stat);
app.get('/system/:app_id', routes.system);
app.get('/users/:type_of_user', routes.users);
app.get('/search_filter',routes.search_filter);
app.get('/get_img/:app_title',routes.get_img);



app.listen(config.server_port, () => {
  console.log(`Server running at http://${config.server_host}:${config.server_port}/`)
});

module.exports = app;
