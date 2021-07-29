import React from 'react';
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio
} from '@material-ui/core';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import makeAPIRequest from '../../Api';
import { useParams } from 'react-router-dom';

const InvitePartyModal = ({ fetchedPayee }) => {
  const params = useParams();
  const [open, setOpen] = React.useState(false);
  const [payee, setPayee] = React.useState(fetchedPayee);
  const [vendors, setVendors] = React.useState([]);
  const [value, setValue] = React.useState('');
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));


  React.useEffect(() => {
    // get all vendors (users except for admin)
    makeAPIRequest('vendors', 'GET', null, null, null)
      .then(res => {
        setVendors(res);
      })
      .catch(err => {
        console.log(err);
        alert("ERROR fetching vendors");
      })

  }, [])

  // Handler for opening the 'create new game' modal
  const handleClickOpen = () => {
    setOpen(true);
  };

  // Handler for closing the 'create new game' modal
  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (e) => {
    setPayee(e.target.value);
  }

  // Handler for submitting the name to the new game
  const handleSubmit = () => {
    const body = JSON.stringify({
      contractAddress: params.address,
      partyAddress: payee.address
    })
    makeAPIRequest('/contract/payee', 'POST', null, null, body)
      .then(res => {
        alert("Successfully invite payee " + payee.name);
        setOpen(false);
        window.location.reload();

      }).catch(err => {
        console.log(err);
        alert("Error inviting payee");
      })

  }

  console.log(fetchedPayee);

  if (fetchedPayee !== undefined) {
    return (
      <Button 
      variant="outlined"
      color="primary"
      disabled
      >
      Invite Party
      </Button>
    )
  }
  return (
    <div>
      <Button
        onClick={handleClickOpen}
        variant="outlined"
        color="primary"
      >
        Invite party
      </Button>
        {/* XXX: accessibility: labelledby: https://material-ui.com/zh/components/modal/ */}
      <Dialog
        open={open}
        onClose={handleClose}
        fullScreen={fullScreen}
        aria-labelledby="create-new-contract-title"
      >
        <DialogTitle id="create-new-contract-title">Invite Party</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To invite a party, please select a user
          </DialogContentText>
          <FormControl component="fieldset">
            <FormLabel component="legend">Name</FormLabel>
            <RadioGroup aria-label="gender" name="gender1" value={value} onChange={handleChange}>
              {
                vendors.map((v, idx) => <FormControlLabel key={idx} value={v} control={<Radio />} label={v.name} />)
              }
            </RadioGroup>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary" disabled={payee === undefined}>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default InvitePartyModal;
