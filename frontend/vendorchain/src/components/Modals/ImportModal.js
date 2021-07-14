import React from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
} from '@material-ui/core';
import PropTypes from 'prop-types';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
// import ReactPlayer from 'react-player/youtube';
import FileUploadBtn from '../Buttons/FileUploadBtn';
// import { toFriendlyFormat } from '../../TimeManipulation';
import Subtitle from '../Titles/Subtitle';

const ImportModal = ({ contracts, setContracts }) => {
  const [open, setOpen] = React.useState(false);
  const [data, setData] = React.useState();
  const [loading, setLoading] = React.useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  // Handler for opening the 'import gmae data' modal
  const handleClickOpen = () => {
    setOpen(true);
  };

  // Handler for closing the 'import gmae data' modal
  const handleClose = () => {
    setData();
    setOpen(false);
  };

  // Handler for submitting the data to create new game
  const handleSubmit = () => {
    setOpen(false);
    alert("File imported");
    // setLoading(true);
  }

  if (loading) {
    return (
      <Dialog
        open={true}
        aria-labelledby='loading-dialog-title'
        aria-describedby='loading-dialog-description'
      >
        <DialogTitle id="loading-dialog-title">Importing Contract</DialogTitle>
        <DialogContent>
          <DialogContentText id="loading-dialog-description">
            Please wait patiently. Thank you :)
          </DialogContentText>
        </DialogContent>
      </Dialog>
    )
  }
  return (
    <div>
       <Button
        onClick={handleClickOpen}
        variant="outlined"
        color="primary">
        Import Contract
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        fullScreen={fullScreen}
        maxWidth='sm'
        fullWidth
        aria-labelledby="create-new-quiz-title"
      >
        <DialogTitle id="create-new-quiz-title">
          Import Contract Data
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            To import a new contract, please upload the <b>json</b> file that contains contract data
          </DialogContentText>

          <FileUploadBtn fileType=".json" setData={setData}/>
          {
            //  data preview
            data && (
              <Box display='flex' flexDirection='column'>
                {/* // TODO: preview data */}
                Preview data here
              </Box>
            )
          }
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
};

ImportModal.propTypes = {
  setContracts: PropTypes.func,
  contracts: PropTypes.array,
};

export default ImportModal;
