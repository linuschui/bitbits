import React from 'react';
import { NavLink } from 'react-router-dom';
import Button from '@mui/material/Button';

export const Header = () => {
  return (
    <nav style={{ padding: 10, backgroundColor: '#f0f0f0' }}>
      <Button
        component={NavLink}
        to="/"
        exact
        style={({ isActive }) => ({
          textDecoration: 'none',
          color: isActive ? 'green' : 'black',
          margin: '0 10px',
        })}
        variant="contained"
      >
        Home
      </Button>
      <Button
        component={NavLink}
        to="/patrol"
        style={({ isActive }) => ({
          textDecoration: 'none',
          color: isActive ? 'green' : 'black',
          margin: '0 10px',
        })}
        variant="contained"
      >
        Patrol
      </Button>
    </nav>
  );
};
