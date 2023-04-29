import { useEffect, useState } from 'react';
import { Container, Divider, Link } from '@mui/material';
import { NavLink } from 'react-router-dom';



import LazyTable from '../components/LazyTable';
import AppCard from '../components/AppCard';
const config = require('../config.json');

export default function SystemsPage() {
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
      field: 'title',
      headerName: 'Game Title',
      renderCell: (row) => <Link onClick={() => setSelectedAppId(row.app_id)}>{row.title}</Link> // A Link component is used just for formatting purposes
    },
  ];
  

  // const appHourColumns = [
  //   {
  //     field: 'title',
  //     headerName: 'Game Title',
  //     renderCell: (row) => <Link onClick={() => setSelectedAppId(row.app_id)}>{row.title}</Link> // A Link component is used just for formatting purposes
  //   },
  //   {
  //     field: 'average_hours',
  //     headerName: 'Game Title',
  //   },
  // ];



  return (
    <Container>
      <h1>Games
      </h1>
      <Divider />
      {/* AppCard is a custom component that we made. selectedSongId && <SongCard .../> makes use of short-circuit logic to only render the SongCard if a non-null song is selected */}
      {selectedAppId && <AppCard appId={selectedAppId} handleClose={() => setSelectedAppId(null)} />}
      
      <p>Games that have the top 5 number of user reviews on or after 2020 available on each system.</p>
      <Divider />
      <h2>MAC</h2>
      
      <LazyTable route={`http://${config.server_host}:${config.server_port}/system/system_type/mac`} columns={appColumns} />
      <Divider />

      <Divider />
      <h2>WINDOWS</h2>
      <LazyTable route={`http://${config.server_host}:${config.server_port}/system/system_type/win`} columns={appColumns} />
      <Divider />


      <Divider />
      <h2>LINUX</h2>
      <LazyTable route={`http://${config.server_host}:${config.server_port}/system/system_type/linux`} columns={appColumns} />
      <Divider />

      {/* <Divider />
      <h2>Stat</h2>
      <p>average number of hours played for all “Very Positive” rating  games.</p>
      <LazyTable route={`http://${config.server_host}:${config.server_port}/system/statistics`} columns={appHourColumns} />
      <Divider /> */}
      


    
      
    </Container>
  );
}
