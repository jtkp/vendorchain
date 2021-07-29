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
import InvitePartyModal from '../components/Modals/InvitePartyModal';

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
    const [payee, setPayee] = React.useState();
    const [payable, setPayable] = React.useState();

    // const [btnValue, setBtnValue] = React.useState('');

    // const handleSubmit = (values, { setSubmitting }) => {
    //     const body = JSON.stringify({
            
    //     })
    //     // TODO: submit a new contract
    // }

    const handlePayment = (e) => {
        const body = JSON.stringify({
            client: contract.client
        })
        makeAPIRequest(`/contracts/${params.address}/pay`, 'POST', null, null, body)
            .then(res => {
                alert(res.msg);
                setPayable(false);
            }).catch(err => {
                console.log(err);
                alert("Error paying contract.");
            })
    }

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


    React.useEffect(() => {
        //  fetch conditions blockchain
        makeAPIRequest(`contract/${params.address}`, 'GET', null, null, null) 
            .then(res => {
                console.log(res)
                setContract(res);
                setConditions(res.conditions);
                // if (res.stages === 1) setBtnValue('Approve');
                // else if (res.stages === 3) setBtnValue('Approved');
                // else setBtnValue('No Action Required');

            }).then(
                // fetch payee
                makeAPIRequest(`payee/${params.address}`, 'GET', null, null, null)
                    .then(res => {
                        if (res.length !== 0){
                            setPayee(res);
                        }
                    })
                    .catch(err => {
                        alert("ERROR fetching payee");
                        console.log(err);
                    })
                
                // TODO: fetch payable 
                makeAPIRequest()
                
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
                    <Typography varaint='body1'>{payee.name}</Typography>
                </Grid>
                <Grid item xs={12} md={6} lg={6}>
                    <Box
                        display='flex'
                        flexDirection='column'
                        justifyContent='space-around'
                        alignItems='flex-end'
                        height='100%'
                    >
                        {/* invite party btn */}
                        <InvitePartyModal fetchedPayee={payee} />

                        {/* store payment btn */}
                        <Button variant='outlined' color='primary' size='large' disabled={!payable} onClick={handlePayment}>Send Payment</Button>

                        {/* approve btn */}
                        {/* <Button variant='outlined' color='primary' size='large' disabled={btnValue === ''}>{btnValue}</Button> */}
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
