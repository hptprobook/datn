import { Box, LinearProgress, linearProgressClasses } from '@mui/material';
import React from 'react';
// Import PropTypes

const LoadingHeader = () => (
  <Box
    display="flex"
    flex="1 1 auto"
    sx={{
      position: 'fixed', // Use the position prop
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 9999,
      backgroundColor: 'rgba(255, 255, 255, 0.5)',
    }}
  >
    <LinearProgress
      sx={{
        width: 1,
        maxWidth: '100%',
        [`& .${linearProgressClasses.bar}`]: { bgcolor: 'text.primary' },
      }}
    />
  </Box>
);

// LoadingHeader.propTypes = {
//   position: PropTypes.string, // Validate that position is a string
// };

export default LoadingHeader;
