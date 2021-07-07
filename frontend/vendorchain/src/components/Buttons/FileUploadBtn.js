import React from 'react';
import {
  Box,
  Button, Typography,
} from '@material-ui/core';
import PropTypes from 'prop-types';
import styled from 'styled-components';
// import { toFriendlyFormat } from '../../TimeManipulation';

const HiddenInput = styled.input`
  display: none;
`;

const FileUploadBtn = ({ fileType, setData }) => {
  const [fileInfo, setFileInfo] = React.useState();

  // read file
  const handleChange = (e) => {
    setFileInfo(e.target.files[0])
    const isJSON = e.target.files[0].type.includes('json');
    const fileReader = new FileReader();
    fileReader.onload = (e) => {
      let data = null;
      // parse JSON file directly
      if (isJSON) {
        data = JSON.parse(e.target.result);

      // fails to implement csv file parsing
      } else {
        console.log(e.target.result)
      }
      setData(data);
    }
    fileReader.readAsText(e.target.files[0]);
  }
  return (
    <Box
      display='flex'
      flexDirection='row'
      alignItems='center'
    >
      <HiddenInput
        accept={fileType}
        id="file-upload-button"
        type="file"
        onChange={handleChange}
      />
      <label htmlFor="file-upload-button">
        <Button variant="outlined" color="primary" component="span">
            Import
        </Button>
      </label>
      {
        fileInfo && (
          <Box p={3}>
            <Typography variant='body1'>{`${fileInfo.name} (${fileInfo.size}KB) `}</Typography>
            {/* <Typography variant='body1'>{`Last Modified at ${toFriendlyFormat(fileInfo.lastModifiedDate)}`}</Typography> */}
          </Box>
        )

      }
    </Box>
  );
};

FileUploadBtn.propTypes = {
  fileType: PropTypes.string,
  setData: PropTypes.func,
};

export default FileUploadBtn;
