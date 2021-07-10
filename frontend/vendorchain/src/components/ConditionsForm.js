import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
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
    IconButton
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';

const useStyles = makeStyles((theme) => ({
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
  }));

const conditionObj = {
    categories: '',
    operator: '',
    input: 0,
}

const ConditionsForm = () => {
    const classes = useStyles();
    const [conditions, setConditions] = React.useState([]);
    const addCondition = () => {
        setConditions([...conditions, conditionObj]);
    }
    const removeCondition = (e) => {
        console.log(document.forms[1])
    }

    const conditionItem = (c, idx) =>
        <Paper 
            key={idx}
            elevation={0}
            variant='outlined'
            style={{ marginTop: '10px', marginBottom: '10px', padding: '20px'}}
        >
            <Box display='flex' flexDirection='row' justifyContent='space-between'>
                <form>
                    <FormControl className={classes.formControl}>
                        <InputLabel id="category-label">Category</InputLabel>
                        <Select
                            labelId="categories"
                            value={conditions[idx].categories}
                            onChange={(e) => {
                                const copy = conditions;
                                copy[idx].categories = e.target.value;
                                console.log('copy', copy);
                                setConditions(copy);
                            }}
                            className={classes.selectEmpty}
                        >
                            <MenuItem value=""></MenuItem>
                            <MenuItem value="Category 1">Category 1</MenuItem>
                            <MenuItem value="Category 2">Category 2</MenuItem>
                            <MenuItem value="Category 3">Category 3</MenuItem>
                        </Select>
                        <FormHelperText>Required</FormHelperText>
                    </FormControl>
                </form>
                <form>
                <FormControl className={classes.formControl}>
                    <InputLabel id="operator-label">Operator</InputLabel>
                    <Select
                        labelId="operator"
                        value={conditions[idx].operator}
                        onChange={(e) => {
                            const copy = conditions;
                            copy[idx].operator = e.target.value;
                            console.log('copy', copy);
                            setConditions(copy);
                        }}
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
                </form>
                <form>
                <FormControl className={classes.formControl}>
                    <InputLabel id="number-label">Value</InputLabel>
                    <TextField
                        id="number"
                        label="Number"
                        type="number"
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                    <FormHelperText>Required</FormHelperText>
                </FormControl>
                </form>
                <div>
                    <IconButton edge="end" aria-label="delete" onClick={removeCondition}>
                        <DeleteIcon />
                    </IconButton>
                </div>
            </Box>

        </Paper>

    console.log(conditions)    
    return (
        <>
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
                    conditions.map((c, idx) => conditionItem(c, idx))
                }

            </Box>
        </>
    );
};

export default ConditionsForm;
