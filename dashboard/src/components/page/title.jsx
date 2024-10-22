import { Stack, IconButton, Typography } from '@mui/material';
import React from 'react';
import PropTypes from 'prop-types';
import Iconify from '../iconify';

const TitlePage = ({ title, onClick }) => (
  <Stack direction="row" alignItems="center" spacing={1} mb={2}>
    <Typography variant="h5">{title}</Typography>
    {onClick && (
      <IconButton onClick={onClick}>
        <Iconify icon="mdi:reload" />
      </IconButton>
    )}
  </Stack>
);

export default TitlePage;
TitlePage.propTypes = {
  title: PropTypes.string,
  onClick: PropTypes.func,
};
