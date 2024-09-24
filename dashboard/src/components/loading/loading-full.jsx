import { Box, LinearProgress, linearProgressClasses } from '@mui/material';
import React from 'react';

const LoadingFull = () => (
    <Box display="flex" alignItems="center" justifyContent="center" flex="1 1 auto" sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999,
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
    }}> 
      <LinearProgress
        sx={{
          width: 1,
          maxWidth: 320,
          [`& .${linearProgressClasses.bar}`]: { bgcolor: 'text.primary' },
        }}
      />
    </Box>
  );

export default LoadingFull;
