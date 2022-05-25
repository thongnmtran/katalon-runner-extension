import React from 'react';
import Box from '@mui/material/Box';
import DefaultLayout from './DefaultLayout';


export default function EditorLayout({ children }) {
  return (
    <DefaultLayout>
      <Box sx={{
        width: '100%',
        boxSizing: 'border-box',
        background: '#fcfcfc',
        paddingRight: '20px',
        paddingLeft: '20px',
        paddingBottom: '20px'
      }}
      >
        {children}
      </Box>
    </DefaultLayout>
  );
}
