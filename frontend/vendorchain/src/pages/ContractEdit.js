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
import { Link, useParams, useHistory } from 'react-router-dom';
import Title from '../components/Titles/Title';
import Conditionsitem from '../components/ConditionsItem';
import makeAPIRequest from '../Api';

const StyledLayout = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 20px;
`;


const ContractEdit = () => {
    const params = useParams();
    // const classes = useStyles();
    const history = useHistory();
    const [conditions, setConditions] = React.useState([]);
    const [contract, setContract] = React.useState({});
    const [btnValue, setBtnValue] = React.useState('');

    // const handleSubmit = (values, { setSubmitting }) => {
    //     const body = JSON.stringify({
            
    //     })
    //     // TODO: submit a new contract
    // }

    const conditionObj = {
        categories: '',
        operator: '',
        input: 0,
    }

    const addCondition = () => {
        setConditions([...conditions, conditionObj]);
    }
    const removeCondition = (e) => {
        const newConditions = [...conditions];
        //TODO:
        // conditions.splice(conditions.indexOf(e.target), 1);
        setConditions(newConditions);
    }

    const handleDelete = (e) => {
        makeAPIRequest(`contract/${params.id}`, 'DELETE', null, null, null)
            .then(res => {
                history.push('/dashboard');
            })
            .catch(err => {
                console.log(err);
                alert("Fail to delete contract.")
            })
    }

    React.useEffect(() => {
        //  fetch conditions from database
        makeAPIRequest(`contract/${params.id}`, 'GET', null, null, null) 
            .then(res => {
                setContract(res[0]);
                if (res[0].status === 'Ready') setBtnValue('Deploy');
                else setBtnValue('Save');

            }).then(
                makeAPIRequest(`conditions/${params.id}`, 'GET', null, null, null)
                .then(res => setConditions(res))
                .catch(err => {
                    console.log(err);
                    alert("Error fetching conditions");
                })
            )
            .catch(err => {
                console.log(err);
                alert("Error fetching contract detail")
            })
    }, []);

    console.log("conditions: ", conditions)
    console.log("contract: ", contract)
return (
    <Container component="main" maxWidth="lg">
        <StyledLayout>
            <Title>Edit Contract {contract.title}</Title>
            <Grid container spacing={3}>
                <Grid item xs={12} md={6} lg={6}>
                    <Typography variant='h4'>Details</Typography>
                    <hr />
                    <Typography variant='h6'>Title</Typography>
                    <Typography variant='body2'>{contract.title}</Typography>
                    <hr />
                    <Typography variant='h6'>Owner ID</Typography>
                    <Typography variant='body2'>{contract.owner}</Typography>
                    <hr />
                    <Typography variant='h6'>Contract ID</Typography>
                    <Typography variant='body2'>{contract.contractID}</Typography>
                    <hr />
                    <Typography variant='h6'>State</Typography>
                    <Typography variant='body2'>{contract.state}</Typography>
                    <hr />
                    <Typography variant='h6'>Creation Date</Typography>
                    <Typography variant='body2'>{contract.creation_date}</Typography>
                    <hr />
                    <Typography variant='h6'>Description</Typography>
                    <Typography variant='body2'>{contract.description}</Typography>
                    <hr />
                    <Typography variant='h6'>Address</Typography>
                    <Typography variant='body2'>{contract.address === null ? "Not Available" : contract.address}</Typography>
                    <hr />
                    <Typography variant='h6'>Parties</Typography>
                    <ul>
                        <Typography varaint='body1'>
                            <li>Company 1</li>
                            <li>Company 2</li>
                            <li>Company 3</li>
                        </Typography>
                    </ul>
                </Grid>
                <Grid item xs={12} md={6} lg={6}>
                    <Box
                        display='flex'
                        flexDirection='column'
                        justifyContent='space-around'
                        alignItems='flex-end'
                        height='100%'
                    >
                        <Button variant='outlined' color='primary' size='large' disabled={btnValue === ''}>Invite Parties</Button>
                        <Button variant='outlined' color='primary' size='large' disabled={btnValue === ''}>{btnValue}</Button>
                        <Button variant='outlined' color='secondary' size='large' disabled={btnValue === ''} onClick={handleDelete}>Delete</Button>
                    </Box>
                </Grid>
                <Grid item xs={12} md={12} lg={12}>
                    
                    <Button
                        variant='outlined' 
                        color='primary' 
                        size='large' 
                        style={{width:'100%'}}
                        onClick={addCondition}
                    >
                        Add conditions
                    </Button>
                    <Box
                        display='flex'
                        flexDirection='column'
                        width='100%'
                    >
                        {
                            conditions.map((c, idx) => <Conditionsitem condition={c} idx={idx} key={idx} removeCondition={removeCondition} />)
                        }
                    </Box>


                </Grid>
            </Grid>
        </StyledLayout>
    </Container>
);
}


export default ContractEdit;
