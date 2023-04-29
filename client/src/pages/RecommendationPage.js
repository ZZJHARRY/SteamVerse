import { useEffect, useState } from 'react';
import { Container, Divider, Link } from '@mui/material';
import { NavLink } from 'react-router-dom';



import LazyTable from '../components/LazyTable';
import AppCard from '../components/AppCard';
const config = require('../config.json');

export default function RecommendationPage() {
  // We use the setState hook to persist information across renders (such as the result of our API calls)
  // const [appOfTheDay, setAppOfTheDay] = useState({});
  // const [author, setAuthor] = useState();
  const [selectedAppId, setSelectedAppId] = useState('');

  //TODO: dont' hard code these
  const do_not_want_to_operate = 'win';
  const want_to_operate = 'mac';
  const input_month = 4;


  // Here, we define the columns of the "Top Songs" table. The songColumns variable is an array (in order)
  // of objects with each object representing a column. Each object has a "field" property representing
  // what data field to display from the raw data, "headerName" property representing the column label,
  // and an optional renderCell property which given a row returns a custom JSX element to display in the cell.
  const appColumns = [
    {
      field: 'title',
      headerName: 'Game Title',
      renderCell: (row) => <Link onClick={() => setSelectedAppId(row.app_id)}>{row.title}</Link> // A Link component is used just for formatting purposes
    },
  ];

  const appWithScoreColumns = [
    {
      field: 'title',
      headerName: 'Game Title',
      renderCell: (row) => <Link onClick={() => setSelectedAppId(row.app_id)}>{row.title}</Link> // A Link component is used just for formatting purposes
    },
    {
      field: 'score',
      headerName: 'Game Score',
    },
  ];


  return (
    <Container>
      <h1>Recommendations
      </h1>
      <Divider />
      {/* AppCard is a custom component that we made. selectedSongId && <SongCard .../> makes use of short-circuit logic to only render the SongCard if a non-null song is selected */}
      {selectedAppId && <AppCard appId={selectedAppId} handleClose={() => setSelectedAppId(null)} />}
      

      <Divider />
      <h2>Our Most Active Users' choice</h2>
      <LazyTable route={`http://${config.server_host}:${config.server_port}/recommendation/recommended_by_most_active_user`} columns={appColumns} />
      <Divider />

      <Divider />
      <h2>#Hot! Games with the most Reviews</h2>
      <LazyTable route={`http://${config.server_host}:${config.server_port}/recommendation/recommended_by_most_reviews`} columns={appColumns} />
      <Divider />

      <Divider />
      <h2>Exclusive on Mac not Windows!</h2>
      <LazyTable route={`http://${config.server_host}:${config.server_port}/recommendation/recommend_with_system?want_to_operate=${want_to_operate}&do_not_want_to_operate=${do_not_want_to_operate}`} columns={appColumns} />
      <Divider />

      <Divider />
      <h2>Your Recommendation from the Current Month</h2>
      <LazyTable route={`http://${config.server_host}:${config.server_port}/recommendation/top_game_curr_month_all_time`} columns={appWithScoreColumns} default_input_month={input_month}/>
      <Divider />

      <Divider />
      <h2>General Top Games - Trust our algorithm</h2>
      <LazyTable route={`http://${config.server_host}:${config.server_port}/recommendation/top_games_most_recommend`} columns={appColumns} />
      <Divider />
      


      
      
    </Container>
  );
};
