import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
    Box,
    Button,
} from '@material-ui/core';
import Conditionsitem from './ConditionsItem';


const conditionObj = {
    categories: '',
    operator: '',
    input: 0,
}

const ConditionsForm = () => {
    const [conditions, setConditions] = React.useState([]);
    const addCondition = () => {
        setConditions([...conditions, conditionObj]);
    }
    const removeCondition = (e) => {
        const newConditions = [...conditions];
        //TODO:
        // conditions.splice(conditions.indexOf(e.target), 1);
        setConditions(newConditions);
    }



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
                    conditions.map((c, idx) => <Conditionsitem condition={c} idx={idx} key={idx} removeCondition={removeCondition()} />)
                }
            </Box>
        </>
    );
};

export default ConditionsForm;
