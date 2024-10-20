import { FormHelperText } from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';

const FormHelpTextError = ({ label }) => <FormHelperText sx={{ color: 'red' }}>{label}</FormHelperText>;

export default FormHelpTextError;
FormHelpTextError.propTypes = {
  label: PropTypes.string,
};
