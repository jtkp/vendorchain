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

const CreateContractModal = ({ setContracts }) => {
  const [open, setOpen] = React.useState(false);
  const [name, setName] = React.useState('');
  const [errorText, setErrorText] = React.useState();
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
    const body = JSON.stringify({
      name: value
    })
    // TODO: push the contract to db
    localStorage.setItem('contract', body);
    alert('Successfully create contract ' + value);
    setContracts([{name: value}]);
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
