import { Card, List } from '@mui/material';
import Grid2 from '@mui/material/Unstable_Grid2';
import PropTypes from 'prop-types';
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { NavItem } from './nav-item';
import { settingConfig } from './config-settings';

const SettingLayout = ({ children }) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  return (
    <Grid2 container spacing={3}>
      <Grid2 xs={12} md={3}>
        <Card
          sx={{
            py: 2,
            borderRadius: 1,
          }}
        >
          <List>
            {settingConfig.map((item, index) => (
              <NavItem key={index} item={item} pathname={pathname} navigate={navigate} />
            ))}
          </List>
        </Card>
      </Grid2>
      <Grid2 xs={12} md={9}>
        {children}
      </Grid2>
    </Grid2>
  );
};

export default SettingLayout;
SettingLayout.propTypes = {
  children: PropTypes.node.isRequired,
};
