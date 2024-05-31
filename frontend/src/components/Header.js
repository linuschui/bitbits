import React from 'react';
import { NavLink } from 'react-router-dom';
import Button from '@mui/material/Button';

export const Header = () => {
  return (
    <div
      className="header-container"
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
        padding: '10px',
      }}
    >
      <div style={{ fontWeight: 'bold', fontSize: '24px' }}>ReportIT</div>
      <nav>
        <NavLink to="/" exact>
          {({ isActive }) => (
            <Button
              style={{
                textDecoration: 'none',
                color: isActive ? 'black' : 'lightblue',
                margin: '0 10px',
              }}
              disabled={isActive}
              variant="contained"
            >
              Home
            </Button>
          )}
        </NavLink>
        <NavLink to="/patrol">
          {({ isActive }) => (
            <Button
              style={{
                textDecoration: 'none',
                color: isActive ? 'black' : 'lightblue',
                margin: '0 10px',
              }}
              disabled={isActive}
              variant="contained"
            >
              Patrol
            </Button>
          )}
        </NavLink>
      </nav>
    </div>
  );
};
