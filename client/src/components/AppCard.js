import { useEffect, useState } from 'react';
import { Box, Button, ButtonGroup, Link, Modal } from '@mui/material';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';
import { NavLink } from 'react-router-dom';

import { formatDuration } from '../helpers/formatter';
const config = require('../config.json');

// SongCard is a modal (a common example of a modal is a dialog window).
// Typically, modals will conditionally appear (specified by the Modal's open property)
// but in our implementation whether the Modal is open is handled by the parent component
// (see HomePage.js for example), since it depends on the state (selectedSongId) of the parent
export default function AppCard({ appId, handleClose }) {
  const [appData, setAppData] = useState({});
  const [systemData, setSystemData] = useState({});
  // const [albumData, setAlbumData] = useState({});

  const [barRadar, setBarRadar] = useState(true);

  // TODO (TASK 20): fetch the song specified in songId and based on the fetched album_id also fetch the album data
  // Hint: you need to both fill in the callback and the dependency array (what variable determines the information you need to fetch?)
  // Hint: since the second fetch depends on the information from the first, try nesting the second fetch within the then block of the first (pseudocode is provided)
  useEffect(() => {
    // Hint: here is some pseudocode to guide you
    // fetch(song data, id determined by songId prop)
    //   .then(res => res.json())
    //   .then(resJson => {
    //     set state variable with song dta
    //     fetch(album data, id determined by result in resJson)
    //       .then(res => res.json())
    //       .then(resJson => set state variable with album data)
    //     })
      fetch( `http://${config.server_host}:${config.server_port}/app/${appId}`)
      .then(res => res.json())
      .then(resJson => {
        setAppData(resJson);
        // console.log(resJson)
        // const album_id = resJson.album_id;
        // fetch(`http://${config.server_host}:${config.server_port}/album/${album_id}`)
        //   .then(res => res.json())
        //   .then(resJson => setAlbumData(resJson))
        });
      fetch( `http://${config.server_host}:${config.server_port}/system/${appId}`)
      .then(res => res.json())
      .then(resJson => {
        setSystemData(resJson);
        });
  }, [appId]);

  // const chartData = [
  //   { name: 'Danceability', value: songData.danceability },
  //   { name: 'Energy', value: songData.energy },
  //   { name: 'Valence', value: songData.valence },
  // ];

  // const handleGraphChange = () => {
  //   setBarRadar(!barRadar);
  // };
  // console.log(appData.date_release.substring(0, 10))
  let dateStr = '';
  if (appData && appData.date_release) {
    dateStr = appData.date_release.substring(0, 10);
  }

  let os_systems = '';
  if (systemData && systemData.length >= 1) {
    for (let i = 0; i < systemData.length; i++) {
      if (systemData[i].os_name === 'win') {
        os_systems += 'Windows, ';
      } else if (systemData[i].os_name === 'mac') {
        os_systems += 'Mac, ';
      } else {
        os_systems += 'Linux, ';
      }
      
    }
    os_systems = os_systems.substring(0, os_systems.length - 2)
  }

  return (
    <Modal
      open={true}
      onClose={handleClose}
      style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
    >
      <Box
        p={3}
        style={{ background: 'white', borderRadius: '16px', border: '2px solid #000', width: 600 }}
      >
        <h1>{appData.title}</h1>
        <p>Release Date: {dateStr}</p>


        {/* //TODO */}
        <h2>Rating Statistics</h2>
        <p>Rating: {appData.rating}</p>
        <p>Positive Ratio: {appData.positive_ratio} %</p>
        <p>Number of User Reviews: {appData.user_reviews}</p>


        <h2>System</h2>
        <p>{os_systems}</p>

        <h2>Pricing & Discount</h2>

        <p>Final Price: $ {appData.price_final}</p>
        <p>Original Price: $ {appData.price_original}</p>
        <p>Discount: {appData.discount} % </p>


        {/* <p>Tempo: {songData.tempo} bpm</p>
        <p>Key: {songData.key_mode}</p> */}
        {/* <ButtonGroup>
          <Button disabled={barRadar} onClick={handleGraphChange}>Bar</Button>
          <Button disabled={!barRadar} onClick={handleGraphChange}>Radar</Button>
        </ButtonGroup> */}
        {/* <div style={{ margin: 20 }}>
          { // This ternary statement returns a BarChart if barRadar is true, and a RadarChart otherwise
            barRadar
              ? (
                <ResponsiveContainer height={250}>
                  <BarChart
                    data={chartData}
                    layout='vertical'
                    margin={{ left: 40 }}
                  >
                    <XAxis type='number' domain={[0, 1]} />
                    <YAxis type='category' dataKey='name' />
                    <Bar dataKey='value' stroke='#8884d8' fill='#8884d8' />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <ResponsiveContainer height={250}>
                  {/* TODO (TASK 21): display the same data as the bar chart using a radar chart */}
                  {/* Hint: refer to documentation at https://recharts.org/en-US/api/RadarChart */}
                  {/* Hint: note you can omit the <Legend /> element and only need one Radar element, as compared to the sample in the docs */}
                  {/* <RadarChart outerRadius={90} width={730} height={250} data={chartData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="name" />
                    <PolarRadiusAxis angle={90} domain={[0, 1]} />
                    <Radar name="value" dataKey="value" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                  </RadarChart>
                </ResponsiveContainer>
              )
          }
        </div> */} 
        <Button onClick={handleClose} style={{ left: '50%', transform: 'translateX(-50%)' }} >
          Close
        </Button>
      </Box>
    </Modal>
  );
}
