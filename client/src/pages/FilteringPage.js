import { useEffect, useState } from 'react';
import { Button, Checkbox, Container, FormControlLabel, Grid, Link, Slider, TextField } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

import AppCard from '../components/AppCard';
import { formatDuration } from '../helpers/formatter';
const config = require('../config.json');

export default function FilteringPage() {
  const [pageSize, setPageSize] = useState(10);
  const [data, setData] = useState([]);
  const [selectedAppId, setSelectedAppId] = useState(null);

  const [title, setTitle] = useState('');

  const [date_release, set_date_release] = useState(["2010-01-01", "2022-01-01"]);
  const [rating, set_rating] = useState(["Very Negative", "Very Positive"]);
  const [positive_ratio, set_positive_ratio] = useState([0, 100]);
  const [user_reviews, set_user_reviews] = useState([0, 7000000]);
  const [price_final, set_price_final] = useState([0, 59.99]);
  const [price_original, set_price_original] = useState([0,59.99]);
  const [discount, set_discount] = useState([0,100]);
  

  useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/search_filter`)
      .then(res => res.json())
      .then(resJson => {
        const appsWithId = resJson.map((app) => ({ id: app.app_id, ...app }));
        setData(appsWithId);
      });
  }, []);

  const search = () => {
    fetch(`http://${config.server_host}:${config.server_port}/search_filter?title=${title}` +
      `&date_release_low=${date_release[0]}&date_release_high=${date_release[1]}` +
      `&positive_ratio_low=${positive_ratio[0]}&positive_ratio_high=${positive_ratio[1]}` +
      `&user_reviews_low=${user_reviews[0]}&user_reviews_high=${user_reviews[1]}` +
      `&price_final_low=${price_final[0]}&price_final_high=${price_final[1]}` +
      `&price_original_low=${price_original[0]}&price_original_high=${price_original[1]}` +
      `&discount_low=${discount[0]}&discount_high=${discount[1]}`
    )
      .then(res => res.json())
      .then(resJson => {
        // DataGrid expects an array of objects with a unique id.
        // To accomplish this, we use a map with spread syntax (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax)
        const appsWithId = resJson.map((app) => ({ id: app.app_id, ...app }));
        setData(appsWithId);
      });
  }

  // This defines the columns of the table of songs used by the DataGrid component.
  // The format of the columns array and the DataGrid component itself is very similar to our
  // LazyTable component. The big difference is we provide all data to the DataGrid component
  // instead of loading only the data we need (which is necessary in order to be able to sort by column)
  const columns = [
    { field: 'title', headerName: 'Title', width: 300, renderCell: (params) => (
        <Link onClick={() => setSelectedAppId(params.row.app_id)}>{params.value}</Link>
    ) },
    { field: 'date_release', headerName: 'date_release' },
    { field: 'rating', headerName: 'rating' },
    { field: 'positive_ratio', headerName: 'positive_ratio' },
    { field: 'user_reviews', headerName: 'user_reviews' },
    { field: 'price_final', headerName: 'price_final' },
    { field: 'price_original', headerName: 'price_original' },
    { field: 'discount', headerName: 'discount' },
    
  ]

  // This component makes uses of the Grid component from MUI (https://mui.com/material-ui/react-grid/).
  // The Grid component is super simple way to create a page layout. Simply make a <Grid container> tag
  // (optionally has spacing prop that specifies the distance between grid items). Then, enclose whatever
  // component you want in a <Grid item xs={}> tag where xs is a number between 1 and 12. Each row of the
  // grid is 12 units wide and the xs attribute specifies how many units the grid item is. So if you want
  // two grid items of the same size on the same row, define two grid items with xs={6}. The Grid container
  // will automatically lay out all the grid items into rows based on their xs values.

  //TODO: set ratings 

  return (
    <Container>
      {selectedAppId && <AppCard songId={selectedAppId} handleClose={() => setSelectedAppId(null)} />}
      <h2>Search Games</h2>
      <Grid container spacing={6}>
        <Grid item xs={8}>
          <TextField label='Title' value={title} onChange={(e) => setTitle(e.target.value)} style={{ width: "100%" }}/>
        </Grid>
        {/* <Grid item xs={6}>
          <p>date_release</p>
          <Slider
            value={date_release}
            min={2010-01-01}
            max={2022-01-01}
            step={10}
            onChange={(e, newValue) => set_date_release(newValue)}
            valueLabelDisplay='auto'
            valueLabelFormat={value => <div>{value}</div>}
          />
        </Grid> */}
        
        {/* Hint: consider what value xs should be to make them fit on the same row. Set max, min, and a reasonable step. Is valueLabelFormat is necessary?
              not really here because previously we need better interprebaility or readability so we convert duration to time and we convert unit to make number
              shorter. Since the following are all from 0 to 1 there isn't such need*/}
        <Grid item xs={4}>
          <p>positive_ratio</p>
          <Slider
            value={positive_ratio}
            min={0}
            max={1}
            step={0.1}
            onChange={(e, newValue) => set_positive_ratio(newValue)}
            valueLabelDisplay='auto'
            // valueLabelFormat={value => <div>{value}</div>}
          />
        </Grid>
        <Grid item xs={4}>
          <p>user_reviews</p>
          <Slider
            value={user_reviews}
            min={0}
            max={1}
            step={0.1}
            onChange={(e, newValue) => set_user_reviews(newValue)}
            valueLabelDisplay='auto'
            valueLabelFormat={value => <div>{value}</div>}
          />
        </Grid>
        <Grid item xs={4}>
          <p>price_final</p>
          <Slider
            value={price_final}
            min={0}
            max={1}
            step={0.1}
            onChange={(e, newValue) => set_price_final(newValue)}
            valueLabelDisplay='auto'
            valueLabelFormat={value => <div>{value}</div>}
          />
        </Grid>
        <Grid item xs={4}>
          <p>price_original</p>
          <Slider
            value={price_original}
            min={0}
            max={1}
            step={0.1}
            onChange={(e, newValue) => set_price_original(newValue)}
            valueLabelDisplay='auto'
            valueLabelFormat={value => <div>{value}</div>}
          />
        </Grid>
        <Grid item xs={4}>
          <p>discount</p>
          <Slider
            value={discount}
            min={0}
            max={1}
            step={0.1}
            onChange={(e, newValue) => set_discount(newValue)}
            valueLabelDisplay='auto'
            valueLabelFormat={value => <div>{value}</div>}
          />
        </Grid>
      </Grid>
      <Button onClick={() => search() } style={{ left: '50%', transform: 'translateX(-50%)' }}>
        Search
      </Button>
      <h2>Results</h2>
      {/* Notice how similar the DataGrid component is to our LazyTable! What are the differences? */}
      <DataGrid
        rows={data}
        columns={columns}
        pageSize={pageSize}
        rowsPerPageOptions={[5, 10, 25]}
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        autoHeight
      />
    </Container>
  );
}