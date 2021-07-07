import React from 'react';
import 'fontsource-roboto';
import PropTypes from 'prop-types';
import {
  Typography
} from '@material-ui/core';

import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  title: {
    padding: '20px',
    textAlign: 'center',
    color: props => props.color,
  }
});
const Title = ({ children, color }) => {
  const classes = useStyles({ color });

  return (
    <Typography variant="h5" className={classes.title}>
      { children }
    </Typography>
  )
};

Title.propTypes = {
  children: PropTypes.node,
  color: PropTypes.string,
}

export default Title;
