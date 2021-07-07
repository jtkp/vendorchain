import { Box, Container, Grid, Link, Button } from '@material-ui/core';
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

  React.useEffect(() => {
    if (localStorage.getItem('user')) {
      // TODO: fetch dashboard info and contracts here
      const contract = JSON.parse(localStorage.getItem('contract'));
      console.log(contract);
      if (contract != null) setContracts([contract]);

    } else {
      alert('Fail to fetch quizzes: Please login again.');
      history.push('/home');
    }
  }, []);

  console.log(contracts);

  return (
    <Container>
      <Title>
        Dashboard
      </Title>
      {
        localStorage.getItem('user')
          ? (
              <Box>
                <Subtitle>You currently have xx contracts in total. <br/>Click them to edit the contract, or click the button below to create/import a new contract.</Subtitle>
                <Box 
                  display='flex' 
                  flexDirection='row'
                  justifyContent='space-around'
                  p={3}
                >
                  <CreateContractModal setContracts={setContracts}/>
                  <ImportModal contracts={contracts} setContracts={setContracts}/>
                </Box>
                  <List>
                    {
                      contracts.map((c) => {
                        return (
                          <Button 
                            color='primary' 
                            variant='outlined'
                            className={classes.root}
                            // component={ Link } 
                            href={`/contract/edit/${c.name}`}  
                            key={c}
                          >
                              <ListItemText
                                primary={c.name}
                                seconday={'Other info'}
                              />
                              <ListItemSecondaryAction>
                                <IconButton edge="end" aria-label="delete">
                                  <DeleteIcon />
                                </IconButton>
                              </ListItemSecondaryAction>
                          </Button>
                        )
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
