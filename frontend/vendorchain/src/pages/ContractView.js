import {
    Button,
    Container,
    TextField,
    Box,
    Typography,
    Grid,
} from '@material-ui/core';
  
import React from 'react';
// import { makeStyles } from '@material-ui/core/styles';
import styled from 'styled-components';
import { Link, useParams, useHistory } from 'react-router-dom';
import Title from '../components/Titles/Title';
import makeAPIRequest from '../Api';

const StyledLayout = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 20px;
`;


const ContractView = () => {
    const params = useParams();
    // const classes = useStyles();
    const [contract, setContract] = React.useState({});
    const [payee, setPayee] = React.useState({});
    const [btnValue, setBtnValue] = React.useState('');

    const handleApprove = (e) => {
        const body = JSON.stringify({
            payeeAddress: payee.address,
            index: contract.index,
        })
        
        makeAPIRequest(`/contracts/${params.address}/approve`, 'PUT', null, null, body)
            .then(res => {
                alert("You have successfully approved " + contract.name);
                window.location.reload();
            })
            .catch(err => {
                alert("ERROR approving contract");
                console.log(err);
            })

    }

    React.useEffect(() => {
        //  fetch conditions blockchain
        makeAPIRequest(`contract/${params.address}`, 'GET', null, null, null) 
            .then(res => {
                console.log(res)
                setContract(res);
                if (res.stages === 1) setBtnValue('Approve');
                else if (res.stages === 3) setBtnValue('Approved');
                else setBtnValue('No Action Required');

            }).then(
                // fetch payee
                makeAPIRequest(`payee/${params.address}`, 'GET', null, null, null)
                    .then(res => setPayee(res))
                    .catch(err => {
                        alert("ERROR fetching payee");
                        console.log(err);
                    })
                
            )
            .catch(err => {
                console.log(err);
                alert("Error fetching contract detail")
            })
    }, []);

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
                    <Typography variant='body2'>{contract.client}</Typography>
                    <hr />
                    <Typography variant='h6'>Contract Address</Typography>
                    <Typography variant='body2'>{contract.address}</Typography>
                    <hr />
                    <Typography variant='h6'>State</Typography>
                    <Typography variant='body2'>{contract.stages}</Typography>
                    <hr />
                    <Typography variant='h6'>Start Date</Typography>
                    <Typography variant='body2'>{new Date(contract.startDate * 1000).toDateString()}</Typography>
                    <hr />
                    <Typography variant='h6'>Expiry Date</Typography>
                    <Typography variant='body2'>{new Date(contract.expiryDate * 1000).toDateString()}</Typography>
                    <hr />
                    <Typography variant='h6'>Previous Billing Date</Typography>
                    <Typography variant='body2'>{new Date(contract.prevBillingDate * 1000).toDateString()}</Typography>
                    <hr />
                    <Typography variant='h6'>Next Billing Date</Typography>
                    <Typography variant='body2'>{new Date(contract.nextBillingDate * 1000).toDateString()}</Typography>
                    <hr />
                    <Typography variant='h6'>Payment Amount</Typography>
                    <Typography variant='body2'>{contract.amount}</Typography>
                    <hr />
                    <Typography variant='h6'>Description</Typography>
                    <Typography variant='body2'>{contract.description}</Typography>
                    <hr />
                    <Typography variant='h6'>Payee</Typography>
                    <Typography varaint='body1'>{ payee === undefined ? '' : payee.name}</Typography>
                </Grid>
                <Grid item xs={12} md={6} lg={6}>
                    <Box
                        display='flex'
                        flexDirection='column'
                        justifyContent='space-around'
                        alignItems='flex-end'
                        height='100%'
                    >
                        <Button variant='outlined' color='primary' size='large' disabled={btnValue !== 'Approve'} onClick={handleApprove}>{btnValue}</Button>
                    </Box>
                </Grid>
                <Grid item xs={12} md={12} lg={12}>
                    <Box
                        display='flex'
                        flexDirection='column'
                        width='100%'
                    >
                        <ul>
                        {
                            contract.conditions.map((c, idx) => (
                                <li key={idx}>{c.category}, {c.operator}, {c.value}</li>
                            ))
                        }

                        </ul>
                    </Box>


                </Grid>
            </Grid>
        </StyledLayout>
    </Container>
);
}


export default ContractView;
