import {
    Button,
    Container,
    TextField,
    Box,
    Typography,
    Grid,
} from '@material-ui/core';
  
import React from 'react';
import { Formik } from 'formik';
// import { makeStyles } from '@material-ui/core/styles';
import styled from 'styled-components';
import { Link, useHistory } from 'react-router-dom';
// import styles from './styles.css';
import Title from '../components/Titles/Title';
import ConditionsForm from '../components/ConditionsForm';

const StyledLayout = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 20px;
`;

const outline = {
    // border: '1px solid gray'
}



const ContractEdit = () => {
    // const classes = useStyles();
    const history = useHistory();
    // const handleSubmit = (values, { setSubmitting }) => {
    //     const body = JSON.stringify({
            
    //     })
    //     // TODO: submit a new contract
    // }

    React.useEffect(() => {
        // TODO: fetch conditions from database

    }, []);



return (
    <Container component="main" maxWidth="lg">
        <StyledLayout>
            <Title>Edit Contract (TODO)</Title>
            <Grid container spacing={3}>
                <Grid item xs={12} md={6} lg={6} style={outline}>
                    <Typography variant='h4'>Details</Typography>
                    <hr />
                    <Typography variant='h5'>Description</Typography>
                    <Typography variant='body1'>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer ac tristique erat. Nulla ut rhoncus tortor. Praesent id turpis ac ex fringilla euismod. Proin sodales posuere massa, ac maximus erat faucibus id. Proin viverra est ac nulla luctus, id ultricies sem hendrerit. Duis euismod sodales purus, non vulputate tellus cursus vel. Etiam ac mi fermentum, dapibus ante eget, accumsan dui. Curabitur a enim id enim posuere auctor. Donec </Typography>
                    <hr />
                    <Typography variant='h5'>Address</Typography>
                    <Typography variant='body1'>xxxxxxxx-xxxxxxxx-xxxxxxxx-xxxxxxxx</Typography>
                    <hr />
                    <Typography variant='h5'>Parties</Typography>
                    <Typography varaint='body1'>
                        <ul>
                            <li>Company 1</li>
                            <li>Company 2</li>
                            <li>Company 3</li>
                        </ul>
                    </Typography>
                </Grid>
                <Grid item xs={12} md={6} lg={6} style={outline}>
                    <Box
                        display='flex'
                        flexDirection='column'
                        justifyContent='space-around'
                        alignItems='flex-end'
                        height='100%'
                    >
                        <Button variant='outlined' color='primary' size='large'>Invite Parties</Button>
                        <Button variant='outlined' color='primary' size='large'>Deploy</Button>
                        <Button variant='outlined' color='secondary' size='large'>Delete</Button>
                    </Box>
                </Grid>
                <Grid item xs={12} md={12} lg={12} style={outline}>
                    
                    <ConditionsForm />

                </Grid>
            </Grid>
        </StyledLayout>
    </Container>
);
}


export default ContractEdit;
