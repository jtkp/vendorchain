import { AppBar, Button, Toolbar, Typography } from '@material-ui/core';
import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import {
  Link,
} from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
    textDecoration: 'none'
  },
  appbar: {
    zIndex: theme.zIndex.title + 1,
  }
}));

const AppHeader = ({ logout }) => {
  const classes = useStyles();
  // Handle logout button, clear localstorage and reset current page
  const handleLogout = () => {
    // FIXME: use api to backend
    let userInfo = JSON.parse(localStorage.getItem('user'));
    userInfo.login = 'false';
    localStorage.setItem('user', JSON.stringify(userInfo));
    logout();
  }

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h4" className={classes.title} component={ Link } to='/' color="inherit">
          Vendorchain
        </Typography>
          {
            localStorage.getItem('user') && JSON.parse(localStorage.getItem('user')).login === 'true'
              /* if not logged in, show login/register button */
              ? (
                  <div>
                    <Button component={ Link } color="inherit" to='/dashboard'>Dashboard</Button>
                    <Button component={ Link } color="inherit" to='/home' onClick={handleLogout}>Logout</Button>
                  </div>
                )
              /* if logged in, show dashboard and logout button */
              : (
                  <div>
                    <Button component={ Link } color="inherit" to='/login'>Login</Button>
                    <Button component={ Link } color="inherit" to='/register'>Register</Button>
                  </div>
                )
          }
      </Toolbar>
    </AppBar>
  )
};

AppHeader.propTypes = {
  logout: PropTypes.func,
};

export default AppHeader;
