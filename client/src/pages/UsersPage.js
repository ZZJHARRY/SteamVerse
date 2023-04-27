import { useEffect, useState } from 'react';
import { Container, Divider, Link } from '@mui/material';
import { NavLink } from 'react-router-dom';

import LazyTable from '../components/LazyTable';
import AppCard from '../components/AppCard';
const config = require('../config.json');

export default function UsersPage() {
  // We use the setState hook to persist information across renders (such as the result of our API calls)
  // const [appOfTheDay, setAppOfTheDay] = useState({});
  // const [author, setAuthor] = useState();
  const [selectedAppId, setSelectedAppId] = useState('');

  //TODO: dont' hard code these
  const do_not_want_to_operate = 'win';
  const want_to_operate = 'mac';
  const input_month = 6;


  // Here, we define the columns of the "Top Songs" table. The songColumns variable is an array (in order)
  // of objects with each object representing a column. Each object has a "field" property representing
  // what data field to display from the raw data, "headerName" property representing the column label,
  // and an optional renderCell property which given a row returns a custom JSX element to display in the cell.
  const appColumns = [
    {
      field: 'user_id',
      headerName: 'User Id',
      // renderCell: (row) => <Link onClick={() => setSelectedAppId(row.app_id)}>{row.app_id}</Link> // A Link component is used just for formatting purposes
      renderCell: (row) => row.user_id
    },
    {
      field: 'products',
      headerName: 'Number of products in user library',
      renderCell: (row) => row.user_id // A Link component is used just for formatting purposes
    },
    {
      field: 'reviews',
      headerName: 'Number of reviews published',
      // renderCell: (row) => < onClick={() => setSelectedAppId(row.app_id)}>{row.app_id}</Link> // A Link component is used just for formatting purposes
      renderCell: (row) => row.reviews
    },
  ];

  return (
    <Container>
      <h1>Users 
      </h1>
      <Divider />
      {/* AppCard is a custom component that we made. selectedSongId && <SongCard .../> makes use of short-circuit logic to only render the SongCard if a non-null song is selected */}
      {/* {selectedAppId && <AppCard appId={selectedAppId} handleClose={() => setSelectedAppId(null)} />}
       */}

      <Divider />
      <h2>Users who have played most games</h2>
      <LazyTable route={`http://${config.server_host}:${config.server_port}/users/products`} columns={appColumns} />
      <Divider />

      <Divider />
      {/* TODO: Update the algorithm */}
      <h2>Users who have write most reviews </h2>
      <LazyTable route={`http://${config.server_host}:${config.server_port}/users/reviews`} columns={appColumns} />
      <Divider />

      <p>Authors: Guo Cheng, Zijian Zhang, Jun Wang, Tangchao Chen</p>
      
    </Container>
  );
};
