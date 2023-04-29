import * as React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import ReviewsIcon from '@mui/icons-material/Reviews';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import PeopleIcon from '@mui/icons-material/People';
import AndroidIcon from '@mui/icons-material/Android';
import AssignmentIcon from '@mui/icons-material/Assignment';

import { NavLink } from 'react-router-dom';
import Typography from '@mui/material/Typography';

const NavText = ({ href, text, isMain }) => {
  return (
    <Typography
      variant={isMain ? 'h5' : 'h7'}
      noWrap
      style={{
        marginRight: '30px',
        fontFamily: 'monospace',
        fontWeight: 700,
        // letterSpacing: '.3rem',
      }}
    >
      <NavLink
        to={href}
        style={{
          color: 'inherit',
          textDecoration: 'none',
        }}
      >
        {text}
      </NavLink>
    </Typography>
  )
}

export const mainListItems = (
  <React.Fragment>
    <ListItemButton>
      <ListItemIcon>
        <ReviewsIcon />
      </ListItemIcon>
      {/* <ListItemText href='/recommendation' primary="RECOMMENDATIONS" /> */}
      <NavText href='/recommendation' text='Recommendations' />
    </ListItemButton>
    <ListItemButton>
      <ListItemIcon>
        <SportsEsportsIcon />
      </ListItemIcon>
      <NavText href='/games' text='Games' />
    </ListItemButton>
    <ListItemButton>
      <ListItemIcon>
        <AndroidIcon />
      </ListItemIcon>
      <NavText href='/system' text='Systems' />
    </ListItemButton>
    <ListItemButton>
      <ListItemIcon>
        <PeopleIcon />
      </ListItemIcon>
      <NavText href='/users' text='Users' />
    </ListItemButton>
    <ListItemButton>
      <ListItemIcon>
        <FilterAltIcon />
      </ListItemIcon>
      <NavText href='/filtering' text='Filter' />
    </ListItemButton>
  </React.Fragment>
);

export const secondaryListItems = (
  <React.Fragment>
    <ListSubheader component="div" inset>
      Saved reports
    </ListSubheader>
    <ListItemButton>
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary="Current month" />
    </ListItemButton>
    <ListItemButton>
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary="Last quarter" />
    </ListItemButton>
    <ListItemButton>
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary="Year-end sale" />
    </ListItemButton>
  </React.Fragment>
);
