import React from 'react';
import { Container, Grid, Button, Link, Typography } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import TextField from '@material-ui/core/TextField';
import { useFormik } from 'formik';
import { makeStyles } from '@material-ui/core/styles';
import Title from '../components/Titles/Title';
import makeAPIRequest from '../Api';

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(5),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  form: {
    width: '100%',
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  }
}));

const Register = () => {
  const history = useHistory();
  const classes = useStyles();

  const validate = values => {
    const errors = {};
    // check username format
    if (!values.username) {
      errors.username = 'Required'
    } else if (
      /$[0-9]+^/.test(values.username)
    ) {
      errors.username = 'Username cannot be all numbers'
    }
    // check email format
    if (!values.email) {
      errors.email = 'Required';
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
    ) {
      errors.email = 'Invalid email address';
    }
    // check password
    if (!values.password) {
      errors.password = 'Required';
    } else if (values.password.length < 8 || values.password.length > 50) {
      errors.password = 'Password can only be between 8 and 50 characters'
    }
    return errors;
  };

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
      email: '',
    },
    validate,
    onSubmit: (values, { setSubmitting }) => {
      const body = JSON.stringify({
        name: values.username,
        email: values.email,
        password: values.password,
      })

      console.log(JSON.parse(body))

      // handle register
      makeAPIRequest('user', 'POST', null, null, body)
        .then(res => {
          localStorage.clear();
          console.log(res)
          localStorage.setItem('user', JSON.stringify(res));
          alert("Register successfully, directing to dashboard");
          history.push('/dashboard');
        })
        .catch(err => {
          if (err.status === 400) alert('Email has been used, please try another one');
          else if (err.status === 401) alert('Maximum number of users is reached.')
          else alert('Error occur. Please try again.')
          setSubmitting(false);
        })
     
    },
  });

  return (
    <div className={classes.paper}>
        <Container component='main' maxWidth='xs'>
          <Title className={classes.toptext}>
            Join Vendorchain
          </Title>
          <form className={classes.form} onSubmit={formik.handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  name="username"
                  variant="outlined"
                  required
                  fullWidth
                  id="username"
                  label="Username"
                  defaultValue={formik.values.username}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={Boolean(formik.errors.username)}
                  helperText={formik.errors.username}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                    name="password"
                    variant="outlined"
                    required
                    fullWidth
                    id="password"
                    label="Password"
                    type='password'
                    defaultValue={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={Boolean(formik.errors.password)}
                    helperText={formik.errors.password}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  id="email"
                  label="Email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  onChange={formik.handleChange}
                  defaultValue={formik.values.email}
                  onBlur={formik.handleBlur}
                  error={Boolean(formik.errors.email)}
                  helperText={formik.errors.email}
                />
              </Grid>
            </Grid>
            <Button
              type='submit'
              variant="contained"
              color="primary"
              fullWidth
              className={classes.submit}
            >
              Sign Up
            </Button>
            <Grid container justify='flex-end'>
              <Grid item>
              <Typography
                  color="textSecondary"
                  variant="body1"
                >
                  Already have an account?
                  <Button
                    color="primary"
                    style={{ padding: '10px' }}
                    onClick={() => history.push('/login')}
                    >
                    Sign in
                  </Button>
                </Typography>
              </Grid>
            </Grid>
          </form>
        </Container>
      </div>
  );
};

export default Register;
