import React from 'react';
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@material-ui/core';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import makeAPIRequest from '../../Api';

const CreateContractModal = ({ contracts, setContracts }) => {
  const [open, setOpen] = React.useState(false);
  const [name, setName] = React.useState('');
  const [errorText, setErrorText] = React.useState();

  const [desc, setDesc] = React.useState('');

  const [expiryDate, setExpiryDate] = React.useState(new Date().toISOString().slice(0, 10));
  const [startDate, setStartDate] = React.useState(new Date().toISOString().slice(0, 10));

  const [amount, setAmount] = React.useState(0);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  // Handler for opening the 'create new game' modal
  const handleClickOpen = () => {
    setErrorText();
    setOpen(true);
  };

  // Handler for closing the 'create new game' modal
  const handleClose = () => {
    setOpen(false);
  };

  // Handler for submitting the name to the new game
  const handleSubmit = () => {
    // Empty name is not allowed
    if (!name) {
      setErrorText('Contract name cannot be empty.')
    } else {
      createNewContract(name);
      setOpen(false);
    }
  }

  const createNewContract = (value) => {
    const newC = JSON.stringify({
      title: value,
      description: desc,
      client: JSON.parse(localStorage.getItem('user')).address,
      expiryDate: new Date(expiryDate).getTime() / 1000,
      startDate: new Date(startDate).getTime() / 1000,
      amount: amount,
      conditions: []
    })

    makeAPIRequest('contract', 'POST', null, null, newC)
      .then(res => {
        alert('Successfully create contract ' + value);
        return res;
      }).then (res => setContracts([...contracts, res])
      ).then(() => window.location.reload()
      ).catch(err => {
        console.log(err);
        alert("Something bad happened, please try again.")
      })
    
  }

  return (
    <div>
      <Button
        onClick={handleClickOpen}
        variant="outlined"
        color="primary"
      >
        Create a new contract
      </Button>
        {/* XXX: accessibility: labelledby: https://material-ui.com/zh/components/modal/ */}
      <Dialog
        open={open}
        onClose={handleClose}
        fullScreen={fullScreen}
        aria-labelledby="create-new-contract-title"
      >
        <DialogTitle id="create-new-contract-title">Create a new contract</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To make a new contract, please enter a name.
          </DialogContentText>
          <TextField
            autoFocus
            required
            label="Contract Name"
            fullWidth
            error={Boolean(errorText)}
            helperText={errorText}
            onChange={e => setName(e.target.value)}
          />
          <TextField
            required
            label="Description"
            fullWidth
            error={desc === ''}
            helperText={desc === '' ? "Description cannot be empty" : ""}
            onChange={e => setDesc(e.target.value)}
          />
          <TextField
            required
            label="Start Date"
            type="date"
            defaultValue={startDate}
            error={startDate === ''}
            helperText={startDate === '' ? "Start date cannot be empty" : ""}
            onChange={e => setStartDate(e.target.value)}
          />
          <br/>
          <br/>
          <TextField
            required
            label="Expiry Date"
            type="date"
            defaultValue={expiryDate}
            error={expiryDate === ''}
            helperText={expiryDate === '' ? "Expiry date cannot be empty" : ""}
            onChange={e => setExpiryDate(e.target.value)}
          />
          <br/>
          <br/>
          <TextField
            required
            label="Payment Amount"
            type="number"
            defaultValue="0"
            error={amount === ''}
            helperText={amount === '' ? "Payment amount cannot be empty" : ""}
            onChange={e => setAmount(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default CreateContractModal;
