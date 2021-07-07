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

const StyledLayout = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 20px;
`;


const ContractEdit = () => {
    // const classes = useStyles();
    const history = useHistory();

    // const handleSubmit = (values, { setSubmitting }) => {
    //     const body = JSON.stringify({
            
    //     })
    //     // TODO: submit a new contract
    // }

return (
    <Container component="main" maxWidth="md">
        <StyledLayout>
            <Title>Edit Contract (TODO)</Title>

        </StyledLayout>
    </Container>
);
}


export default ContractEdit;
