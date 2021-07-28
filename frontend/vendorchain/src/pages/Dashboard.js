import { Box, Container, Grid, Link, Button, Typography } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import React from 'react';
import Title from '../components/Titles/Title';
import Subtitle from '../components/Titles/Subtitle';
import CreateContractModal from '../components/Modals/CreateContractModal';
import ImportModal from '../components/Modals/ImportModal';

import {
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  IconButton,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import DeleteIcon from '@material-ui/icons/Delete';
import makeAPIRequest from '../Api';


const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    width: '100%',
    // border: '1px solid lightgray',
    borderRadius: '3px',
    textAlign: 'left',
    // transition: 'backgroundColor 1s ease-in-out',
    '&:hover': {
      cursor: 'pointer',
    }
  },
}));


const Dashboard = () => {
  const history = useHistory();
  const classes = useStyles();
  const [contracts, setContracts] = React.useState([]);
  const [invited, setInvited] = React.useState([]);

  React.useEffect(() => {
    const loggedin = localStorage.getItem('user');
    const user = JSON.parse(loggedin);

    // if logged in
    if (loggedin != null) {

      if (JSON.parse(localStorage.getItem('user')).isAdmin) {
        // fetch contracts created by myself
        makeAPIRequest(`contracts/${user.address}`, 'GET', null, null, null)
          .then (res => {
            console.log('my contracts', res)
            setContracts(res);
          }).catch(err => {
            alert('Fetch contracts failed, please try again later');
            console.log(err);
          })
      }
      
      // fetch contracts that invite me as payee
      makeAPIRequest(`contracts/payee/${user.address}`, 'GET', null, null, null)
        .then(res => {
          console.log('contracts invited', res);
          setInvited(res);
        }).catch(err => {
          alert('Fetch contracts to pay failed, please try again later');
          console.log(err);
        })

    } else {
      alert('Fail to fetch contracts: Please login again.');
      history.push('/home');
    }
  }, []);

  const handleDelete = (event) => {
    console.log(event)
  }

  return (
    <Container>
      <Title>
        Dashboard
      </Title>
      {
        localStorage.getItem('user') !== null
          ? (
              <Box>
                <Subtitle>Click them to view/edit the contract.</Subtitle>
                <Box 
                  display='flex' 
                  flexDirection='row'
                  justifyContent='space-around'
                  p={3}
                >
                {
                  JSON.parse(localStorage.getItem('user')).isAdmin && 
                  <CreateContractModal contracts={contracts} setContracts={setContracts}/>
                }
                </Box>
                {
                  JSON.parse(localStorage.getItem('user')).isAdmin && 
                  <List>
                    <Typography variant='h4'>My contracts</Typography>
                    {
                      contracts.map((c, idx) => {
                        console.log(c)
                        if (c !== undefined) {
                          return (
                            <Button 
                              color='primary' 
                              variant='outlined'
                              className={classes.root}
                              style={{ margin: '10px' }}
                              href={`/contract/edit/${c.contractID}`}  
                              key={idx}
                            >
                                <ListItemText
                                  primary={c.title}
                                  secondary={`ID: ${c.contractID}`}
                                />
                                <ListItemText
                                  secondary={c.state}
                                />
                            </Button>
                          )
                        } else {
                          return <p key={idx}>Loading...</p>
                        }
                        
                      })
                    }
                  </List>
                }
                  <List>
                    <Typography variant='h4'>Contracts to pay</Typography>
                    {
                      contracts.map((c, idx) => {
                        console.log(c)
                        if (c !== undefined) {
                          return (
                            <Button 
                              color='primary' 
                              variant='outlined'
                              className={classes.root}
                              style={{ margin: '10px' }}
                              href={`/contract/edit/${c.contractID}`}  
                              key={idx}
                            >
                                <ListItemText
                                  primary={c.title}
                                  secondary={`ID: ${c.contractID}`}
                                />
                                <ListItemText
                                  secondary={c.state}
                                />
                            </Button>
                          )
                        } else {
                          return <p key={idx}>Loading...</p>
                        }
                        
                      })
                    }
                  </List>
              </Box>
            )
          : (
              <p>You are not logged in, please login first.</p>
            )
      }

    </Container>
  );
};

export default Dashboard;
