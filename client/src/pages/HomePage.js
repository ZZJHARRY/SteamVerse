import { useEffect, useState } from 'react';
import { Container, Divider, Link } from '@mui/material';
import { NavLink } from 'react-router-dom';
import PUBG from '../images/PUBG.jpg';


import LazyTable from '../components/LazyTable';
import SongCard from '../components/SongCard';
import AppCard from '../components/AppCard';
// import AppCard2 from '../components/AppCard2';
const config = require('../config.json');

export default function HomePage() {
  // We use the setState hook to persist information across renders (such as the result of our API calls)
  const [appOfTheDay, setAppOfTheDay] = useState({});
  // const [author, setAuthor] = useState();
  const [selectedAppId, setSelectedAppId] = useState('');
  const [imgURL, setImgURL] = useState('');

  //TODO: dont' hard code these
  const do_not_want_to_operate = "win";
  const want_to_operate = "mac";
  const input_month = 5;


  // The useEffect hook by default runs the provided callback after every render
  // The second (optional) argument, [], is the dependency array which signals
  // to the hook to only run the provided callback if the value of the dependency array
  // changes from the previous render. In this case, an empty array means the callback
  // will only run on the very first render.
  useEffect(() => {
    // Fetch request to get the song of the day. Fetch runs asynchronously.
    // The .then() method is called when the fetch request is complete
    // and proceeds to convert the result to a JSON which is finally placed in state.
    //TODO:change input month to current month
    fetch(`http://${config.server_host}:${config.server_port}/recommendation/random_recommendation?input_month=${input_month}`)
      .then(res => res.json())
      .then(resJson => {
        setAppOfTheDay(resJson);
        const app_title = encodeURIComponent(resJson.title.trim());
        fetch(`http://${config.server_host}:${config.server_port}/get_img/${app_title}`)
        .then(res => res.json())
        .then(resJson => setImgURL(resJson.img_url));
      });

  //   // TODO (TASK 14): add a fetch call to get the app author (name not pennkey) and store it in the state variable
  //   fetch(`http://${config.server_host}:${config.server_port}/author/name`)
  //     .then(res => res.text())
  //     .then(resJson => setAuthor(resJson));
  }, []);

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



  return (
    <Container>
      <h1>Welcome to SteamVerse!
      </h1>
      <Divider />
      {/* SongCard is a custom component that we made. selectedSongId && <SongCard .../> makes use of short-circuit logic to only render the SongCard if a non-null song is selected */}
      {selectedAppId && <AppCard appId={selectedAppId} handleClose={() => setSelectedAppId(null)} />}
      <h2>Check out your recommended game for the current month in history:&nbsp;
        {/* <Link onClick={() => setSelectedSongId(songOfTheDay.song_id)}>{songOfTheDay.title}</Link> */}
        <Link onClick={() => setSelectedAppId(appOfTheDay.app_id)}>{appOfTheDay.title}</Link>
      </h2>
      <img src={PUBG} width={1000} className="PUBG" alt="Game image" />
      <Divider></Divider>
      
    </Container>
  );
};
