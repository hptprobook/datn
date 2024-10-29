import { Card, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';

const CardHaveTitle = ({ children, title, sx }) => (
  <Card
    sx={{
      padding: 2,
      ...sx,
    }}
  >
    <Typography mb={2} variant="h6">
      {title}
    </Typography>
    {children}
  </Card>
);
CardHaveTitle.propTypes = {
  children: PropTypes.node,
  title: PropTypes.string,
  sx: PropTypes.any,
};
export default CardHaveTitle;
