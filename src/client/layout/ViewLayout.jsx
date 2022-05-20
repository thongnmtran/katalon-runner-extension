import React from 'react';
import Box from '@mui/material/Box';
import DefaultLayout from './DefaultLayout';


export default function ViewLayout({ children }) {
  return (
    <DefaultLayout>
      <Box sx={{
        width: '100%',
        boxSizing: 'border-box',
        paddingTop: '10px',
        paddingBottom: '10px',
        paddingRight: '10px',
        paddingLeft: '10px'
      }}
      >
        {children}
      </Box>
    </DefaultLayout>
  );
}
