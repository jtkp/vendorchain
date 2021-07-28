import React from 'react';
import {
    Box,
    Button,
    Paper,
    FormControl,
    Select,
    MenuItem,
    FormHelperText,
    InputLabel,
    TextField,
    IconButton,
    Typography
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';

import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
  }));

const Conditionsitem = ({ condition, idx, removeCondition }) => {
  const classes = useStyles();
  const [id, setId] = React.useState(-1); 
  const [category, setCategory] = React.useState('');
  const [operator, setOperator] = React.useState('');
//   const [lo, setLo] = React.useState(0);
//   const [hi, setHi] = React.useState(0);
  const [number, setNumber] = React.useState(0);


  React.useEffect(() => {
    setId(condition.id);
    setCategory(condition.categories);
    setOperator(condition.operator);
    // setLo(condition.input);
    // setHi(condition.input)
    setNumber(condition.value);
  }, []);


  return (
    <Paper 
        key={idx}
        elevation={0}
        variant='outlined'
        style={{ marginTop: '10px', marginBottom: '10px', padding: '20px'}}
    >
        <Typography variant="h6">id = {id}</Typography>
        <Box display='flex' flexDirection='row' justifyContent='space-between'>
                <FormControl className={classes.formControl}>
                    <InputLabel id="category-label">Category</InputLabel>
                    <Select
                        labelId="categories"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className={classes.selectEmpty}
                    >
                        <MenuItem value=""></MenuItem>
                        <MenuItem value="Category 1">Category 1</MenuItem>
                        <MenuItem value="Category 2">Category 2</MenuItem>
                        <MenuItem value="Category 3">Category 3</MenuItem>
                    </Select>
                    <FormHelperText>Required</FormHelperText>
                </FormControl>
                <FormControl className={classes.formControl}>
                    <InputLabel id="operator-label">Operator</InputLabel>
                    <Select
                        labelId="operator"
                        value={operator}
                        onChange={(e) => setOperator(e.target.value)}
                        className={classes.selectEmpty}
                    >
                        <MenuItem value=""></MenuItem>
                        <MenuItem value="<">{'<'}</MenuItem>
                        <MenuItem value="<=">{'<='}</MenuItem>
                        <MenuItem value=">">{'>'}</MenuItem>
                        <MenuItem value=">=">{'>='}</MenuItem>
                        <MenuItem value="=">{'='}</MenuItem>
                    </Select>
                    <FormHelperText>Required</FormHelperText>
                </FormControl>
                <FormControl className={classes.formControl}>
                    <InputLabel id="number-label" />
                    <TextField
                        id="value"
                        label="Value" 
                        type="number"
                        value={number}
                        onChange={(e) => setNumber(e.target.value)}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                    <FormHelperText>Required</FormHelperText>
                </FormControl>
                {/* <FormControl className={classes.formControl}>
                    <InputLabel id="number-label" />
                    <TextField
                        id="range-hi"
                        label="Range-hi"
                        type="number"
                        value={number}
                        onChange={(e) => setNumber(e.target.value)}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                    <FormHelperText>Required</FormHelperText>
                </FormControl> */}
            <div>
                <IconButton edge="end" aria-label="delete" onClick={removeCondition}>
                    <DeleteIcon />
                </IconButton>
            </div>
        </Box>
    </Paper>

  )
};

export default Conditionsitem;
